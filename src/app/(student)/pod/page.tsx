'use client'

import { useState, useEffect } from 'react'
import type { DashboardResponse } from '@/types'

type PodMemberItem = DashboardResponse['data']['podMembers'][number]

function Avatar({ user }: { user: PodMemberItem['user'] }) {
  const colors = ['var(--teal)', 'var(--coral)', 'var(--gold)', 'var(--magenta)', 'var(--green)']
  const color = colors[(user?.full_name?.charCodeAt(0) ?? 0) % colors.length]
  const display = user?.avatar_url || user?.nickname?.slice(0, 2).toUpperCase() || '??'

  return (
    <div style={{
      width: '44px',
      height: '44px',
      borderRadius: '50%',
      background: color,
      color: 'white',
      fontWeight: 800,
      fontSize: '16px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      flexShrink: 0,
    }}>
      {display}
    </div>
  )
}

export default function PodPage() {
  const [data, setData] = useState<DashboardResponse['data'] | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/student/dashboard')
      .then(r => r.json())
      .then((json: DashboardResponse) => setData(json.data))
      .catch(console.error)
      .finally(() => setLoading(false))
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

  if (!data) return null

  const { user, pod, podMembers, buddy, isPodLeader, currentWeek } = data

  if (!pod) {
    return (
      <div style={{ maxWidth: '600px', margin: '0 auto', padding: '48px 24px', textAlign: 'center' }}>
        <div style={{ fontSize: '40px', marginBottom: '16px' }}>🫂</div>
        <h2 style={{ fontWeight: 700, fontSize: '20px', marginBottom: '8px' }}>Todavía no tenés un pod</h2>
        <p style={{ color: '#6B7280', fontSize: '15px' }}>
          Tu mentor te asignará a un pod pronto. Mientras tanto, explorá el contenido de esta semana.
        </p>
      </div>
    )
  }

  return (
    <div style={{ maxWidth: '720px', margin: '0 auto', padding: '32px 24px' }}>

      {/* Pod header */}
      <div style={{
        background: 'var(--navy)',
        color: 'white',
        borderRadius: 'var(--radius-lg)',
        padding: '28px',
        marginBottom: '28px',
      }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '16px', flexWrap: 'wrap' }}>
          <div>
            <p style={{ fontSize: '11px', fontWeight: 700, opacity: 0.5, textTransform: 'uppercase', letterSpacing: '0.1em', margin: '0 0 6px' }}>Tu pod</p>
            <h1 style={{ fontWeight: 800, fontSize: '26px', margin: '0 0 8px' }}>{pod.name}</h1>
            {pod.timezone_region && (
              <p style={{ opacity: 0.7, fontSize: '13px', margin: 0 }}>🌎 {pod.timezone_region}</p>
            )}
          </div>
          {isPodLeader && (
            <span style={{
              background: 'var(--gold)',
              color: 'var(--navy)',
              fontWeight: 800,
              fontSize: '12px',
              padding: '6px 14px',
              borderRadius: '99px',
              whiteSpace: 'nowrap',
            }}>
              ⭐ Pod Leader
            </span>
          )}
        </div>
        {pod.discord_channel_url && (
          <a
            href={pod.discord_channel_url}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              marginTop: '16px',
              background: 'rgba(255,255,255,0.12)',
              color: 'white',
              padding: '8px 16px',
              borderRadius: 'var(--radius)',
              fontSize: '13px',
              fontWeight: 600,
              textDecoration: 'none',
            }}
          >
            💬 Canal de Discord
          </a>
        )}
      </div>

      {/* Buddy card */}
      {buddy && (
        <div style={{ marginBottom: '28px' }}>
          <h2 style={{ fontWeight: 700, fontSize: '16px', marginBottom: '14px' }}>Tu buddy esta semana</h2>
          <div style={{
            background: 'white',
            border: '2px solid var(--teal)',
            borderRadius: 'var(--radius-lg)',
            padding: '20px',
            display: 'flex',
            alignItems: 'center',
            gap: '16px',
          }}>
            <Avatar user={buddy} />
            <div style={{ flex: 1 }}>
              <p style={{ fontWeight: 700, fontSize: '15px', margin: '0 0 2px' }}>
                {buddy.nickname || buddy.full_name?.split(' ')[0]}
              </p>
              {buddy.country && (
                <p style={{ color: '#6B7280', fontSize: '13px', margin: 0 }}>{buddy.country}</p>
              )}
            </div>
            <div style={{
              background: '#F0FDFA',
              color: 'var(--teal)',
              fontSize: '12px',
              fontWeight: 700,
              padding: '4px 12px',
              borderRadius: '99px',
            }}>
              Buddy
            </div>
          </div>
        </div>
      )}

      {/* Pod members list */}
      <div>
        <h2 style={{ fontWeight: 700, fontSize: '16px', marginBottom: '14px' }}>
          Miembros del pod ({podMembers.length})
        </h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {podMembers.map((item: PodMemberItem) => {
            const isMe = item.user?.id === user?.id
            return (
              <div
                key={item.podMember.id}
                style={{
                  background: 'white',
                  border: `1px solid ${isMe ? 'var(--teal)' : 'var(--border)'}`,
                  borderRadius: 'var(--radius-lg)',
                  padding: '16px 20px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '14px',
                }}
              >
                <Avatar user={item.user} />
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                    <p style={{ fontWeight: 700, fontSize: '15px', margin: 0 }}>
                      {item.user?.nickname || item.user?.full_name?.split(' ')[0] || 'Estudiante'}
                    </p>
                    {isMe && (
                      <span style={{ fontSize: '11px', background: 'var(--teal)', color: 'white', padding: '2px 8px', borderRadius: '99px', fontWeight: 700 }}>Tú</span>
                    )}
                    {item.podMember.is_pod_leader_this_week && (
                      <span style={{ fontSize: '11px', background: 'var(--gold)', color: 'var(--navy)', padding: '2px 8px', borderRadius: '99px', fontWeight: 700 }}>⭐ Líder</span>
                    )}
                    {item.hasSubmittedThisWeek && (
                      <span style={{ fontSize: '11px', background: '#D1FAE5', color: '#065F46', padding: '2px 8px', borderRadius: '99px', fontWeight: 700 }}>✓ Entregó</span>
                    )}
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '4px' }}>
                    <span style={{
                      display: 'inline-block', width: '7px', height: '7px', borderRadius: '50%',
                      background: item.isOnline ? '#22C55E' : '#D1D5DB',
                    }} />
                    <p style={{ color: '#9CA3AF', fontSize: '12px', margin: 0 }}>
                      {item.isOnline
                        ? 'Activo/a ahora'
                        : item.hoursInactive < 24
                        ? `Hace ${item.hoursInactive}h`
                        : item.hoursInactive < 48
                        ? 'Ayer'
                        : `Hace ${Math.floor(item.hoursInactive / 24)} días`}
                    </p>
                  </div>
                </div>
                {item.user?.country && (
                  <p style={{ color: '#D1D5DB', fontSize: '13px', margin: 0, flexShrink: 0 }}>{item.user.country}</p>
                )}
              </div>
            )
          })}
        </div>
      </div>

      {/* Pod leader duties */}
      {isPodLeader && (
        <div style={{
          marginTop: '28px',
          background: '#FFFBEB',
          border: '1px solid #FDE68A',
          borderRadius: 'var(--radius-lg)',
          padding: '20px',
        }}>
          <p style={{ fontWeight: 700, fontSize: '14px', color: '#92400E', margin: '0 0 10px' }}>⭐ Sos el Pod Leader esta semana</p>
          <ul style={{ margin: 0, paddingLeft: '18px', color: '#78350F', fontSize: '13px', lineHeight: 1.7 }}>
            <li>Coordiná el check-in del viernes (20 min por voz)</li>
            <li>Recordá a tus buddies sus check-ins diarios</li>
            <li>El domingo: enviá el resumen de 3 líneas al canal del mentor</li>
            <li>Si alguien está bloqueado, escalá al mentor</li>
          </ul>
        </div>
      )}

      {/* Weekly rhythm */}
      <div style={{
        marginTop: '28px',
        background: 'white',
        border: '1px solid var(--border)',
        borderRadius: 'var(--radius-lg)',
        padding: '20px',
      }}>
        <p style={{ fontWeight: 700, fontSize: '14px', margin: '0 0 12px' }}>
          📅 Ritmo semanal — Semana {currentWeek?.week_number}
        </p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {[
            { day: 'Lunes', task: 'Escribile a tu buddy: "Mi plan esta semana es..."' },
            { day: 'Miércoles', task: 'Buddy mid-week: "¿Cómo vas?"' },
            { day: 'Viernes', task: 'Check-in del pod (20 min de voz — sin mentor)' },
            { day: 'Domingo', task: 'Entregar entregable + reflexión' },
          ].map(({ day, task }) => (
            <div key={day} style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
              <span style={{ minWidth: '80px', fontWeight: 700, fontSize: '12px', color: '#6B7280', paddingTop: '1px' }}>{day}</span>
              <span style={{ fontSize: '13px', color: 'var(--ink)' }}>{task}</span>
            </div>
          ))}
        </div>
      </div>

    </div>
  )
}
