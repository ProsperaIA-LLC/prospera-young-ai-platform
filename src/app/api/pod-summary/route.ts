import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function POST(req: NextRequest) {
  const supabase = await createClient()

  // 1. Auth
  const { data: { user }, error: authError } = await supabase.auth.getUser()
  if (authError || !user) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
  }

  // 2. Body validation
  let body: { podId?: string; cohortId?: string; weekNumber?: number; summaryText?: string }
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'Cuerpo de solicitud inválido' }, { status: 400 })
  }

  const { podId, cohortId, weekNumber, summaryText } = body

  if (!podId || !cohortId || weekNumber == null || !summaryText?.trim()) {
    return NextResponse.json(
      { error: 'Faltan campos requeridos: podId, cohortId, weekNumber, summaryText' },
      { status: 400 }
    )
  }

  if (summaryText.trim().length > 1000) {
    return NextResponse.json({ error: 'El resumen no puede superar los 1000 caracteres' }, { status: 400 })
  }

  // 3. Verify caller is the pod leader for this pod
  const { data: membership, error: membershipError } = await supabase
    .from('pod_members')
    .select('is_pod_leader_this_week')
    .eq('pod_id', podId)
    .eq('user_id', user.id)
    .maybeSingle()

  if (membershipError) {
    return NextResponse.json({ error: 'Error verificando membresía' }, { status: 500 })
  }
  if (!membership) {
    return NextResponse.json({ error: 'No sos miembro de este pod' }, { status: 403 })
  }
  if (!membership.is_pod_leader_this_week) {
    return NextResponse.json(
      { error: 'Solo el Pod Leader puede enviar el resumen semanal' },
      { status: 403 }
    )
  }

  // 4. Insert summary (allow re-submission — latest entry is the current one)
  const { data: inserted, error: insertError } = await supabase
    .from('pod_summaries')
    .insert({
      pod_id: podId,
      cohort_id: cohortId,
      week_number: weekNumber,
      pod_leader_id: user.id,
      summary_text: summaryText.trim(),
      submitted_at: new Date().toISOString(),
    })
    .select('id, submitted_at')
    .single()

  if (insertError) {
    return NextResponse.json({ error: 'Error guardando el resumen' }, { status: 500 })
  }

  return NextResponse.json({ id: inserted.id, submittedAt: inserted.submitted_at }, { status: 201 })
}
