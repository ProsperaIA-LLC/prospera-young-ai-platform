'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'

// ── Types ──────────────────────────────────────────────────────────────────────

interface DiaryEntry {
  id:               string
  q1:               string | null
  q2:               string | null
  mentor_feedback:  string | null
  submitted_at:     string | null
  created_at:       string
  week: {
    week_number:             number
    title:                   string
    phase:                   'Despertar' | 'Construir' | 'Lanzar'
    reflection_q1:           string
    reflection_q2:           string
    deliverable_description: string
  } | null
  deliverable: {
    content: string | null
    status:  string
  } | null
}

// ── Phase config ───────────────────────────────────────────────────────────────

const PHASE = {
  Despertar: {
    bg:     'var(--mag-l)',
    text:   'var(--magenta)',
    border: 'var(--magenta)',
    accent: 'rgba(165,8,107,0.12)',
    icon:   '🔍',
    weeks:  'Semanas 1–2',
  },
  Construir: {
    bg:     'var(--teal-l)',
    text:   'var(--teal)',
    border: 'var(--teal)',
    accent: 'rgba(0,140,165,0.10)',
    icon:   '🔨',
    weeks:  'Semanas 3–5',
  },
  Lanzar: {
    bg:     'var(--green-l)',
    text:   'var(--green-d)',
    border: 'var(--green)',
    accent: 'rgba(0,200,150,0.10)',
    icon:   '🚀',
    weeks:  'Semana 6',
  },
} as const

// ── Helpers ────────────────────────────────────────────────────────────────────

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('es-LA', {
    weekday: 'long',
    day:     'numeric',
    month:   'long',
    year:    'numeric',
  })
}

function excerpt(text: string | null, max = 120): string {
  if (!text) return ''
  const t = text.trim()
  return t.length <= max ? t : t.slice(0, max).trimEnd() + '…'
}

// ── Loading skeleton ───────────────────────────────────────────────────────────

function Skeleton() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <style>{`
        @keyframes shimmer {
          0%   { background-position: -400px 0 }
          100% { background-position:  400px 0 }
        }
        .sk {
          background: linear-gradient(90deg, var(--bg2) 25%, var(--bg) 50%, var(--bg2) 75%);
          background-size: 800px 100%;
          animation: shimmer 1.4s infinite;
          border-radius: 8px;
        }
      `}</style>
      {[1, 2].map(i => (
        <div key={i} style={{
          background: 'var(--white)', borderRadius: '18px',
          border: '1px solid var(--border)', padding: '28px',
          display: 'flex', flexDirection: 'column', gap: '14px',
        }}>
          <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
            <div className="sk" style={{ width: 72, height: 22 }} />
            <div className="sk" style={{ width: 120, height: 22 }} />
          </div>
          <div className="sk" style={{ width: '60%', height: 26 }} />
          <div className="sk" style={{ width: '90%', height: 14 }} />
          <div className="sk" style={{ width: '75%', height: 14 }} />
          <div className="sk" style={{ width: '80%', height: 14 }} />
        </div>
      ))}
    </div>
  )
}

// ── Entry card ─────────────────────────────────────────────────────────────────

