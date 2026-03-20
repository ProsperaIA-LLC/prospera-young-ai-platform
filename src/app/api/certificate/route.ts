/**
 * GET /api/certificate
 *
 * Returns the student's certificate eligibility status and their
 * competency scores for the active cohort.
 *
 * Conditions (CONTEXT.md §9):
 *   1. 100% attendance at live sessions
 *   2. All 6 weekly deliverables submitted
 *   3. Average 3.0+ across 4 competencies (scale 0–4)
 *   4. Presented at Demo Day
 */

import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { checkCertificateEligibility } from '@/lib/utils/certificate'
import type { CompetencyScores, CertificateConditions } from '@/lib/utils/certificate'

export async function GET() {
  const supabase = await createClient()

  // 1. Auth
  const { data: { user }, error: authError } = await supabase.auth.getUser()
  if (authError || !user) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
  }

  // 2. Active enrollment
  const { data: enrollment, error: enrollErr } = await supabase
    .from('enrollments')
    .select('cohort_id')
    .eq('user_id', user.id)
    .eq('status', 'active')
    .maybeSingle()

  if (enrollErr || !enrollment) {
    return NextResponse.json({ error: 'No se encontró una inscripción activa' }, { status: 404 })
  }

  // 2b. Cohort details (separate query — FK join not in typed Relationships)
  const { data: cohortRaw, error: cohortErr } = await supabase
    .from('cohorts')
    .select('id, name, market, start_date, end_date, current_week')
    .eq('id', enrollment.cohort_id)
    .single()

  if (cohortErr || !cohortRaw) {
    return NextResponse.json({ error: 'Cohorte no encontrada' }, { status: 404 })
  }

  // 3. Parallel: deliverables count + competency scores
  const [delivResult, scoresResult] = await Promise.all([
    supabase
      .from('deliverables')
      .select('id, status')
      .eq('user_id', user.id)
      .eq('cohort_id', enrollment.cohort_id)
      .in('status', ['submitted', 'reviewed']),

    supabase
      .from('competency_scores')
      .select('validation_score, creation_score, communication_score, growth_score, attendance_percent, presented_at_demo_day, scored_at')
      .eq('student_id', user.id)
      .eq('cohort_id', enrollment.cohort_id)
      .maybeSingle(),
  ])

  const submittedCount = delivResult.data?.length ?? 0
  const scoreRow = scoresResult.data

  // If mentor hasn't scored yet, return incomplete eligibility without error
  if (!scoreRow) {
    return NextResponse.json({
      eligible: false,
      scored: false,
      submittedDeliverables: submittedCount,
      conditions: null,
      eligibility: null,
      cohort: {
        id:        cohortRaw.id,
        name:      cohortRaw.name,
        market:    cohortRaw.market,
        startDate: cohortRaw.start_date,
        endDate:   cohortRaw.end_date,
      },
    })
  }

  const scores: CompetencyScores = {
    validation:    Number(scoreRow.validation_score),
    creation:      Number(scoreRow.creation_score),
    communication: Number(scoreRow.communication_score),
    growth:        Number(scoreRow.growth_score),
  }

  const conditions: CertificateConditions = {
    attendancePercent:     scoreRow.attendance_percent,
    deliverablesSubmitted: submittedCount,
    scores,
    presentedAtDemoDay:    scoreRow.presented_at_demo_day,
  }

  const eligibility = checkCertificateEligibility(conditions)

  return NextResponse.json({
    eligible:              eligibility.eligible,
    scored:                true,
    submittedDeliverables: submittedCount,
    conditions,
    eligibility,
    scores,
    cohort: {
      id:        cohortRaw.id,
      name:      cohortRaw.name,
      market:    cohortRaw.market,
      startDate: cohortRaw.start_date,
      endDate:   cohortRaw.end_date,
    },
  })
}
