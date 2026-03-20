/**
 * check-alerts — Supabase Edge Function
 *
 * Runs on a cron schedule (see supabase/config.toml).
 * For each active cohort, checks every enrolled student and fires mentor alerts:
 *
 *   > 48 h no activity  → yellow  alert  (inactive_48h)
 *   > 72 h no activity  → red     alert  (inactive_72h)  — resolves the yellow
 *   Saturday + no deliverable submitted → red alert (no_deliverable)
 *
 * Idempotent: never creates duplicate unresolved alerts of the same type.
 *
 * CONTEXT.md §11 rules 5 & 6:
 *   "48hrs no activity_log entry → set yellow alert for mentor"
 *   "Saturday no deliverable submitted → set red alert for mentor"
 */

import { createClient } from 'npm:@supabase/supabase-js@2'

// ── Types (minimal — mirrors src/types/index.ts) ──────────────────────────────

type AlertType = 'inactive_48h' | 'inactive_72h' | 'no_deliverable' | 'buddy_no_response'
type Severity  = 'yellow' | 'red'

interface AlertInsert {
  student_id: string
  cohort_id:  string
  alert_type: AlertType
  severity:   Severity
  message:    string
  is_resolved: false
}

interface ExistingAlert {
  id:         string
  student_id: string
  alert_type: AlertType
  severity:   Severity
}

interface StudentRow {
  user_id:              string
  hours_since_activity: number | null
  enrollment_status:    string
}

interface Cohort {
  id:           string
  name:         string
  current_week: number
}

// ── Handler ───────────────────────────────────────────────────────────────────

