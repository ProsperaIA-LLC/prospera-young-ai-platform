'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import type { Reflection, Week } from '@/types'

interface ReflectionWithWeek extends Reflection {
  week: Pick<Week, 'week_number' | 'title' | 'phase'> | null
}

export default function DiaryPage() {
  const [reflections, setReflections] = useState<ReflectionWithWeek[]>([])
  const [loading, setLoading] = useState(true)
  const [expanded, setExpanded] = useState<string | null>(null)

  useEffect(() => {
    async function load() {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      const { data } = await supabase
        .from('reflections')
        .select('*, weeks(week_number, title, phase)')
        .eq('user_id', user.id)
        .eq('status', 'submitted')
        .order('created_at', { ascending: false })

      if (data) {
        setReflections(data.map((r: any) => ({ ...r, week: r.weeks ?? null })))
      }
      setLoading(false)
    }
    load()
  }, [])

  if (loading) {
    return (
      <div style={{ display: 'flex', height: '100vh', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{
          width: '36px', height: '36px', borderRadius: '50%',
          border: '3px solid var(--border)', borderTopColor: 'var(--teal)',
          animation: 'spin 0.8s linear infinite',
        }} />
        <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>
      </div>
    )
  }

  return (
    <div style={{ maxWidth: '720px', margin: '0 auto', padding: '32px 24px' }}>

      {/* Header */}
      <div style={{ marginBottom: '32px' }}>
        <h1 style={{ fontWeight: 800, fontSize: '22px', margin: '0 0 8px' }}>Diario de aprendizaje</h1>
        <p style={{ color: '#6B7280', fontSize: '14px', margin: 0 }}>
          Tus reflexiones semanales — método finlandés de aprendizaje
        </p>
      </div>

      {/* Empty state */}
      {reflections.length === 0 && (
        <div style={{
          background: 'white',
          border: '1px solid var(--border)',
          borderRadius: 'var(--radius-lg)',
          padding: '48px 32px',
          textAlign: 'center',
        }}>
          <div style={{ fontSize: '40px', marginBottom: '16px' }}>📓</div>
          <h2 style={{ fontWeight: 700, fontSize: '18px', margin: '0 0 8px' }}>Tu diario está vacío</h2>
          <p style={{ color: '#6B7280', fontSize: '14px', maxWidth: '320px', margin: '0 auto' }}>
            Completá tu primera reflexión el domingo después de entregar tu entregable semanal.
          </p>
        </div>
      )}

      {/* Reflections list */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
        {reflections.map((r) => {
          const isOpen = expanded === r.id
          const date = new Date(r.created_at).toLocaleDateString('es-AR', {
            day: 'numeric',
            month: 'long',
            year: 'numeric',
          })

          return (
            <div
              key={r.id}
              style={{
                background: 'white',
                border: '1px solid var(--border)',
                borderRadius: 'var(--radius-lg)',
                overflow: 'hidden',
              }}
            >
              {/* Collapsed header */}
              <button
                onClick={() => setExpanded(isOpen ? null : r.id)}
                style={{
                  width: '100%',
                  padding: '20px 24px',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: '16px',
                  textAlign: 'left',
                }}
              >
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap', marginBottom: '4px' }}>
                    <span style={{
                      background: 'var(--magenta)',
                      color: 'white',
                      fontSize: '11px',
                      fontWeight: 700,
                      padding: '3px 10px',
                      borderRadius: '99px',
                      textTransform: 'uppercase',
                      letterSpacing: '0.05em',
                    }}>
                      Semana {r.week?.week_number ?? '?'}
                    </span>
                    {r.week?.phase && (
                      <span style={{ fontSize: '11px', color: '#9CA3AF', fontWeight: 600 }}>Fase {r.week.phase}</span>
                    )}
                  </div>
                  <p style={{ fontWeight: 700, fontSize: '15px', margin: '0 0 2px', color: 'var(--ink)' }}>
                    {r.week?.title || 'Reflexión semanal'}
                  </p>
                  <p style={{ color: '#9CA3AF', fontSize: '12px', margin: 0 }}>{date}</p>
                </div>
                <span style={{
                  color: '#9CA3AF',
                  fontSize: '18px',
                  transform: isOpen ? 'rotate(180deg)' : 'none',
                  transition: 'transform 0.2s',
                  flexShrink: 0,
                }}>
                  ▾
                </span>
              </button>

              {/* Expanded content */}
              {isOpen && (
                <div style={{
                  padding: '0 24px 24px',
                  borderTop: '1px solid var(--border)',
                  paddingTop: '20px',
                }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                    {[
                      { label: '¿Qué aprendiste esta semana que no sabías antes?', value: r.q1 },
                      { label: '¿Dónde te bloqueaste? ¿Qué hiciste para desbloquearte?', value: r.q2 },
                      { label: 'Si lo hicieras de nuevo, ¿qué harías diferente?', value: r.q3 },
                    ].map(({ label, value }) => (
                      <div key={label}>
                        <p style={{
                          fontWeight: 600,
                          fontSize: '12px',
                          color: '#9CA3AF',
                          textTransform: 'uppercase',
                          letterSpacing: '0.06em',
                          margin: '0 0 6px',
                        }}>
                          {label}
                        </p>
                        <p style={{
                          fontSize: '14px',
                          color: 'var(--ink)',
                          lineHeight: 1.6,
                          margin: 0,
                          whiteSpace: 'pre-wrap',
                        }}>
                          {value || '—'}
                        </p>
                      </div>
                    ))}

                    {/* Mentor feedback if exists */}
                    {r.mentor_feedback && (
                      <div style={{
                        background: '#F0FDFA',
                        border: '1px solid #99F6E4',
                        borderRadius: 'var(--radius)',
                        padding: '14px 16px',
                      }}>
                        <p style={{ fontWeight: 600, fontSize: '12px', color: 'var(--teal)', margin: '0 0 6px' }}>
                          Feedback del mentor
                        </p>
                        <p style={{ fontSize: '14px', color: 'var(--ink)', lineHeight: 1.6, margin: 0 }}>
                          {r.mentor_feedback}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          )
        })}
      </div>

    </div>
  )
}
