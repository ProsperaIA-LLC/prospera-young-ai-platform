'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [sent, setSent] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError(null)

    const supabase = createClient()
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
    })

    if (error) {
      setError('No pudimos enviar el link. Verificá tu email e intentá de nuevo.')
    } else {
      setSent(true)
    }
    setLoading(false)
  }

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
        maxWidth: '400px',
        boxShadow: '0 2px 16px rgba(0,0,0,0.06)',
      }}>
        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '48px',
            height: '48px',
            background: 'var(--navy)',
            borderRadius: '12px',
            marginBottom: '16px',
          }}>
            <span style={{ color: 'var(--green)', fontSize: '24px', fontWeight: 800 }}>P</span>
          </div>
          <h1 style={{ fontSize: '22px', fontWeight: 800, color: 'var(--ink)', margin: 0 }}>
            Prospera Young AI
          </h1>
          <p style={{ color: 'var(--ink3)', fontSize: '14px', marginTop: '6px' }}>
            Entrá a tu cuenta
          </p>
        </div>

        {sent ? (
          <div style={{
            background: 'var(--green-l)',
            borderRadius: 'var(--radius-btn)',
            padding: '20px',
            textAlign: 'center',
          }}>
            <div style={{ fontSize: '32px', marginBottom: '12px' }}>📬</div>
            <p style={{ fontWeight: 700, color: 'var(--ink)', marginBottom: '8px' }}>
              ¡Revisá tu email!
            </p>
            <p style={{ color: 'var(--ink2)', fontSize: '14px' }}>
              Te enviamos un link mágico a <strong>{email}</strong>. Hacé clic ahí para entrar.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: '16px' }}>
              <label style={{
                display: 'block',
                fontSize: '13px',
                fontWeight: 700,
                color: 'var(--ink2)',
                marginBottom: '8px',
                textTransform: 'uppercase',
                letterSpacing: '0.06em',
              }}>
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="tu@email.com"
                required
                style={{
                  width: '100%',
                  padding: '12px 14px',
                  background: 'var(--bg2)',
                  border: '1.5px solid var(--border)',
                  borderRadius: 'var(--radius-btn)',
                  fontSize: '15px',
                  color: 'var(--ink)',
                  outline: 'none',
                  boxSizing: 'border-box',
                }}
              />
            </div>

            {error && (
              <p style={{
                color: 'var(--coral)',
                fontSize: '13px',
                marginBottom: '12px',
                padding: '10px 14px',
                background: 'var(--coral-l)',
                borderRadius: 'var(--radius-btn)',
              }}>
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={loading || !email}
              style={{
                width: '100%',
                padding: '13px',
                background: loading || !email ? 'var(--ink4)' : 'var(--green)',
                color: 'var(--white)',
                border: 'none',
                borderRadius: 'var(--radius-btn)',
                fontSize: '15px',
                fontWeight: 700,
                cursor: loading || !email ? 'not-allowed' : 'pointer',
                transition: 'background 0.15s',
              }}
            >
              {loading ? 'Enviando...' : 'Enviar link de acceso'}
            </button>

            <p style={{
              textAlign: 'center',
              color: 'var(--ink3)',
              fontSize: '13px',
              marginTop: '20px',
            }}>
              ¿No tenés cuenta?{' '}
              <a href="/register" style={{ color: 'var(--teal)', fontWeight: 700, textDecoration: 'none' }}>
                Registrate acá
              </a>
            </p>
          </form>
        )}
      </div>
    </div>
  )
}