Deno.serve(async (_req: Request): Promise<Response> => {
  // Use SERVICE ROLE key — this bypasses RLS intentionally.
  // The function is internal and never exposed to end users.
  const supabaseUrl            = Deno.env.get('SUPABASE_URL')
  const supabaseServiceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')

  if (!supabaseUrl || !supabaseServiceRoleKey) {
    return json({ ok: false, error: 'Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY' }, 500)
  }

  const db = createClient(supabaseUrl, supabaseServiceRoleKey, {
    auth: { persistSession: false },
  })

  const now        = new Date()
  const isSaturday = now.getDay() === 6   // 0 = Sunday … 6 = Saturday
  const runId      = now.toISOString()

  const log:    string[] = [`[${runId}] check-alerts started — isSaturday=${isSaturday}`]
  const errors: string[] = []

  // ── 1. All active cohorts ───────────────────────────────────────────────────

  const { data: cohorts, error: cohortErr } = await db
    .from('cohorts')
    .select('id, name, current_week')
    .eq('status', 'active')

  if (cohortErr || !cohorts) {
    return json({ ok: false, error: cohortErr?.message ?? 'No cohorts returned' }, 500)
  }

  log.push(`Found ${cohorts.length} active cohort(s)`)

  for (const cohort of cohorts as Cohort[]) {

    // ── 2. Active students for this cohort (via student_progress view) ────────
    // student_progress already computes hours_since_activity in Postgres.

    const { data: students, error: studentsErr } = await db
      .from('student_progress')
      .select('user_id, hours_since_activity, enrollment_status')
      .eq('cohort_id', cohort.id)
      .eq('enrollment_status', 'active')

    if (studentsErr || !students?.length) {
      log.push(`[${cohort.name}] No active students — skipping`)
      continue
    }

    const studentIds = (students as StudentRow[]).map(s => s.user_id)
    log.push(`[${cohort.name}] ${studentIds.length} active students`)

    // ── 3. Existing unresolved alerts (to guarantee idempotency) ─────────────

    const { data: existingAlerts } = await db
      .from('mentor_alerts')
      .select('id, student_id, alert_type, severity')
      .eq('cohort_id', cohort.id)
      .eq('is_resolved', false)
      .in('student_id', studentIds)

    // "student_id:alert_type" → fast O(1) lookup
    const existingKey = new Set(
      (existingAlerts as ExistingAlert[] ?? []).map(a => `${a.student_id}:${a.alert_type}`)
    )

    const toInsert:  AlertInsert[] = []
    const toResolve: string[]      = []   // alert IDs to mark resolved

    // ── 4. Activity thresholds — per student ──────────────────────────────────

    for (const s of students as StudentRow[]) {
      const h = s.hours_since_activity

      // Under threshold — nothing to do
      if (h === null || h < 48) continue

      if (h >= 72) {
        // ─── RED: inactive_72h ───────────────────────────────────────────────
        // Resolve the yellow predecessor if it exists (alert upgrade)
        const yellowId = (existingAlerts as ExistingAlert[])?.find(
          a => a.student_id === s.user_id && a.alert_type === 'inactive_48h'
        )?.id
        if (yellowId) toResolve.push(yellowId)

        // Only insert if red not already open
        if (!existingKey.has(`${s.user_id}:inactive_72h`)) {
          toInsert.push({
            student_id:  s.user_id,
            cohort_id:   cohort.id,
            alert_type:  'inactive_72h',
            severity:    'red',
            message:     `Sin actividad por más de ${Math.floor(h)} horas — intervención urgente`,
            is_resolved: false,
          })
        }

      } else {
        // ─── YELLOW: inactive_48h (48 ≤ h < 72) ─────────────────────────────
        // Skip if any inactivity alert (yellow or red) already open
        const alreadyFlagged =
          existingKey.has(`${s.user_id}:inactive_48h`) ||
          existingKey.has(`${s.user_id}:inactive_72h`)

        if (!alreadyFlagged) {
          toInsert.push({
            student_id:  s.user_id,
            cohort_id:   cohort.id,
            alert_type:  'inactive_48h',
            severity:    'yellow',
            message:     `Sin actividad por más de ${Math.floor(h)} horas`,
            is_resolved: false,
          })
        }
      }
    }

    // ── 5. Saturday: pending deliverables → red alert ─────────────────────────

    if (isSaturday) {
      const { data: weekRow } = await db
        .from('weeks')
        .select('id')
        .eq('cohort_id', cohort.id)
        .eq('week_number', cohort.current_week)
        .maybeSingle()

      if (weekRow) {
        // Fetch deliverables for this week — one query for all students
        const { data: deliverables } = await db
          .from('deliverables')
          .select('user_id, status')
          .eq('week_id', weekRow.id)
          .in('user_id', studentIds)

        const submitted = new Set(
          (deliverables ?? [])
            .filter((d: { user_id: string; status: string }) =>
              d.status === 'submitted' || d.status === 'reviewed'
            )
            .map((d: { user_id: string }) => d.user_id)
        )

        for (const s of students as StudentRow[]) {
          if (!submitted.has(s.user_id) &&
              !existingKey.has(`${s.user_id}:no_deliverable`)) {
            toInsert.push({
              student_id:  s.user_id,
              cohort_id:   cohort.id,
              alert_type:  'no_deliverable',
              severity:    'red',
              message:     `No entregó el entregable de la semana ${cohort.current_week} (sábado)`,
              is_resolved: false,
            })
          }
        }

        log.push(
          `[${cohort.name}] Saturday check — ${submitted.size}/${studentIds.length} submitted ` +
          `— ${studentIds.length - submitted.size} missing`
        )
      } else {
        log.push(`[${cohort.name}] Saturday check skipped — week ${cohort.current_week} not found`)
      }
    }

    // ── 6. Commit: resolve upgraded alerts ────────────────────────────────────

    if (toResolve.length > 0) {
      const { error: resolveErr } = await db
        .from('mentor_alerts')
        .update({ is_resolved: true, resolved_at: now.toISOString() })
        .in('id', toResolve)

      if (resolveErr) {
        errors.push(`[${cohort.name}] resolve error: ${resolveErr.message}`)
      } else {
        log.push(`[${cohort.name}] Resolved ${toResolve.length} upgraded alert(s)`)
      }
    }

    // ── 7. Commit: insert new alerts ──────────────────────────────────────────

    if (toInsert.length > 0) {
      const { error: insertErr } = await db
        .from('mentor_alerts')
        .insert(toInsert)

      if (insertErr) {
        errors.push(`[${cohort.name}] insert error: ${insertErr.message}`)
      } else {
        log.push(
          `[${cohort.name}] Created ${toInsert.length} alert(s): ` +
          toInsert.map(a => `${a.alert_type}(${a.severity})`).join(', ')
        )
      }
    }

    if (toInsert.length === 0 && toResolve.length === 0) {
      log.push(`[${cohort.name}] No changes needed`)
    }
  }

  log.push(`[${runId}] check-alerts finished`)

  return json({
    ok:     errors.length === 0,
    log,
    errors: errors.length > 0 ? errors : undefined,
  }, errors.length > 0 ? 207 : 200)
})

// ── Utility ───────────────────────────────────────────────────────────────────

function json(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body, null, 2), {
    status,
    headers: { 'Content-Type': 'application/json' },
  })
}
