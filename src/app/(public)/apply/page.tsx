import Link from 'next/link'

// Stripe payment integration — deferred
// This page will be implemented when Stripe is configured.

export default function ApplyPage() {
  return (
    <div style={{
      minHeight: '100vh',
      background: '#f5f4f0',
      fontFamily: "-apple-system,'Segoe UI',system-ui,sans-serif",
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: '24px',
    }}>
      <div style={{ background: 'white', borderRadius: '20px', padding: '48px 40px', maxWidth: '480px', width: '100%', textAlign: 'center' }}>
        <div style={{
          width: '64px', height: '64px', background: '#0E2A47',
          borderRadius: '16px', display: 'flex', alignItems: 'center',
          justifyContent: 'center', fontSize: '28px', margin: '0 auto 20px',
        }}>🚀</div>
        <h1 style={{ fontWeight: 900, fontSize: '24px', marginBottom: '12px' }}>
          Inscripciones próximamente
        </h1>
        <p style={{ color: '#6B7280', fontSize: '15px', lineHeight: 1.6, marginBottom: '28px' }}>
          Estamos preparando el proceso de inscripción. Mientras tanto, podés solicitar una beca o ingresar a la plataforma si ya tenés acceso.
        </p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <Link href="/scholarship" style={{
            background: '#0E2A47', color: 'white',
            borderRadius: '10px', padding: '13px 24px',
            fontSize: '14px', fontWeight: 700, textDecoration: 'none',
            display: 'block',
          }}>
            Solicitar beca
          </Link>
          <Link href="/login" style={{
            background: 'white', color: '#0E2A47',
            border: '1px solid rgba(17,17,16,0.12)',
            borderRadius: '10px', padding: '13px 24px',
            fontSize: '14px', fontWeight: 700, textDecoration: 'none',
            display: 'block',
          }}>
            Ya tengo acceso → Ingresar
          </Link>
          <Link href="/" style={{ fontSize: '13px', color: '#9CA3AF', textDecoration: 'none', marginTop: '4px' }}>
            ← Volver al inicio
          </Link>
        </div>
      </div>
    </div>
  )
}
