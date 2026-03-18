'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

const TIMEZONES = [
  { value: 'America/Mexico_City',    label: 'México / Guatemala / Costa Rica (GMT-6)' },
  { value: 'America/Bogota',         label: 'Colombia / Perú / Ecuador (GMT-5)' },
  { value: 'America/Caracas',        label: 'Venezuela (GMT-4)' },
  { value: 'America/Santiago',       label: 'Chile / Paraguay (GMT-4/-3)' },
  { value: 'America/Argentina/Buenos_Aires', label: 'Argentina / Uruguay (GMT-3)' },
  { value: 'America/New_York',       label: 'EST — Nueva York / Miami (GMT-5)' },
  { value: 'America/Chicago',        label: 'CST — Chicago / Houston (GMT-6)' },
  { value: 'America/Los_Angeles',    label: 'PST — Los Ángeles (GMT-8)' },
]

const AVATARS = ['🦁', '🐯', '🦊', '🐺', '🦅', '🦋', '🐉', '⚡', '🌟', '🔥', '🌊', '🌿']

type Step = 1 | 2 | 3

export default function OnboardingPage() {
  const router = useRouter()
  const [step, setStep] = useState<Step>(1)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [step1, setStep1] = useState({ nickname: '', country: '', timezone: '' })
  const [step2, setStep2] = useState({ avatarEmoji: '🦁' })
  const [step3, setStep3] = useState({
    parentConsentSigned: false,
    termsAccepted: false,
    programRulesAccepted: false,
  })

  async function handleFinish() {
    setLoading(true)
    setError(null)

    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      setError('Sesión expirada. Volvé a ingresar.')
      setLoading(false)
      return
    }

    const { error } = await supabase
      .from('users')
      .upsert({
        id: user.id,
        email: user.email!,
        full_name: user.user_metadata?.full_name || '',
        nickname: step1.nickname || user.user_metadata?.nickname,
        country: step1.country || user.user_metadata?.country,
        timezone: step1.timezone,
        age: user.user_metadata?.age,
        market: user.user_metadata?.market || (step1.country === 'US' ? 'USA' : 'LATAM'),
        avatar_url: step2.avatarEmoji,
        parent_consent: step3.parentConsentSigned,
        role: 'student',
      })

    if (error) {
      setError('Hubo un problema guardando tus datos. Intentá de nuevo.')
      setLoading(false)
      return
    }

    router.push('/dashboard')
  }

  const progressPct = ((step - 1) / 2) * 100

  return (
    <div style={{
      minHeight: '100vh',
      background: 'var(--bg)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '24px',
    }}>
      <div style={{
        background: 'var(--white)',
        borderRadius: 'var(--radius-card)',
        padding: '40px',
        width: '100%',
        maxWidth: '460px',
        boxShadow: '0 2px 16px rgba(0,0,0,0.06)',
      }}>
        {/* Header */}
        <div style={{ marginBottom: '28px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
            <span style={{ fontSize: '13px', fontWeight: 700, color: 'var(--ink3)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
              Paso {step} de 3
            </span>
            <span style={{ fontSize: '13px', color: 'var(--ink3)' }}>
              {step === 1 ? 'Tu perfil' : step === 2 ? 'Tu avatar' : 'Confirmación'}
            </span>
          </div>
          <div style={{ height: '6px', background: 'var(--bg2)', borderRadius: '99px', overflow: 'hidden' }}>
            <div style={{
              height: '100%',
              width: `${progressPct + 33}%`,
              background: 'var(--green)',
              borderRadius: '99px',
              transition: 'width 0.3s ease',
            }} />
          </div>
        </div>

        {/* Step 1 — Perfil */}
        {step === 1 && (
          <div>
            <h2 style={{ fontSize: '20px', fontWeight: 800, color: 'var(--ink)', marginBottom: '6px' }}>
              ¿Cómo te llamamos?
            </h2>
            <p style={{ color: 'var(--ink3)', fontSize: '14px', marginBottom: '24px' }}>
              Completá tu perfil para que tus compañeros y Próspero te conozcan.
            </p>

            <div style={{ display: 'grid', gap: '14px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: 'var(--ink3)', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                  ¿Cómo querés que te llamen?
                </label>
                <input
                  type="text"
                  value={step1.nickname}
                  onChange={e => setStep1(p => ({ ...p, nickname: e.target.value }))}
                  placeholder="Vale, Santi, Lu..."
                  style={{
                    width: '100%', padding: '11px 14px', background: 'var(--bg2)',
                    border: '1.5px solid var(--border)', borderRadius: 'var(--radius-btn)',
                    fontSize: '15px', color: 'var(--ink)', outline: 'none', boxSizing: 'border-box',
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: 'var(--ink3)', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                  Zona horaria
                </label>
                <select
                  value={step1.timezone}
                  onChange={e => setStep1(p => ({ ...p, timezone: e.target.value }))}
                  style={{
                    width: '100%', padding: '11px 14px', background: 'var(--bg2)',
                    border: '1.5px solid var(--border)', borderRadius: 'var(--radius-btn)',
                    fontSize: '14px', color: 'var(--ink)', outline: 'none', boxSizing: 'border-box',
                  }}
                >
                  <option value="">Seleccioná tu zona horaria</option>
                  {TIMEZONES.map(tz => (
                    <option key={tz.value} value={tz.value}>{tz.label}</option>
                  ))}
                </select>
              </div>
            </div>

            <button
              onClick={() => setStep(2)}
              disabled={!step1.timezone}
              style={{
                width: '100%', marginTop: '24px', padding: '13px',
                background: !step1.timezone ? 'var(--ink4)' : 'var(--green)',
                color: 'var(--white)', border: 'none', borderRadius: 'var(--radius-btn)',
                fontSize: '15px', fontWeight: 700, cursor: !step1.timezone ? 'not-allowed' : 'pointer',
              }}
            >
              Continuar →
            </button>
          </div>
        )}

        {/* Step 2 — Avatar */}
        {step === 2 && (
          <div>
            <h2 style={{ fontSize: '20px', fontWeight: 800, color: 'var(--ink)', marginBottom: '6px' }}>
              Elegí tu avatar
            </h2>
            <p style={{ color: 'var(--ink3)', fontSize: '14px', marginBottom: '24px' }}>
              Este emoji va a representarte en tu pod y en el ranking.
            </p>

            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(6, 1fr)',
              gap: '10px',
              marginBottom: '24px',
            }}>
              {AVATARS.map(emoji => (
                <button
                  key={emoji}
                  onClick={() => setStep2({ avatarEmoji: emoji })}
                  style={{
                    fontSize: '28px',
                    padding: '10px',
                    border: step2.avatarEmoji === emoji ? '2.5px solid var(--green)' : '2px solid var(--border)',
                    borderRadius: '12px',
                    background: step2.avatarEmoji === emoji ? 'var(--green-l)' : 'var(--bg)',
                    cursor: 'pointer',
                    transition: 'all 0.15s',
                  }}
                >
                  {emoji}
                </button>
              ))}
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <button
                onClick={() => setStep(1)}
                style={{
                  padding: '12px', background: 'var(--bg2)', color: 'var(--ink2)',
                  border: 'none', borderRadius: 'var(--radius-btn)', fontSize: '15px',
                  fontWeight: 600, cursor: 'pointer',
                }}
              >
                ← Atrás
              </button>
              <button
                onClick={() => setStep(3)}
                style={{
                  padding: '12px', background: 'var(--green)', color: 'var(--white)',
                  border: 'none', borderRadius: 'var(--radius-btn)', fontSize: '15px',
                  fontWeight: 700, cursor: 'pointer',
                }}
              >
                Continuar →
              </button>
            </div>
          </div>
        )}

        {/* Step 3 — Confirmación */}
        {step === 3 && (
          <div>
            <h2 style={{ fontSize: '20px', fontWeight: 800, color: 'var(--ink)', marginBottom: '6px' }}>
              Últimos pasos
            </h2>
            <p style={{ color: 'var(--ink3)', fontSize: '14px', marginBottom: '24px' }}>
              Leé y aceptá los compromisos del programa.
            </p>

            <div style={{ display: 'grid', gap: '12px', marginBottom: '24px' }}>
              {[
                {
                  key: 'parentConsentSigned',
                  label: 'Mi padre/madre/tutor conoce y aprueba mi participación en el programa.',
                },
                {
                  key: 'termsAccepted',
                  label: 'Acepto los términos y condiciones de Prospera Young AI.',
                },
                {
                  key: 'programRulesAccepted',
                  label: 'Me comprometo a entregar mis desafíos semanales y participar activamente con mi pod.',
                },
              ].map(({ key, label }) => (
                <label key={key} style={{
                  display: 'flex', alignItems: 'flex-start', gap: '12px',
                  padding: '14px', background: 'var(--bg)', borderRadius: 'var(--radius-btn)',
                  cursor: 'pointer',
                }}>
                  <input
                    type="checkbox"
                    checked={step3[key as keyof typeof step3]}
                    onChange={e => setStep3(p => ({ ...p, [key]: e.target.checked }))}
                    style={{ marginTop: '2px', width: '16px', height: '16px', accentColor: 'var(--green)' }}
                  />
                  <span style={{ fontSize: '14px', color: 'var(--ink2)', lineHeight: '1.5' }}>{label}</span>
                </label>
              ))}
            </div>

            {error && (
              <p style={{
                color: 'var(--coral)', fontSize: '13px', marginBottom: '12px',
                padding: '10px 14px', background: 'var(--coral-l)', borderRadius: 'var(--radius-btn)',
              }}>
                {error}
              </p>
            )}

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <button
                onClick={() => setStep(2)}
                style={{
                  padding: '12px', background: 'var(--bg2)', color: 'var(--ink2)',
                  border: 'none', borderRadius: 'var(--radius-btn)', fontSize: '15px',
                  fontWeight: 600, cursor: 'pointer',
                }}
              >
                ← Atrás
              </button>
              <button
                onClick={handleFinish}
                disabled={loading || !step3.termsAccepted || !step3.programRulesAccepted}
                style={{
                  padding: '12px',
                  background: loading || !step3.termsAccepted || !step3.programRulesAccepted
                    ? 'var(--ink4)' : 'var(--green)',
                  color: 'var(--white)', border: 'none', borderRadius: 'var(--radius-btn)',
                  fontSize: '15px', fontWeight: 700,
                  cursor: loading || !step3.termsAccepted || !step3.programRulesAccepted
                    ? 'not-allowed' : 'pointer',
                }}
              >
                {loading ? 'Guardando...' : '¡Empezar!'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
