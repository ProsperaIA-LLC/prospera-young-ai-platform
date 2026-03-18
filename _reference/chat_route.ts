// ============================================================
// /app/api/chat/route.ts
// API route for Próspero AI tutor
//
// POST /api/chat
// Body: { message: string, weekId: string, cohortId: string }
// Returns: { reply: string, dailyCount: number, limitReached: boolean }
//
// This route:
// 1. Authenticates the user via Supabase session
// 2. Checks daily message limit (server-side, cannot be bypassed)
// 3. Loads student context from the database
// 4. Detects escalation keywords → creates mentor alert if needed
// 5. Calls Próspero via /lib/anthropic/prospero.ts
// 6. Returns the reply
// ============================================================

import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import {
  chat,
  loadProsperoContext,
  shouldEscalateToMentor,
  createEscalationAlert,
} from '@/lib/anthropic/prospero'
import type { ChatRequest } from '@/types'

export async function POST(req: NextRequest) {
  try {
    // ── 1. Auth check ──────────────────────────────────────────
    const supabase = await createClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json(
        { error: 'No autorizado. Iniciá sesión para hablar con Próspero.' },
        { status: 401 }
      )
    }

    // ── 2. Parse and validate request body ────────────────────
    let body: ChatRequest
    try {
      body = await req.json()
    } catch {
      return NextResponse.json(
        { error: 'Request inválido.' },
        { status: 400 }
      )
    }

    const { message, weekId, cohortId } = body

    if (!message || typeof message !== 'string' || message.trim().length === 0) {
      return NextResponse.json(
        { error: 'El mensaje no puede estar vacío.' },
        { status: 400 }
      )
    }

    if (!weekId || !cohortId) {
      return NextResponse.json(
        { error: 'Falta weekId o cohortId.' },
        { status: 400 }
      )
    }

    // Sanitize message — limit length to prevent abuse
    const sanitizedMessage = message.trim().substring(0, 2000)

    // ── 3. Load student context from database ─────────────────
    const context = await loadProsperoContext(user.id, cohortId, weekId)

    if (!context) {
      return NextResponse.json(
        { error: 'No se pudo cargar el contexto del programa. Verificá que estés inscripto/a en esta cohorte.' },
        { status: 404 }
      )
    }

    // ── 4. Check escalation keywords ──────────────────────────
    if (shouldEscalateToMentor(sanitizedMessage)) {
      // Create mentor alert in background (don't await — don't slow the response)
      createEscalationAlert(user.id, cohortId, sanitizedMessage).catch(err =>
        console.error('[Chat API] Failed to create escalation alert:', err)
      )
    }

    // ── 5. Call Próspero ───────────────────────────────────────
    const result = await chat(user.id, { message: sanitizedMessage, weekId, cohortId }, context)

    // ── 6. Return response ─────────────────────────────────────
    return NextResponse.json({
      reply: result.reply,
      dailyCount: result.dailyCount,
      limitReached: result.limitReached,
    })

  } catch (error) {
    console.error('[Chat API] Unexpected error:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor. Intentá de nuevo en un momento.' },
      { status: 500 }
    )
  }
}

// ── GET — returns daily message count ─────────────────────────────────────────
// Used by the frontend to show the message counter in the chat UI

export async function GET(req: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: 'No autorizado.' }, { status: 401 })
    }

    const { data, error } = await supabase
      .rpc('get_daily_message_count', { p_user_id: user.id })

    if (error) {
      return NextResponse.json({ count: 0, remaining: 15 })
    }

    const count = data as number
    return NextResponse.json({
      count,
      remaining: Math.max(0, 15 - count),
      limitReached: count >= 15,
    })

  } catch (error) {
    console.error('[Chat API] GET error:', error)
    return NextResponse.json({ count: 0, remaining: 15 })
  }
}
