'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

type Tab = 'login' | 'register'

export default function LoginPage() {
  const router = useRouter()
  const [tab, setTab] = useState<Tab>('login')

  // Login state
  const [email, setEmail] = useState('')
  const [sent, setSent] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Register state
  const [regForm, setRegForm] = useState({ fullName: '', email: '', country: '', age: '' })

  async function sendMagicLink() {
    if (!email) return
    setLoading(true)
    setError(null)

    const supabase = createClient()
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: { emailRedirectTo: `${window.location.origin}/auth/callback` },
    })

    if (error) {
      setError('No pudimos enviar el link. Verificá tu email e intentá de nuevo.')
    } else {
      setSent(true)
    }
    setLoading(false)
  }

  function handleRegister() {
    router.push('/apply')
  }

  return (
    <div style={{
      fontFamily: "-apple-system,'Segoe UI',system-ui,sans-serif",
      background: 'var(--navy)',
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '24px',
    }}>
      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        maxWidth: '900px',
        width: '100%',
        minHeight: '580px',
        borderRadius: '24px',
        overflow: 'hidden',
        boxShadow: '0 32px 80px rgba(0,0,0,0.4)',
      }}>

        {/* ── Brand side ── */}
        <div style={{
          background: 'var(--navy2)',
          padding: '48px 40px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          position: 'relative',
          overflow: 'hidden',
        }}>
          {/* bg glow */}
          <div style={{
            position: 'absolute', right: '-40px', bottom: '-40px',
            width: '280px', height: '280px',
            background: 'radial-gradient(circle,rgba(0,200,150,0.12) 0%,transparent 70%)',
            pointerEvents: 'none',
          }} />

          <div>
            {/* Logo */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '48px' }}>
              <div style={{
                width: '36px', height: '36px', background: 'var(--green)',
                borderRadius: '9px', display: 'flex', alignItems: 'center',
                justifyContent: 'center', fontWeight: 900, fontSize: '17px', color: 'var(--navy)',
              }}>P</div>
              <span style={{ fontWeight: 800, fontSize: '18px', color: '#fff' }}>Prospera Young AI</span>
            </div>

            {/* Hero */}
            <div>
              <h1 style={{ fontWeight: 800, fontSize: '32px', color: '#fff', lineHeight: 1.15, marginBottom: '16px' }}>
                Construí algo <span style={{ color: 'var(--green)' }}>real</span> en 6 semanas.
              </h1>
              <p style={{ fontSize: '14px', color: 'rgba(255,255,255,0.55)', lineHeight: 1.7, maxWidth: '280px' }}>
                El programa intensivo para jóvenes latinos de 14 a 18 años que quieren crear con inteligencia artificial — desde el día 1.
              </p>
            </div>
          </div>

          {/* Stats */}
          <div style={{ display: 'flex', gap: '24px' }}>
            {[
              { n: '6', l: 'semanas intensivas' },
              { n: '100%', l: 'virtual y en español' },
              { n: 'FGU', l: 'certificación' },
            ].map(({ n, l }) => (
              <div key={n}>
                <div style={{ fontWeight: 800, fontSize: '24px', color: 'var(--green)' }}>{n}</div>
                <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.4)', marginTop: '1px' }}>{l}</div>
              </div>
            ))}
          </div>
        </div>

        {/* ── Form side ── */}
        <div style={{
          background: 'var(--white)',
          padding: '48px 40px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
        }}>
          <div style={{ fontWeight: 800, fontSize: '22px', color: 'var(--ink)', marginBottom: '6px' }}>
            Bienvenido/a 👋
          </div>
          <div style={{ fontSize: '14px', color: 'var(--ink3)', marginBottom: '32px', lineHeight: 1.5 }}>
            Ingresá a tu portal o registrate para la próxima cohorte.
          </div>

          {/* Tabs */}
          <div style={{
            display: 'flex', gap: 0, marginBottom: '28px',
            background: 'var(--bg)', borderRadius: '10px', padding: '3px',
          }}>
            {(['login', 'register'] as Tab[]).map((t, i) => (
              <button key={t} onClick={() => setTab(t)} style={{
                flex: 1, padding: '8px', borderRadius: '8px', border: 'none',
                background: tab === t ? 'var(--white)' : 'transparent',
                fontSize: '13px', fontWeight: 600,
                color: tab === t ? 'var(--ink)' : 'var(--ink3)',
                cursor: 'pointer',
                boxShadow: tab === t ? '0 1px 4px rgba(0,0,0,0.08)' : 'none',
                transition: 'all .15s',
                fontFamily: 'inherit',
              }}>
                {i === 0 ? 'Ya tengo cuenta' : 'Registrarme'}
              </button>
            ))}
          </div>

          {/* ── Login tab ── */}
          {tab === 'login' && (
            <>
              {!sent ? (
                <div style={{
                  background: 'var(--bg)', borderRadius: '12px',
                  padding: '16px', border: '1.5px dashed var(--bg2)',
                }}>
                  <div style={{ fontSize: '13px', fontWeight: 700, color: 'var(--ink2)', marginBottom: '4px' }}>
                    🔗 Acceso por link mágico
                  </div>
                  <div style={{ fontSize: '12px', color: 'var(--ink3)', lineHeight: 1.5, marginBottom: '12px' }}>
                    Te mandamos un link a tu email. Sin contraseña, sin complicaciones.
                  </div>
                  <div style={{ marginBottom: '12px' }}>
                    <input
                      type="email"
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      onKeyDown={e => e.key === 'Enter' && sendMagicLink()}
                      placeholder="tu@email.com"
                      style={{
                        width: '100%', background: 'var(--white)',
                        border: '1.5px solid var(--border)', borderRadius: '10px',
                        padding: '11px 14px', fontSize: '14px', color: 'var(--ink)',
                        outline: 'none', boxSizing: 'border-box', fontFamily: 'inherit',
                      }}
                    />
                  </div>
                  {error && (
                    <p style={{
                      fontSize: '12px', color: 'var(--coral)',
                      background: 'var(--coral-l)', borderRadius: '8px',
                      padding: '8px 12px', marginBottom: '10px',
                    }}>{error}</p>
                  )}
                  <button
                    onClick={sendMagicLink}
                    disabled={loading || !email}
                    style={{
                      display: 'block', width: '100%', background: loading || !email ? 'var(--ink4)' : 'var(--navy)',
                      color: '#fff', border: 'none', borderRadius: '10px',
                      padding: '11px', fontSize: '13px', fontWeight: 700,
                      cursor: loading || !email ? 'not-allowed' : 'pointer',
                      transition: 'all .15s', fontFamily: 'inherit',
                    }}
                  >
                    {loading ? 'Enviando...' : 'Enviar link de acceso →'}
                  </button>
                </div>
              ) : (
                <div style={{ textAlign: 'center', padding: '20px 0' }}>
                  <div style={{
                    width: '56px', height: '56px', background: 'var(--green-l)',
                    borderRadius: '50%', display: 'flex', alignItems: 'center',
                    justifyContent: 'center', fontSize: '26px', margin: '0 auto 16px',
                  }}>✉️</div>
                  <div style={{ fontWeight: 800, fontSize: '18px', color: 'var(--ink)', marginBottom: '8px' }}>
                    ¡Revisá tu email!
                  </div>
                  <div style={{ fontSize: '13px', color: 'var(--ink3)', lineHeight: 1.6 }}>
                    Te mandamos un link de acceso. Expira en 10 minutos.<br />
                    No olvides revisar tu carpeta de spam.
                  </div>
                </div>
              )}

              <div style={{ marginTop: '20px', fontSize: '12px', color: 'var(--ink3)', textAlign: 'center', lineHeight: 1.6 }}>
                ¿No tenés cuenta aún?{' '}
                <span onClick={() => setTab('register')} style={{ color: 'var(--teal)', fontWeight: 600, cursor: 'pointer' }}>
                  Registrate acá
                </span>
              </div>
            </>
          )}

          {/* ── Register tab ── */}
          {tab === 'register' && (
            <>
              <div style={{
                background: 'var(--mag-l)', borderRadius: '8px', padding: '10px 12px',
                marginBottom: '16px', fontSize: '12px', color: 'var(--ink2)',
                lineHeight: 1.5, borderLeft: '3px solid var(--magenta)',
              }}>
                ✦ Para menores de 18 años se requiere autorización de un padre o tutor. Les enviaremos un email de consentimiento.
              </div>

              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: 'var(--ink2)', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  Nombre completo
                </label>
                <input type="text" value={regForm.fullName}
                  onChange={e => setRegForm(p => ({ ...p, fullName: e.target.value }))}
                  placeholder="Valentina García"
                  style={{ width: '100%', background: 'var(--bg)', border: '1.5px solid var(--border)', borderRadius: '10px', padding: '11px 14px', fontSize: '14px', color: 'var(--ink)', outline: 'none', boxSizing: 'border-box', fontFamily: 'inherit' }}
                />
              </div>

              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: 'var(--ink2)', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  Email
                </label>
                <input type="email" value={regForm.email}
                  onChange={e => setRegForm(p => ({ ...p, email: e.target.value }))}
                  placeholder="tu@email.com"
                  style={{ width: '100%', background: 'var(--bg)', border: '1.5px solid var(--border)', borderRadius: '10px', padding: '11px 14px', fontSize: '14px', color: 'var(--ink)', outline: 'none', boxSizing: 'border-box', fontFamily: 'inherit' }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '16px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: 'var(--ink2)', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>País</label>
                  <input type="text" value={regForm.country}
                    onChange={e => setRegForm(p => ({ ...p, country: e.target.value }))}
                    placeholder="México"
                    style={{ width: '100%', background: 'var(--bg)', border: '1.5px solid var(--border)', borderRadius: '10px', padding: '11px 14px', fontSize: '14px', color: 'var(--ink)', outline: 'none', boxSizing: 'border-box', fontFamily: 'inherit' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: 'var(--ink2)', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Edad</label>
                  <input type="number" value={regForm.age} min={14} max={18}
                    onChange={e => setRegForm(p => ({ ...p, age: e.target.value }))}
                    placeholder="16"
                    style={{ width: '100%', background: 'var(--bg)', border: '1.5px solid var(--border)', borderRadius: '10px', padding: '11px 14px', fontSize: '14px', color: 'var(--ink)', outline: 'none', boxSizing: 'border-box', fontFamily: 'inherit' }}
                  />
                </div>
              </div>

              <button
                onClick={handleRegister}
                style={{
                  display: 'block', width: '100%', background: 'var(--green)',
                  color: 'var(--navy)', border: 'none', borderRadius: '10px',
                  padding: '12px', fontSize: '15px', fontWeight: 800,
                  cursor: 'pointer', transition: 'all .15s', fontFamily: 'inherit', marginTop: '8px',
                }}
              >
                Reservar mi lugar →
              </button>

              <div style={{ marginTop: '20px', fontSize: '12px', color: 'var(--ink3)', textAlign: 'center', lineHeight: 1.6 }}>
                Al registrarte aceptás los <span style={{ color: 'var(--teal)', fontWeight: 600, cursor: 'pointer' }}>términos del programa</span>.<br />
                Tu lugar se confirma al completar el pago.
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
