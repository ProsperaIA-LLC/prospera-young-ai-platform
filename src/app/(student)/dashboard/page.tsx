'use client'

import { useEffect, useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import type { User, Week, Deliverable, Pod, PodMember } from '@/types'

// ── Types ──────────────────────────────────────────────────────────────
interface PodMemberWithUser {
  podMember: PodMember
  user: Pick<User, 'id' | 'full_name' | 'nickname' | 'avatar_url' | 'country'>
}

interface DashData {
  user: User
  currentWeek: Week | null
  currentDeliverable: Deliverable | null
  pod: Pod | null
  podMembers: PodMemberWithUser[]
  streakDays: number
  cohortName: string
  cohortCurrentWeek: number
  submittedCount: number
  totalStudents: number
  daysLeft: number
  isSunday: boolean
}

const AVATAR_COLORS = ['var(--green)', 'var(--coral)', 'var(--teal)', 'var(--gold)', 'var(--magenta)']

function getInitials(name: string) {
  return name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()
}

// ── Nav Item ───────────────────────────────────────────────────────────
function NavItem({ icon, label, active, badge, href }: {
  icon: string; label: string; active?: boolean; badge?: number; href: string
}) {
  return (
    <a href={href} style={{ textDecoration: 'none' }}>
      <div style={{
        display: 'flex', alignItems: 'center', gap: '10px',
        padding: '10px 12px 10px 18px', margin: '1px 8px', borderRadius: '9px',
        fontSize: '14px', fontWeight: active ? 700 : 500,
        color: active ? 'var(--navy)' : 'rgba(255,255,255,0.72)',
        background: active ? 'var(--green)' : 'transparent',
        cursor: 'pointer', transition: 'all .15s',
      }}>
        <span style={{ fontSize: '15px', width: '20px', textAlign: 'center' }}>{icon}</span>
        {label}
        {badge ? (
          <span style={{
            marginLeft: 'auto', background: 'var(--coral)', color: '#fff',
            fontSize: '10px', fontWeight: 800, padding: '2px 7px', borderRadius: '20px',
          }}>{badge}</span>
        ) : null}
      </div>
    </a>
  )
}

// ── Próspero Chat Panel ────────────────────────────────────────────────
function ProsperoPanel({ user, week }: { user: User | null; week: Week | null }) {
  const [open, setOpen]       = useState(false)
  const [input, setInput]     = useState('')
  const [loading, setLoading] = useState(false)
  const [msgs, setMsgs]       = useState([{
    role: 'assistant' as const,
    content: `¡Hola ${user?.nickname || 'estudiante'}! Soy Próspero, tu tutor IA. Estoy acá para ayudarte con lo que necesités esta semana. ¿Por dónde empezamos? 🚀`,
  }])
  const msgsRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (msgsRef.current) msgsRef.current.scrollTop = msgsRef.current.scrollHeight
  }, [msgs])

  async function send(text?: string) {
    const message = text || input.trim()
    if (!message || loading) return
    setInput('')
    setLoading(true)
    setMsgs(prev => [...prev, { role: 'user' as const, content: message }])

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message, weekId: week?.id || '', cohortId: '' }),
      })
      const data = await res.json()
      setMsgs(prev => [...prev, { role: 'assistant', content: data.reply || 'Hubo un problema. ¿Lo intentás de nuevo?' }])
    } catch {
      setMsgs(prev => [...prev, { role: 'assistant', content: 'Hubo un problema de conexión. ¿Lo intentás de nuevo?' }])
    }
    setLoading(false)
  }

  const CHIPS: Record<string, string> = {
    '🛠 Prototipo':  '¿Cómo empiezo a construir mi prototipo esta semana?',
    '✦ Prompting':  'Enséñame prompting con Claude paso a paso',
    '🎯 Validación': '¿Cómo valido que mi problema es real?',
    '📋 Entregable': '¿Qué necesita tener mi entregable esta semana?',
  }

  return (
    <>
      {/* FAB */}
      <button onClick={() => setOpen(o => !o)} style={{
        position: 'fixed', bottom: '28px', right: '28px', zIndex: 200,
        width: '60px', height: '60px', borderRadius: '50%',
        background: open ? 'var(--ink2)' : 'var(--magenta)',
        border: 'none', cursor: 'pointer',
        boxShadow: open ? '0 4px 16px rgba(0,0,0,0.3)' : '0 4px 22px rgba(165,8,107,0.45)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        transition: 'all .2s', color: '#fff', fontSize: '26px',
      }}>
        {!open && <div style={{
          position: 'absolute', top: '-3px', right: '-3px', width: '14px', height: '14px',
          borderRadius: '50%', background: 'var(--green)', border: '2.5px solid var(--bg)',
        }} />}
        {open ? '✕' : '✦'}
      </button>

      {/* Panel */}
      <div style={{
        position: 'fixed', bottom: '102px', right: '28px', zIndex: 199,
        width: '388px', height: '570px', background: 'var(--white)',
        borderRadius: '22px', boxShadow: '0 24px 64px rgba(0,0,0,0.18)',
        display: 'flex', flexDirection: 'column',
        border: '1px solid var(--border)', overflow: 'hidden',
        transform: open ? 'scale(1) translateY(0)' : 'scale(0.9) translateY(24px)',
        transformOrigin: 'bottom right',
        opacity: open ? 1 : 0, pointerEvents: open ? 'all' : 'none',
        transition: 'all .28s cubic-bezier(0.34,1.56,0.64,1)',
      }}>
        {/* Header */}
        <div style={{ background: 'var(--navy)', padding: '16px 18px', display: 'flex', alignItems: 'center', gap: '12px', flexShrink: 0 }}>
          <div style={{ width: '42px', height: '42px', borderRadius: '50%', background: 'var(--magenta)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px', flexShrink: 0, position: 'relative' }}>
            ✦
            <div style={{ position: 'absolute', bottom: '1px', right: '1px', width: '11px', height: '11px', borderRadius: '50%', background: 'var(--green)', border: '2.5px solid var(--navy)' }} />
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontWeight: 800, fontSize: '15px', color: '#fff' }}>Próspero · Tutor IA</div>
            <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.55)', marginTop: '1px' }}>Disponible ahora · Semana {week?.week_number || '?'}</div>
          </div>
          <button onClick={() => setOpen(false)} style={{ background: 'rgba(255,255,255,0.1)', border: 'none', color: 'rgba(255,255,255,0.7)', width: '32px', height: '32px', borderRadius: '50%', cursor: 'pointer', fontSize: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>✕</button>
        </div>

        {/* Chips */}
        <div style={{ padding: '10px 14px', display: 'flex', gap: '6px', flexWrap: 'wrap', borderBottom: '1px solid var(--border)', flexShrink: 0 }}>
          {Object.keys(CHIPS).map(chip => (
            <button key={chip} onClick={() => send(CHIPS[chip])} style={{ fontSize: '12px', fontWeight: 600, padding: '4px 11px', borderRadius: '20px', background: 'var(--bg)', color: 'var(--ink2)', border: '1px solid var(--border)', cursor: 'pointer', fontFamily: 'inherit', whiteSpace: 'nowrap' }}>{chip}</button>
          ))}
        </div>

        {/* Messages */}
        <div ref={msgsRef} style={{ flex: 1, overflowY: 'auto', padding: '14px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {msgs.map((m, i) => (
            <div key={i} style={{ display: 'flex', gap: '8px', alignItems: 'flex-end', flexDirection: m.role === 'user' ? 'row-reverse' : 'row' }}>
              <div style={{ width: '30px', height: '30px', borderRadius: '50%', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', fontWeight: 800, color: '#fff', background: m.role === 'user' ? 'var(--teal)' : 'var(--magenta)' }}>
                {m.role === 'user' ? getInitials(user?.nickname || 'Tú') : '✦'}
              </div>
              <div style={{ maxWidth: '80%', display: 'flex', flexDirection: 'column', alignItems: m.role === 'user' ? 'flex-end' : 'flex-start' }}>
                <div style={{ padding: '10px 13px', borderRadius: m.role === 'user' ? '16px 4px 16px 16px' : '4px 16px 16px 16px', fontSize: '13px', lineHeight: 1.55, background: m.role === 'user' ? 'var(--magenta)' : 'var(--bg)', color: m.role === 'user' ? '#fff' : 'var(--ink)' }}>
                  {m.content}
                </div>
              </div>
            </div>
          ))}
          {loading && (
            <div style={{ display: 'flex', gap: '8px', alignItems: 'flex-end' }}>
              <div style={{ width: '30px', height: '30px', borderRadius: '50%', background: 'var(--magenta)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: '12px' }}>✦</div>
              <div style={{ background: 'var(--bg)', borderRadius: '4px 16px 16px 16px', padding: '12px 16px', display: 'flex', gap: '5px' }}>
                {[0, 1, 2].map(i => <div key={i} style={{ width: '7px', height: '7px', borderRadius: '50%', background: 'var(--ink4)', animation: `bounce 1.2s infinite ${i * 0.2}s` }} />)}
              </div>
            </div>
          )}
        </div>

        {/* Input */}
        <div style={{ padding: '12px 14px', borderTop: '1px solid var(--border)', display: 'flex', gap: '8px', alignItems: 'flex-end', flexShrink: 0 }}>
          <textarea value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send() } }} placeholder="Preguntale algo a Próspero..." rows={1}
            style={{ flex: 1, border: '1.5px solid var(--border)', borderRadius: '12px', padding: '9px 13px', fontSize: '13px', color: 'var(--ink)', fontFamily: 'inherit', resize: 'none', outline: 'none', background: 'var(--bg)', maxHeight: '90px', lineHeight: 1.5 }} />
          <button onClick={() => send()} disabled={!input.trim() || loading} style={{ width: '40px', height: '40px', borderRadius: '50%', background: !input.trim() || loading ? 'var(--ink4)' : 'var(--magenta)', border: 'none', color: '#fff', cursor: !input.trim() || loading ? 'not-allowed' : 'pointer', fontSize: '17px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>➤</button>
        </div>
      </div>
    </>
  )
}

// ── Main Dashboard ─────────────────────────────────────────────────────
export default function DashboardPage() {
  const router = useRouter()
  const [data, setData] = useState<DashData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      const supabase = createClient()
      const { data: { user: authUser } } = await supabase.auth.getUser()
      if (!authUser) { router.push('/login'); return }

      const { data: profile } = await supabase.from('users').select('*').eq('id', authUser.id).single()
      if (!profile) { router.push('/onboarding'); return }

      const { data: enrollment } = await supabase
        .from('enrollments').select('*, cohorts(*)').eq('user_id', authUser.id).eq('status', 'active').single()

      const cohort = enrollment?.cohorts as { id: string; name: string; current_week: number } | null

      let currentWeek: Week | null = null
      if (cohort) {
        const { data: w } = await supabase.from('weeks').select('*').eq('cohort_id', cohort.id).eq('week_number', cohort.current_week).single()
        currentWeek = w
      }

      let currentDeliverable: Deliverable | null = null
      if (currentWeek) {
        const { data: d } = await supabase.from('deliverables').select('*').eq('user_id', authUser.id).eq('week_id', currentWeek.id).maybeSingle()
        currentDeliverable = d
      }

      let pod: Pod | null = null
      let podMembers: PodMemberWithUser[] = []

      if (cohort) {
        const { data: pmData } = await supabase.from('pod_members').select('*, pods(*)').eq('user_id', authUser.id).eq('cohort_id', cohort.id).maybeSingle()
        if (pmData?.pods) {
          pod = pmData.pods as unknown as Pod
          const { data: allMembers } = await supabase.from('pod_members').select('*, users(*)').eq('pod_id', pod.id)
          podMembers = (allMembers || []).map((m: any) => ({ podMember: m, user: m.users }))
        }
      }

      let daysLeft = 0
      if (currentWeek?.due_date) {
        const due = new Date(currentWeek.due_date)
        daysLeft = Math.max(0, Math.ceil((due.getTime() - Date.now()) / (1000 * 60 * 60 * 24)))
      }

      setData({
        user: profile,
        currentWeek,
        currentDeliverable,
        pod,
        podMembers,
        streakDays: 0,
        cohortName: cohort?.name || 'Cohorte 1',
        cohortCurrentWeek: cohort?.current_week || 1,
        submittedCount: 0,
        totalStudents: 30,
        daysLeft,
        isSunday: new Date().getDay() === 0,
      })
      setLoading(false)
    }
    load()
  }, [router])

  if (loading) return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg)', color: 'var(--ink3)', fontSize: '14px' }}>
      Cargando tu semana...
    </div>
  )

  if (!data) return null

  const { user, currentWeek, currentDeliverable, pod, podMembers, streakDays, cohortName, cohortCurrentWeek, daysLeft, isSunday } = data
  const nickname = user.nickname || user.full_name.split(' ')[0]
  const isSubmitted = currentDeliverable?.status === 'submitted' || currentDeliverable?.status === 'reviewed'

  const today = new Date()
  const DAYS = ['domingo', 'lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado']
  const MONTHS = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre']
  const todayStr = `${DAYS[today.getDay()].charAt(0).toUpperCase() + DAYS[today.getDay()].slice(1)} · ${today.getDate()} de ${MONTHS[today.getMonth()]}`
  const phaseEmoji: Record<string, string> = { Despertar: '💡', Construir: '🛠', Lanzar: '🚀' }

  return (
    <div style={{ display: 'flex', minHeight: '100vh', fontFamily: "-apple-system,'Segoe UI',system-ui,sans-serif" }}>

      {/* ── SIDEBAR ── */}
      <div style={{ width: '236px', minWidth: '236px', background: 'var(--navy)', display: 'flex', flexDirection: 'column', minHeight: '100vh', flexShrink: 0 }}>
        <div style={{ padding: '22px 18px 18px', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '4px' }}>
            <div style={{ width: '34px', height: '34px', background: 'var(--green)', borderRadius: '9px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900, fontSize: '16px', color: 'var(--navy)', flexShrink: 0 }}>P</div>
            <div style={{ fontWeight: 800, fontSize: '17px', color: '#fff', letterSpacing: '-0.4px' }}>Prospera</div>
          </div>
          <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.5)', paddingLeft: '44px' }}>Young AI · {cohortName}</div>
        </div>

        <div style={{ fontSize: '11px', fontWeight: 700, color: 'rgba(255,255,255,0.45)', textTransform: 'uppercase', letterSpacing: '0.08em', padding: '16px 18px 6px' }}>Principal</div>
        <NavItem icon="◈" label="Mi semana"    active href="/dashboard" />
        <NavItem icon="□" label="Entregables"  href="/deliverables" badge={isSubmitted ? 0 : 1} />
        <NavItem icon="◎" label="Mi diario"    href="/diary" />

        <div style={{ fontSize: '11px', fontWeight: 700, color: 'rgba(255,255,255,0.45)', textTransform: 'uppercase', letterSpacing: '0.08em', padding: '16px 18px 6px' }}>Comunidad</div>
        <NavItem icon="⬡" label="Mi pod"            href="/pod" />
        <NavItem icon="▷" label="Sesión del sábado" href="#" />

        <div style={{ fontSize: '11px', fontWeight: 700, color: 'rgba(255,255,255,0.45)', textTransform: 'uppercase', letterSpacing: '0.08em', padding: '16px 18px 6px' }}>Mi proyecto</div>
        <NavItem icon="⊕" label="Prototipo" href="/project" />

        <div style={{ flex: 1 }} />

        <div style={{ padding: '14px 10px', borderTop: '1px solid rgba(255,255,255,0.08)' }}>
          {pod && (
            <a href="/pod" style={{ textDecoration: 'none' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '9px 10px', borderRadius: '10px', background: 'rgba(255,255,255,0.05)', cursor: 'pointer' }}>
                <div style={{ display: 'flex' }}>
                  {podMembers.slice(0, 4).map((m, i) => (
                    <div key={m.user.id} style={{ width: '24px', height: '24px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '9px', fontWeight: 800, color: '#fff', background: AVATAR_COLORS[i % AVATAR_COLORS.length], border: '2px solid var(--navy)', marginRight: '-5px', flexShrink: 0 }}>
                      {getInitials(m.user.nickname || m.user.full_name)}
                    </div>
                  ))}
                </div>
                <div style={{ marginLeft: '9px' }}>
                  <div style={{ fontSize: '13px', color: 'rgba(255,255,255,0.82)', fontWeight: 600 }}>{pod.name}</div>
                  <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.45)' }}>{podMembers.length} miembros</div>
                </div>
              </div>
            </a>
          )}
        </div>
      </div>

      {/* ── MAIN ── */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>

        {/* Topbar */}
        <div style={{ background: 'rgba(245,244,240,0.96)', borderBottom: '1px solid var(--border)', padding: '12px 28px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'sticky', top: 0, zIndex: 50 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ background: 'var(--navy)', color: 'rgba(255,255,255,0.65)', fontSize: '12px', fontWeight: 600, padding: '5px 14px', borderRadius: '20px' }}>
              Semana <span style={{ color: 'var(--green)', fontWeight: 800 }}>{cohortCurrentWeek}</span> de 6 · {DAYS[today.getDay()].charAt(0).toUpperCase() + DAYS[today.getDay()].slice(1)}
            </div>
            {currentWeek && <div style={{ fontSize: '12px', color: 'var(--ink3)', fontWeight: 500 }}>Fase {currentWeek.phase} {phaseEmoji[currentWeek.phase] || ''}</div>}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            {streakDays > 0 && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', background: 'var(--gold-l)', border: '1px solid rgba(224,163,38,0.3)', padding: '6px 14px', borderRadius: '20px', fontSize: '13px', fontWeight: 600, color: 'var(--ink2)' }}>
                🔥 {streakDays} días seguidos
              </div>
            )}
            <div style={{ width: '34px', height: '34px', borderRadius: '50%', background: 'var(--teal)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px', cursor: 'pointer' }}>
              {user.avatar_url && user.avatar_url.length <= 2 ? user.avatar_url : getInitials(nickname)}
            </div>
          </div>
        </div>

        {/* Content */}
        <div style={{ padding: '24px 28px 40px', flex: 1, overflowY: 'auto' }}>

          {/* Greeting */}
          <div style={{ marginBottom: '22px', display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between' }}>
            <div>
              <div style={{ fontSize: '13px', color: 'var(--ink3)', marginBottom: '3px' }}>{todayStr}</div>
              <div style={{ fontWeight: 800, fontSize: '28px', color: 'var(--ink)', lineHeight: 1.1 }}>Hola, {nickname} 👋</div>
              <div style={{ fontSize: '13px', color: 'var(--ink3)', marginTop: '4px' }}>
                {isSubmitted ? '¡Ya entregaste esta semana! Mirá cómo va tu pod.' : currentWeek ? `Tenés ${daysLeft} días para entregar.` : 'Bienvenido al programa.'}
              </div>
            </div>
            {currentWeek && (
              <div style={{ background: 'var(--navy)', color: 'var(--green)', fontSize: '12px', fontWeight: 700, padding: '6px 14px', borderRadius: '20px' }}>
                {currentWeek.phase === 'Despertar' ? 'Nivel Explorer 🔍' : currentWeek.phase === 'Construir' ? 'Nivel Builder ⚡' : 'Nivel Launcher 🚀'}
              </div>
            )}
          </div>

          {/* Hero */}
          {currentWeek && (
            <div style={{ background: 'var(--navy)', borderRadius: '18px', padding: '26px 28px', marginBottom: '18px', display: 'flex', alignItems: 'center', gap: '24px', position: 'relative', overflow: 'hidden' }}>
              <div style={{ position: 'absolute', right: '-30px', top: '-30px', width: '250px', height: '250px', background: 'radial-gradient(circle,rgba(0,200,150,0.15) 0%,transparent 65%)', pointerEvents: 'none' }} />
              <div style={{ position: 'absolute', right: '155px', top: '-18px', fontSize: '170px', fontWeight: 900, color: 'rgba(255,255,255,0.03)', lineHeight: 1, pointerEvents: 'none', userSelect: 'none' }}>{cohortCurrentWeek}</div>
              <div style={{ flex: 1, minWidth: 0, position: 'relative', zIndex: 1 }}>
                <div style={{ fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.09em', color: 'var(--green)', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '7px' }}>
                  <div style={{ width: '6px', height: '6px', background: 'var(--green)', borderRadius: '50%' }} />
                  Fase {currentWeek.phase} · Semana {cohortCurrentWeek} de 6
                </div>
                <div style={{ fontWeight: 800, fontSize: '24px', color: '#fff', lineHeight: 1.15, marginBottom: '10px' }}>{currentWeek.title}</div>
                <div style={{ fontSize: '13px', color: 'rgba(255,255,255,0.62)', lineHeight: 1.65, fontStyle: 'italic', maxWidth: '400px' }}>"{currentWeek.opening_question}"</div>
              </div>
              <div style={{ textAlign: 'right', flexShrink: 0, position: 'relative', zIndex: 1 }}>
                <div style={{ fontWeight: 900, fontSize: '58px', color: 'var(--green)', lineHeight: 1 }}>{daysLeft}</div>
                <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.55)', marginTop: '2px' }}>días para entregar</div>
                <div style={{ display: 'flex', gap: '4px', justifyContent: 'flex-end', marginTop: '14px' }}>
                  {Array.from({ length: 6 }).map((_, i) => (
                    <div key={i} style={{ height: '5px', borderRadius: '3px', width: i < cohortCurrentWeek - 1 ? '22px' : i === cohortCurrentWeek - 1 ? '22px' : '16px', background: i < cohortCurrentWeek - 1 ? 'var(--green)' : i === cohortCurrentWeek - 1 ? 'rgba(0,200,150,0.45)' : 'rgba(255,255,255,0.14)' }} />
                  ))}
                </div>
                <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.45)', textAlign: 'right', marginTop: '4px' }}>Semana {cohortCurrentWeek} de 6</div>
              </div>
            </div>
          )}

          {/* Stats */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px', marginBottom: '14px' }}>
            {[
              { n: isSubmitted ? '✓' : '0', color: isSubmitted ? 'var(--green)' : 'var(--coral)', l: 'Estado de tu entregable esta semana' },
              { n: streakDays > 0 ? `${streakDays} 🔥` : '—', color: 'var(--gold)', l: 'Días consecutivos activo en el programa' },
              { n: `${data.submittedCount}`, color: 'var(--green)', l: `De ${data.totalStudents} estudiantes ya entregaron esta semana` },
            ].map(({ n, color, l }, i) => (
              <div key={i} style={{ background: 'var(--white)', borderRadius: '16px', border: '1px solid var(--border)', padding: '18px 20px' }}>
                <div style={{ fontWeight: 800, fontSize: '32px', lineHeight: 1, marginBottom: '5px', color }}>{n}</div>
                <div style={{ fontSize: '12px', color: 'var(--ink3)', lineHeight: 1.4 }}>{l}</div>
              </div>
            ))}
          </div>

          {/* Deliverable + Video */}
          {currentWeek && (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', marginBottom: '14px' }}>
              <div style={{ background: 'var(--white)', borderRadius: '16px', border: `2px ${isSubmitted ? 'solid' : 'dashed'} ${isSubmitted ? 'var(--green)' : 'var(--bg2)'}`, padding: '20px' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
                  <span style={{ fontSize: '11px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.06em', padding: '4px 12px', borderRadius: '20px', background: isSubmitted ? 'var(--green-l)' : 'var(--coral-l)', color: isSubmitted ? 'var(--green-d)' : 'var(--coral)' }}>
                    {isSubmitted ? 'Entregado ✓' : 'Pendiente'}
                  </span>
                  {!isSubmitted && <span style={{ fontSize: '12px', color: 'var(--coral)', fontWeight: 700 }}>⏱ {daysLeft} días</span>}
                </div>
                <div style={{ fontWeight: 800, fontSize: '16px', color: 'var(--ink)', marginBottom: '10px', lineHeight: 1.3 }}>{currentWeek.deliverable_description}</div>
                <div style={{ fontSize: '13px', color: 'var(--ink2)', lineHeight: 1.6, background: 'var(--bg)', borderRadius: '10px', padding: '10px 14px', marginBottom: '16px', borderLeft: '3px solid var(--green)' }}>
                  <strong>Señal de éxito:</strong> {currentWeek.success_signal}
                </div>
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                  <a href="/deliverables" style={{ textDecoration: 'none' }}>
                    <button style={{ display: 'inline-flex', alignItems: 'center', gap: '7px', background: isSubmitted ? 'var(--teal)' : 'var(--green)', color: isSubmitted ? '#fff' : 'var(--navy)', border: 'none', borderRadius: '10px', padding: '10px 20px', fontSize: '14px', fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit' }}>
                      {isSubmitted ? '✓ Ver entregable' : '↑ Subir entregable'}
                    </button>
                  </a>
                </div>
              </div>

              <div style={{ background: 'var(--navy)', borderRadius: '16px', padding: '22px', cursor: 'pointer', position: 'relative', overflow: 'hidden' }}>
                <div style={{ position: 'absolute', right: '14px', bottom: '14px', fontSize: '52px', color: 'rgba(0,200,150,0.1)' }}>▶</div>
                <div style={{ fontSize: '11px', color: 'var(--teal)', textTransform: 'uppercase', letterSpacing: '0.07em', fontWeight: 700, marginBottom: '8px' }}>Video del mentor · Semana {cohortCurrentWeek}</div>
                <div style={{ fontWeight: 800, fontSize: '16px', color: '#fff', lineHeight: 1.3, marginBottom: '6px' }}>{currentWeek.title}</div>
                <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.55)', marginBottom: '16px' }}>{currentWeek.tools?.join(' + ') || 'Herramientas de la semana'}</div>
                {currentWeek.mentor_video_url
                  ? <a href={currentWeek.mentor_video_url} target="_blank" rel="noreferrer" style={{ textDecoration: 'none' }}><button style={{ display: 'inline-flex', alignItems: 'center', gap: '7px', background: 'var(--green)', color: 'var(--navy)', border: 'none', borderRadius: '9px', padding: '9px 18px', fontSize: '13px', fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit' }}>▶ Ver ahora</button></a>
                  : <div style={{ fontSize: '13px', color: 'rgba(255,255,255,0.4)' }}>Video disponible pronto</div>
                }
              </div>
            </div>
          )}

          {/* Reflection */}
          <div style={{ background: 'var(--mag-l)', border: '1px solid rgba(165,8,107,0.15)', borderRadius: '16px', padding: '18px', marginBottom: '14px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
              <div style={{ width: '38px', height: '38px', background: 'var(--magenta)', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px', flexShrink: 0 }}>✦</div>
              <div>
                <div style={{ fontWeight: 800, fontSize: '15px', color: 'var(--ink)' }}>Reflexión del domingo — Método finlandés</div>
                <div style={{ fontSize: '12px', color: 'var(--ink3)', marginTop: '1px' }}>Se activa junto al entregable · No se puede saltear · Forma parte del cierre de semana</div>
              </div>
            </div>
            <div style={{ background: 'rgba(165,8,107,0.07)', borderRadius: '9px', padding: '11px 14px', fontSize: '13px', color: 'var(--ink2)', display: 'flex', alignItems: 'center', gap: '9px' }}>
              {isSunday && isSubmitted
                ? <a href="/deliverables" style={{ color: 'var(--magenta)', fontWeight: 700, textDecoration: 'none' }}>✦ Reflexión disponible — respondé las dos preguntas →</a>
                : '🔒 Disponible el domingo — dos preguntas de aprendizaje que aparecen al subir tu entregable'}
            </div>
          </div>

          {/* Pod Members */}
          {pod && podMembers.length > 0 && (
            <>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
                <div style={{ fontWeight: 800, fontSize: '16px', color: 'var(--ink)' }}>Mi Pod · {pod.name} 🌎</div>
                {pod.discord_channel_url && (
                  <a href={pod.discord_channel_url} target="_blank" rel="noreferrer" style={{ fontSize: '13px', color: 'var(--teal)', fontWeight: 600, textDecoration: 'none' }}>Abrir Discord →</a>
                )}
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: `repeat(${Math.min(podMembers.length, 4)}, 1fr)`, gap: '10px', marginBottom: '24px' }}>
                {podMembers.map((m, i) => {
                  const isMe = m.user.id === user.id
                  const nick = m.user.nickname || m.user.full_name.split(' ')[0]
                  return (
                    <div key={m.user.id} style={{ background: isMe ? '#fafffe' : 'var(--white)', borderRadius: '14px', padding: '16px 12px', border: `1.5px solid ${isMe ? 'var(--green)' : 'var(--border)'}`, textAlign: 'center', cursor: 'pointer', position: 'relative' }}>
                      {isMe && <div style={{ position: 'absolute', top: '-8px', right: '-8px', background: 'var(--green)', color: 'var(--navy)', fontSize: '10px', fontWeight: 800, padding: '2px 8px', borderRadius: '20px', textTransform: 'uppercase' }}>Tú</div>}
                      <div style={{ width: '46px', height: '46px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: m.user.avatar_url && m.user.avatar_url.length <= 2 ? '22px' : '15px', fontWeight: 800, color: '#fff', background: AVATAR_COLORS[i % AVATAR_COLORS.length], margin: '0 auto 9px', position: 'relative' }}>
                        {m.user.avatar_url && m.user.avatar_url.length <= 2 ? m.user.avatar_url : getInitials(nick)}
                        <div style={{ width: '12px', height: '12px', borderRadius: '50%', border: '2.5px solid var(--white)', position: 'absolute', bottom: 0, right: 0, background: '#22c55e' }} />
                      </div>
                      <div style={{ fontSize: '14px', fontWeight: 700, color: 'var(--ink)', marginBottom: '2px' }}>{nick}</div>
                      <div style={{ fontSize: '11px', color: 'var(--ink3)', marginBottom: '7px' }}>{m.user.country}{m.podMember.is_pod_leader_this_week ? ' · Pod Leader ✦' : ''}</div>
                      <span style={{ fontSize: '10px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04em', padding: '3px 10px', borderRadius: '20px', display: 'inline-block', background: isMe ? 'var(--green-l)' : 'var(--teal-l)', color: isMe ? 'var(--green-d)' : 'var(--teal)' }}>Activo</span>
                    </div>
                  )
                })}
              </div>
            </>
          )}

        </div>
      </div>

      <ProsperoPanel user={user} week={currentWeek} />

      <style>{`@keyframes bounce { 0%,60%,100%{transform:translateY(0)} 30%{transform:translateY(-6px)} }`}</style>
    </div>
  )
}