function EntryCard({ entry, index }: { entry: DiaryEntry; index: number }) {
  const [expanded, setExpanded] = useState(index === 0)
  const phase  = entry.week?.phase
  const cfg    = phase ? PHASE[phase] : PHASE.Despertar
  const dateStr = entry.submitted_at
    ? formatDate(entry.submitted_at)
    : formatDate(entry.created_at)

  return (
    <article style={{
      background: 'var(--white)',
      border: '1px solid var(--border)',
      borderLeft: `4px solid ${cfg.border}`,
      borderRadius: '0 18px 18px 0',
      overflow: 'hidden',
      boxShadow: '0 2px 12px rgba(17,17,16,0.04)',
      transition: 'box-shadow 0.2s',
    }}>

      {/* ── Card header (always visible) ───────────────────────────────────── */}
      <button
        onClick={() => setExpanded(e => !e)}
        aria-expanded={expanded}
        style={{
          width: '100%', background: 'none', border: 'none',
          cursor: 'pointer', padding: '22px 24px',
          display: 'flex', alignItems: 'flex-start',
          justifyContent: 'space-between', gap: '16px',
          textAlign: 'left', fontFamily: 'inherit',
        }}
      >
        <div style={{ flex: 1, minWidth: 0 }}>

          {/* Badges row */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap', marginBottom: '8px' }}>
            {/* Week number pill */}
            <span style={{
              background: cfg.bg, color: cfg.text,
              fontSize: '11px', fontWeight: 800,
              padding: '3px 10px', borderRadius: '99px',
              letterSpacing: '0.06em', textTransform: 'uppercase',
            }}>
              {cfg.icon} Semana {entry.week?.week_number ?? '?'}
            </span>

            {/* Phase badge */}
            {phase && (
              <span style={{
                background: 'transparent',
                border: `1.5px solid ${cfg.border}`,
                color: cfg.text,
                fontSize: '10px', fontWeight: 700,
                padding: '2px 9px', borderRadius: '99px',
                letterSpacing: '0.05em', textTransform: 'uppercase',
              }}>
                {phase}
              </span>
            )}
          </div>

          {/* Week title */}
          <p style={{
            fontWeight: 800, fontSize: '16px',
            color: 'var(--ink)', margin: '0 0 5px',
            lineHeight: 1.3,
          }}>
            {entry.week?.title ?? 'Reflexión semanal'}
          </p>

          {/* Date */}
          <p style={{
            fontSize: '12px', color: 'var(--ink3)',
            margin: 0, fontWeight: 500,
            textTransform: 'capitalize',
          }}>
            {dateStr}
          </p>

          {/* Collapsed preview — q1 snippet */}
          {!expanded && entry.q1 && (
            <p style={{
              fontSize: '13px', color: 'var(--ink3)',
              margin: '10px 0 0', lineHeight: 1.6,
              fontStyle: 'italic',
            }}>
              "{excerpt(entry.q1)}"
            </p>
          )}
        </div>

        {/* Chevron */}
        <span style={{
          fontSize: '18px', color: 'var(--ink4)',
          flexShrink: 0, marginTop: '2px',
          transform: expanded ? 'rotate(180deg)' : 'none',
          transition: 'transform 0.22s ease',
          display: 'inline-block',
        }}>
          ▾
        </span>
      </button>

      {/* ── Expanded content ────────────────────────────────────────────────── */}
      {expanded && (
        <div style={{ padding: '0 24px 26px', borderTop: '1px solid var(--border)' }}>

          {/* Deliverable summary */}
          {entry.deliverable?.content && (
            <div style={{
              background: cfg.accent,
              borderRadius: '10px',
              padding: '14px 16px',
              margin: '20px 0',
            }}>
              <p style={{
                fontSize: '11px', fontWeight: 800, textTransform: 'uppercase',
                letterSpacing: '0.07em', color: cfg.text, margin: '0 0 6px',
              }}>
                📎 Mi entregable
              </p>
              <p style={{
                fontSize: '13px', color: 'var(--ink2)',
                margin: 0, lineHeight: 1.65,
              }}>
                {entry.deliverable.content.length > 280
                  ? entry.deliverable.content.slice(0, 280).trimEnd() + '…'
                  : entry.deliverable.content}
              </p>
              <p style={{
                fontSize: '11px', color: 'var(--ink4)',
                margin: '8px 0 0', fontWeight: 600, textTransform: 'uppercase',
                letterSpacing: '0.05em',
              }}>
                {entry.week?.deliverable_description}
              </p>
            </div>
          )}

          {/* Reflection answers */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '22px', marginTop: '20px' }}>
            {[
              {
                q:   entry.week?.reflection_q1 ?? 'Lo que aprendí esta semana fue…',
                ans: entry.q1,
                num: '01',
              },
              {
                q:   entry.week?.reflection_q2 ?? 'La semana que viene, cambio…',
                ans: entry.q2,
                num: '02',
              },
            ].map(({ q, ans, num }) => (
              <div key={num}>
                {/* Question prompt */}
                <div style={{ display: 'flex', gap: '10px', alignItems: 'flex-start', marginBottom: '10px' }}>
                  <span style={{
                    fontSize: '10px', fontWeight: 900, color: cfg.text,
                    letterSpacing: '0.08em', flexShrink: 0,
                    lineHeight: '20px',
                  }}>
                    {num}
                  </span>
                  <p style={{
                    fontSize: '12px', fontWeight: 700, color: 'var(--ink3)',
                    margin: 0, lineHeight: 1.5, fontStyle: 'italic',
                    textTransform: 'none', letterSpacing: '0',
                  }}>
                    {q}
                  </p>
                </div>

                {/* Answer */}
                <div style={{
                  paddingLeft: '22px',
                  borderLeft: `2px solid ${cfg.accent.replace(')', '').replace('rgba', 'rgb').split(',').slice(0,3).join(',') + ')'}`,
                }}>
                  {ans ? (
                    <p style={{
                      fontSize: '15px', color: 'var(--ink)',
                      margin: 0, lineHeight: 1.75,
                      whiteSpace: 'pre-wrap', fontWeight: 400,
                    }}>
                      {ans}
                    </p>
                  ) : (
                    <p style={{ fontSize: '14px', color: 'var(--ink4)', margin: 0, fontStyle: 'italic' }}>
                      Sin respuesta registrada
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Mentor feedback */}
          {entry.mentor_feedback && (
            <div style={{
              marginTop: '24px',
              background: 'var(--mag-l)',
              border: '1px solid rgba(165,8,107,0.18)',
              borderRadius: '12px',
              padding: '14px 16px',
            }}>
              <p style={{
                fontSize: '11px', fontWeight: 800,
                textTransform: 'uppercase', letterSpacing: '0.07em',
                color: 'var(--magenta)', margin: '0 0 8px',
              }}>
                ✦ Nota del mentor
              </p>
              <p style={{
                fontSize: '14px', color: 'var(--ink)',
                lineHeight: 1.7, margin: 0,
              }}>
                {entry.mentor_feedback}
              </p>
            </div>
          )}
        </div>
      )}
    </article>
  )
}

// ── Empty state ────────────────────────────────────────────────────────────────

function EmptyState() {
  return (
    <div style={{
      background: 'var(--white)',
      border: '1px solid var(--border)',
      borderRadius: '18px',
      padding: '60px 32px',
      textAlign: 'center',
    }}>
      <div style={{
        width: '72px', height: '72px', borderRadius: '50%',
        background: 'var(--gold-l)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: '30px', margin: '0 auto 20px',
      }}>📓</div>
      <h2 style={{ fontWeight: 800, fontSize: '18px', margin: '0 0 10px', color: 'var(--ink)' }}>
        Tu diario está vacío
      </h2>
      <p style={{
        color: 'var(--ink3)', fontSize: '14px', lineHeight: 1.7,
        maxWidth: '340px', margin: '0 auto',
      }}>
        Cada domingo, después de entregar tu entregable, se desbloquean dos preguntas de reflexión. Tus respuestas quedarán guardadas aquí como tu diario personal del programa.
      </p>
      <div style={{
        display: 'inline-flex', gap: '6px', alignItems: 'center',
        marginTop: '20px', background: 'var(--gold-l)',
        borderRadius: '99px', padding: '7px 16px',
      }}>
        <span style={{ fontSize: '13px' }}>🌟</span>
        <span style={{ fontSize: '12px', fontWeight: 700, color: 'var(--gold)', letterSpacing: '0.05em', textTransform: 'uppercase' }}>
          Método finlandés de aprendizaje
        </span>
      </div>
    </div>
  )
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default function DiaryPage() {
  const [entries,  setEntries]  = useState<DiaryEntry[]>([])
  const [loading,  setLoading]  = useState(true)
  const [userName, setUserName] = useState('')

  useEffect(() => {
    async function load() {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      // Fetch user name + reflections in parallel
      const [profileRes, reflRes] = await Promise.all([
        supabase.from('users').select('full_name, nickname').eq('id', user.id).single(),
        supabase
          .from('reflections')
          .select(`
            id, q1, q2, mentor_feedback, submitted_at, created_at,
            weeks(week_number, title, phase, reflection_q1, reflection_q2, deliverable_description),
            deliverables(content, status)
          `)
          .eq('user_id', user.id)
          .eq('status', 'submitted'),
      ])

      if (profileRes.data) {
        const p = profileRes.data
        setUserName(p.nickname || p.full_name.split(' ')[0])
      }

      if (reflRes.data) {
        const sorted = (reflRes.data as any[])
          .map(r => ({
            ...r,
            week:        r.weeks       ?? null,
            deliverable: r.deliverables ?? null,
          }))
          .sort((a, b) => {
            const wa = a.week?.week_number ?? 99
            const wb = b.week?.week_number ?? 99
            return wa - wb
          })
        setEntries(sorted)
      }

      setLoading(false)
    }
    load()
  }, [])

  // ── Phase summary counts ─────────────────────────────────────────────────────
  const counts = entries.reduce(
    (acc, e) => {
      const p = e.week?.phase
      if (p) acc[p] = (acc[p] ?? 0) + 1
      return acc
    },
    {} as Partial<Record<'Despertar' | 'Construir' | 'Lanzar', number>>
  )

  return (
    <div style={{
      maxWidth: '680px', margin: '0 auto',
      padding: '32px 24px 64px',
      fontFamily: "-apple-system,'Segoe UI',system-ui,sans-serif",
    }}>

      {/* ── Header ─────────────────────────────────────────────────────────── */}
      <div style={{ marginBottom: '32px' }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '16px', flexWrap: 'wrap' }}>
          <div>
            <h1 style={{
              fontWeight: 900, fontSize: '26px',
              margin: '0 0 6px', color: 'var(--ink)',
              lineHeight: 1.2,
            }}>
              {userName ? `Diario de ${userName}` : 'Diario de aprendizaje'}
            </h1>
            <p style={{ color: 'var(--ink3)', fontSize: '14px', margin: 0, lineHeight: 1.6 }}>
              Tus reflexiones semanales — método finlandés
            </p>
          </div>

          {/* Entry count badge */}
          {entries.length > 0 && (
            <div style={{
              background: 'var(--gold-l)', borderRadius: '12px',
              padding: '10px 16px', textAlign: 'center', flexShrink: 0,
            }}>
              <div style={{ fontWeight: 900, fontSize: '22px', color: 'var(--gold)', lineHeight: 1 }}>
                {entries.length}
              </div>
              <div style={{ fontSize: '10px', fontWeight: 700, color: 'var(--gold)', textTransform: 'uppercase', letterSpacing: '0.06em', marginTop: '2px' }}>
                {entries.length === 1 ? 'entrada' : 'entradas'}
              </div>
            </div>
          )}
        </div>

        {/* Phase summary pills — shown only once there are entries */}
        {entries.length > 0 && (
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginTop: '16px' }}>
            {(['Despertar', 'Construir', 'Lanzar'] as const).map(phase => {
              const c = counts[phase] ?? 0
              const cfg = PHASE[phase]
              return (
                <div key={phase} style={{
                  display: 'flex', alignItems: 'center', gap: '6px',
                  background: c > 0 ? cfg.bg : 'var(--bg2)',
                  borderRadius: '99px', padding: '5px 12px',
                  opacity: c > 0 ? 1 : 0.45,
                }}>
                  <span style={{ fontSize: '12px' }}>{cfg.icon}</span>
                  <span style={{ fontSize: '11px', fontWeight: 700, color: c > 0 ? cfg.text : 'var(--ink4)', letterSpacing: '0.04em' }}>
                    {phase}
                  </span>
                  <span style={{
                    fontSize: '11px', fontWeight: 900,
                    color: c > 0 ? cfg.text : 'var(--ink4)',
                    background: c > 0 ? `color-mix(in srgb, ${cfg.border} 15%, transparent)` : 'transparent',
                    borderRadius: '99px', padding: '0 5px',
                  }}>
                    {c}/{phase === 'Construir' ? 3 : phase === 'Lanzar' ? 1 : 2}
                  </span>
                </div>
              )
            })}
          </div>
        )}
      </div>

      {/* ── Method callout (one-time for first-time users) ─────────────────── */}
      {entries.length > 0 && (
        <div style={{
          background: 'var(--gold-l)',
          border: '1px solid rgba(224,163,38,0.25)',
          borderRadius: '12px', padding: '12px 16px',
          display: 'flex', gap: '12px', alignItems: 'flex-start',
          marginBottom: '24px',
        }}>
          <span style={{ fontSize: '18px', flexShrink: 0 }}>🌟</span>
          <p style={{ fontSize: '13px', color: 'var(--ink2)', margin: 0, lineHeight: 1.65 }}>
            <strong style={{ color: 'var(--ink)' }}>Método finlandés de aprendizaje:</strong>{' '}
            Cada reflexión tiene dos preguntas — lo que aprendiste y lo que cambiás la próxima semana. Volvé a leer tus entradas anteriores para ver cuánto creciste.
          </p>
        </div>
      )}

      {/* ── Content ───────────────────────────────────────────────────────── */}
      {loading ? (
        <Skeleton />
      ) : entries.length === 0 ? (
        <EmptyState />
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', position: 'relative' }}>

          {/* Vertical timeline thread */}
          <div style={{
            position: 'absolute', left: '-24px', top: '28px',
            width: '2px', bottom: '28px',
            background: 'linear-gradient(to bottom, var(--gold-l), transparent)',
            pointerEvents: 'none',
          }} />

          {entries.map((entry, i) => (
            <EntryCard key={entry.id} entry={entry} index={i} />
          ))}

          {/* End of journal note */}
          <div style={{ textAlign: 'center', padding: '24px 0 0' }}>
            <div style={{
              display: 'inline-flex', flexDirection: 'column', alignItems: 'center', gap: '6px',
            }}>
              <div style={{ width: '40px', height: '1px', background: 'var(--border)' }} />
              <p style={{ fontSize: '12px', color: 'var(--ink4)', margin: 0, fontStyle: 'italic' }}>
                {entries.length === 6
                  ? '✦ Programa completado — 6 semanas de crecimiento documentado'
                  : `${entries.length} de 6 semanas completadas`}
              </p>
              <div style={{ width: '40px', height: '1px', background: 'var(--border)' }} />
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
