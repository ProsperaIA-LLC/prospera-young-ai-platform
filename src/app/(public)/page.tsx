'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'

// ── Data ──────────────────────────────────────────────────────────────────────

const WEEKS = [
  {
    n: 1, phase: 'Fase Despertar', phaseColor: 'var(--teal)',
    title: 'El problema que te duele',
    deliverable: 'Entrevistás 3 personas reales y encontrás evidencia de que el problema existe',
    tools: ['Claude', 'Notion'], special: false,
  },
  {
    n: 2, phase: 'Fase Despertar', phaseColor: 'var(--teal)',
    title: 'IA como forma de pensar',
    deliverable: 'Resolvés tu problema con IA en 30 minutos (sin teoría previa) y aprendés del intento',
    tools: ['Claude', 'Prompting avanzado'], special: false,
  },
  {
    n: 3, phase: 'Fase Construir', phaseColor: 'var(--coral)',
    title: 'Algo real en 5 días',
    deliverable: 'Un prototipo que alguien que no te conoce puede usar sin instrucciones',
    tools: ['Claude Code', 'Glide'], special: false,
  },
  {
    n: 4, phase: 'Fase Construir', phaseColor: 'var(--coral)',
    title: 'Las 3 preguntas del negocio',
    deliverable: 'Modelo de negocio en 1 página con 2 precios confirmados por personas reales',
    tools: ['Claude', 'Experimento de precio'], special: false,
  },
  {
    n: 5, phase: 'Fase Construir', phaseColor: 'var(--coral)',
    title: 'Agentes que trabajan mientras dormís',
    deliverable: 'Un agente de IA que automatiza al menos 30 minutos de trabajo semanal en tu proyecto',
    tools: ['n8n', 'Make', 'Claude API'], special: false,
  },
  {
    n: 6, phase: 'Fase Lanzar', phaseColor: 'var(--green)',
    title: 'Demo Day: tu primer hito público 🏆',
    deliverable: 'Pitch de 5 minutos + producto publicado en vivo + certificado FGU',
    tools: ['Pitch', 'Demo en vivo', 'Certificado FGU'], special: true,
  },
]

const FEATURES = [
  { icon: '⚡', bg: 'rgba(0,200,150,0.15)',  title: 'Construís desde el día 1',      desc: 'No hay semanas de teoría antes de tocar herramientas. El primer día ya tenés un primer intento con IA.' },
  { icon: '⬡', bg: 'rgba(0,140,165,0.15)',  title: 'Sistema de pods y buddy',        desc: 'Trabajás en grupos de 4–5 con un compañero asignado. Hay accountability real, no solo motivación.' },
  { icon: '✦', bg: 'rgba(165,8,107,0.15)',  title: 'Próspero: tu tutor IA 24/7',    desc: 'Un tutor con IA basado en Claude, disponible siempre, que conoce tu proyecto y te guía sin hacer el trabajo por vos.' },
  { icon: '🏆', bg: 'rgba(224,163,38,0.15)', title: 'Certificación FGU',              desc: 'Al terminar recibís un certificado oficial de la FGU que acredita tus competencias en emprendimiento e IA.' },
  { icon: '🌎', bg: 'rgba(255,92,53,0.15)',  title: 'Red latinoamericana',            desc: 'Conectás con jóvenes de México, Colombia, Argentina, Perú, Venezuela y toda la región con tu misma mentalidad.' },
  { icon: '🧠', bg: 'rgba(0,200,150,0.15)',  title: 'Método finlandés',               desc: 'Reflexión semanal, sin ranking entre estudiantes, y aprendizaje desde problemas reales — no desde teoría abstracta.' },
]

const CHAT = [
  { role: 'user', text: 'No entiendo por qué mi prototipo en Glide no guarda los datos del formulario 😩' },
  { role: 'bot',  text: 'Antes de buscar el error técnico — ¿pudiste ver exactamente en qué momento falla? ¿El formulario se envía y los datos no aparecen, o el botón de envío no responde?' },
  { role: 'user', text: 'El botón sí responde pero los datos no aparecen en la hoja' },
  { role: 'bot',  text: 'Ahí está el problema. En Glide, el formulario guarda en la hoja fuente del componente — no en cualquier hoja. ¿Tu tabla de datos está conectada como fuente del form o la creaste separada? 🔍' },
]

// ── Scroll helper ─────────────────────────────────────────────────────────────

function scrollTo(id: string) {
  document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
}

// ── Component ─────────────────────────────────────────────────────────────────

export default function LandingPage() {
  const router = useRouter()

  return (
    <div style={{
      fontFamily: "-apple-system,'Segoe UI',system-ui,sans-serif",
      background: 'var(--white)', color: 'var(--ink)', fontSize: 15, lineHeight: '1.5',
    }}>

      {/* ── NAV ─────────────────────────────────────────────────────────────── */}
      <nav style={{
        position: 'sticky', top: 0, zIndex: 100,
        background: 'rgba(255,255,255,0.95)', backdropFilter: 'blur(12px)',
        borderBottom: '1px solid var(--border)',
        padding: '14px 5%',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 9 }}>
          <div style={{
            width: 32, height: 32, background: 'var(--green)', borderRadius: 8,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontWeight: 900, fontSize: 15, color: 'var(--navy)',
          }}>P</div>
          <span style={{ fontWeight: 800, fontSize: 16, color: 'var(--ink)' }}>Prospera Young AI</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 28 }}>
          {[
            { label: 'Programa', id: 'programa' },
            { label: 'Precios',  id: 'precios'  },
          ].map(({ label, id }) => (
            <button
              key={id}
              onClick={() => scrollTo(id)}
              style={{
                fontSize: 14, fontWeight: 500, color: 'var(--ink3)',
                background: 'none', border: 'none', cursor: 'pointer',
                fontFamily: 'inherit', padding: 0,
              }}
            >
              {label}
            </button>
          ))}
          <Link href="/scholarship" style={{ fontSize: 14, fontWeight: 500, color: 'var(--ink3)', textDecoration: 'none' }}>Becas</Link>
          <Link href="/login"       style={{ fontSize: 14, fontWeight: 500, color: 'var(--ink3)', textDecoration: 'none' }}>FAQ</Link>
          <button
            onClick={() => scrollTo('precios')}
            style={{
              background: 'var(--navy)', color: '#fff', border: 'none',
              borderRadius: 9, padding: '9px 20px', fontSize: 14, fontWeight: 700,
              cursor: 'pointer', fontFamily: 'inherit', transition: 'background .15s',
            }}
            onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.background = 'var(--navy2)' }}
            onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = 'var(--navy)' }}
          >
            Reservar lugar →
          </button>
        </div>
      </nav>

      {/* ── HERO ────────────────────────────────────────────────────────────── */}
      <section style={{ background: 'var(--navy)', padding: '80px 5% 72px', position: 'relative', overflow: 'hidden' }}>
        {/* Glows */}
        <div style={{ position: 'absolute', right: -80, top: -80, width: 400, height: 400, background: 'radial-gradient(circle,rgba(0,200,150,0.14) 0%,transparent 70%)', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', left: '30%', bottom: -60, width: 300, height: 300, background: 'radial-gradient(circle,rgba(0,140,165,0.08) 0%,transparent 70%)', pointerEvents: 'none' }} />

        <div style={{ maxWidth: 720, margin: '0 auto', textAlign: 'center', position: 'relative', zIndex: 1 }}>
          {/* Badge */}
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 8,
            background: 'rgba(0,200,150,0.12)', border: '1px solid rgba(0,200,150,0.25)',
            borderRadius: 20, padding: '6px 16px', marginBottom: 24,
          }}>
            <span style={{ width: 7, height: 7, borderRadius: '50%', background: 'var(--green)', display: 'inline-block' }} />
            <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--green)' }}>Cohorte 1 · Abre inscripciones pronto · Certificación FGU</span>
          </div>

          <h1 style={{ fontWeight: 900, fontSize: 48, color: '#fff', lineHeight: 1.1, marginBottom: 18, letterSpacing: '-1px' }}>
            Construí algo<br />
            <span style={{ color: 'var(--green)' }}>real con IA</span><br />
            en 6 semanas.
          </h1>

          <p style={{ fontSize: 17, color: 'rgba(255,255,255,0.6)', lineHeight: 1.7, maxWidth: 560, margin: '0 auto 36px' }}>
            El programa intensivo para jóvenes latinos de 14 a 18 años. No aprendés sobre IA — la usás para resolver un problema real desde el día 1.
          </p>

          <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
            <button
              onClick={() => scrollTo('precios')}
              style={{
                background: 'var(--green)', color: 'var(--navy)', border: 'none',
                borderRadius: 12, padding: '14px 28px', fontSize: 15, fontWeight: 800,
                cursor: 'pointer', fontFamily: 'inherit', transition: 'all .15s',
              }}
              onMouseEnter={e => { const b = e.currentTarget as HTMLButtonElement; b.style.background = '#00dea6'; b.style.transform = 'translateY(-2px)' }}
              onMouseLeave={e => { const b = e.currentTarget as HTMLButtonElement; b.style.background = 'var(--green)'; b.style.transform = '' }}
            >
              Quiero mi lugar →
            </button>
            <button
              onClick={() => scrollTo('programa')}
              style={{
                background: 'rgba(255,255,255,0.08)', color: '#fff',
                border: '1px solid rgba(255,255,255,0.2)',
                borderRadius: 12, padding: '14px 24px', fontSize: 15, fontWeight: 600,
                cursor: 'pointer', fontFamily: 'inherit', transition: 'all .15s',
              }}
              onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.background = 'rgba(255,255,255,0.14)' }}
              onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = 'rgba(255,255,255,0.08)' }}
            >
              Ver cómo funciona ↓
            </button>
          </div>

          {/* Stats */}
          <div style={{
            display: 'flex', justifyContent: 'center', gap: 40,
            marginTop: 48, paddingTop: 32,
            borderTop: '1px solid rgba(255,255,255,0.08)',
            flexWrap: 'wrap',
          }}>
            {[
              { n: '6',    l: 'semanas intensivas' },
              { n: '100%', l: 'virtual y en español' },
              { n: '14–18',l: 'años' },
              { n: 'FGU',  l: 'certificación oficial' },
            ].map(({ n, l }) => (
              <div key={l} style={{ textAlign: 'center' }}>
                <div style={{ fontWeight: 900, fontSize: 28, color: 'var(--green)' }}>{n}</div>
                <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.45)', marginTop: 2 }}>{l}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ────────────────────────────────────────────────────── */}
      <section id="programa" style={{ padding: '72px 5%', background: 'var(--white)' }}>
        <div style={{ maxWidth: 900, margin: '0 auto' }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--teal)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 10 }}>El programa</div>
          <h2 style={{ fontWeight: 900, fontSize: 32, color: 'var(--ink)', marginBottom: 12, lineHeight: 1.15 }}>
            6 semanas. Un producto real.<br />Un Demo Day público.
          </h2>
          <p style={{ fontSize: 15, color: 'var(--ink3)', lineHeight: 1.7, maxWidth: 540, marginBottom: 36 }}>
            Cada semana tiene un reto, un entregable concreto, y una señal de éxito clara. No hay examen final — hay un producto que funciona.
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {WEEKS.map(w => (
              <div key={w.n} style={{ display: 'grid', gridTemplateColumns: '80px 1fr', gap: 20, alignItems: 'start' }}>
                {/* Week number */}
                <div style={{ textAlign: 'right', paddingTop: 14 }}>
                  <span style={{ fontWeight: 900, fontSize: 28, color: 'var(--bg2)', lineHeight: 1 }}>{w.n}</span>
                </div>
                {/* Week card */}
                <div style={{
                  background: w.special ? 'var(--green-l)' : 'var(--bg)',
                  borderRadius: 14, padding: '16px 20px',
                  border: `1px solid ${w.special ? 'var(--green)' : 'var(--border)'}`,
                }}>
                  <div style={{ fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: 4, color: w.phaseColor }}>
                    {w.phase}
                  </div>
                  <div style={{ fontWeight: 800, fontSize: 15, color: 'var(--ink)', marginBottom: 4 }}>{w.title}</div>
                  <div style={{ fontSize: 13, color: 'var(--ink3)', marginBottom: 8 }}>→ {w.deliverable}</div>
                  <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                    {w.tools.map(t => (
                      <span key={t} style={{
                        fontSize: 11, fontWeight: 600, padding: '2px 9px', borderRadius: 20,
                        background: 'var(--white)', border: '1px solid var(--border)', color: 'var(--ink2)',
                      }}>{t}</span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FEATURES ────────────────────────────────────────────────────────── */}
      <section style={{ padding: '72px 5%', background: 'var(--navy)' }}>
        <div style={{ maxWidth: 900, margin: '0 auto' }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--teal)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 10 }}>Por qué Prospera</div>
          <h2 style={{ fontWeight: 900, fontSize: 32, color: '#fff', marginBottom: 12, lineHeight: 1.15 }}>
            Todo lo que un programa online<br />nunca te había dado.
          </h2>
          <p style={{ fontSize: 15, color: 'rgba(255,255,255,0.5)', lineHeight: 1.7, maxWidth: 540, marginBottom: 36 }}>
            Diseñado específicamente para jóvenes latinos — no es un programa de adultos reducido.
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 14 }}>
            {FEATURES.map(f => (
              <div key={f.title} style={{
                background: 'rgba(255,255,255,0.05)',
                border: '1px solid rgba(255,255,255,0.08)',
                borderRadius: 16, padding: 22,
              }}>
                <div style={{
                  width: 40, height: 40, borderRadius: 10,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 20, marginBottom: 14, background: f.bg,
                }}>{f.icon}</div>
                <div style={{ fontWeight: 800, fontSize: 15, color: '#fff', marginBottom: 6 }}>{f.title}</div>
                <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.5)', lineHeight: 1.65 }}>{f.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── PRÓSPERO ────────────────────────────────────────────────────────── */}
      <section style={{ padding: '64px 5%', background: 'var(--mag-l)' }}>
        <div style={{ maxWidth: 900, margin: '0 auto', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 48, alignItems: 'center' }}>
          {/* Left copy */}
          <div>
            <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--magenta)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 10 }}>Tutor IA</div>
            <h2 style={{ fontWeight: 900, fontSize: 28, color: 'var(--ink)', marginBottom: 12, lineHeight: 1.2 }}>
              Próspero está con vos a las 11pm cuando estás trabado/a.
            </h2>
            <p style={{ fontSize: 15, color: 'var(--ink3)', lineHeight: 1.7, margin: 0 }}>
              No reemplaza al mentor humano. Te guía con preguntas, te ayuda a pensar, y sabe exactamente en qué semana y con qué herramientas estás trabajando.
            </p>
          </div>

          {/* Chat preview */}
          <div style={{ background: 'var(--navy)', borderRadius: 18, padding: 20, boxShadow: '0 16px 48px rgba(14,42,71,0.2)' }}>
            {/* Header */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16, paddingBottom: 14, borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
              <div style={{ position: 'relative', flexShrink: 0 }}>
                <div style={{
                  width: 36, height: 36, borderRadius: '50%',
                  background: 'var(--magenta)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 17, color: '#fff', fontWeight: 700,
                }}>✦</div>
                <div style={{
                  position: 'absolute', bottom: 0, right: 0,
                  width: 10, height: 10, borderRadius: '50%',
                  background: 'var(--green)', border: '2px solid var(--navy)',
                }} />
              </div>
              <div>
                <div style={{ fontWeight: 800, fontSize: 14, color: '#fff' }}>Próspero · Tutor IA</div>
                <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)' }}>Disponible ahora · Semana 3</div>
              </div>
            </div>

            {/* Messages */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {CHAT.map((m, i) => (
                <div
                  key={i}
                  style={{
                    maxWidth: '85%', padding: '10px 13px', fontSize: 13, lineHeight: 1.5,
                    alignSelf: m.role === 'user' ? 'flex-end' : 'flex-start',
                    background: m.role === 'user' ? 'var(--magenta)' : 'rgba(255,255,255,0.07)',
                    color: m.role === 'user' ? '#fff' : 'rgba(255,255,255,0.85)',
                    borderRadius: m.role === 'user' ? '14px 4px 14px 14px' : '4px 14px 14px 14px',
                  }}
                >
                  {m.text}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── PRICING ─────────────────────────────────────────────────────────── */}
      <section id="precios" style={{ padding: '72px 5%', background: 'var(--bg)' }}>
        <div style={{ maxWidth: 900, margin: '0 auto' }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--teal)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 10 }}>Precios</div>
          <h2 style={{ fontWeight: 900, fontSize: 32, color: 'var(--ink)', marginBottom: 12, lineHeight: 1.15 }}>Elegí tu mercado.</h2>
          <p style={{ fontSize: 15, color: 'var(--ink3)', lineHeight: 1.7, maxWidth: 540, marginBottom: 36 }}>
            Precios en dólares USD. Early bird disponible las primeras 3 semanas de inscripción.
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
            {/* USA card — navy */}
            <div style={{
              background: 'var(--navy)', borderRadius: 18, padding: 28,
              border: '1px solid var(--border)', position: 'relative', overflow: 'hidden',
            }}>
              <div style={{ fontSize: 32, marginBottom: 14 }}>🇺🇸</div>
              <div style={{
                display: 'inline-block', fontSize: 11, fontWeight: 700,
                textTransform: 'uppercase', letterSpacing: '0.06em',
                padding: '3px 10px', borderRadius: 20, marginBottom: 12,
                background: 'rgba(0,200,150,0.15)', color: 'var(--green)',
              }}>Para Estados Unidos</div>
              <div style={{ fontWeight: 900, fontSize: 20, color: '#fff', marginBottom: 8 }}>Latinos &amp; hijos de latinos en USA</div>
              <div style={{ fontSize: 14, lineHeight: 1.65, color: 'rgba(255,255,255,0.6)', marginBottom: 16 }}>
                Si vivís en Estados Unidos y querés un programa 100% en español con certificación internacional y red latinoamericana.
              </div>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 6, marginBottom: 16 }}>
                <span style={{ fontWeight: 900, fontSize: 32, color: 'var(--green)' }}>$797</span>
                <span style={{ fontSize: 13, color: 'rgba(255,255,255,0.4)' }}>USD · precio completo</span>
              </div>
              <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--gold)', marginBottom: 20 }}>🔥 Early bird: $497 — primeros 21 días</div>
              <button
                onClick={() => router.push('/apply?market=USA')}
                style={{
                  display: 'block', width: '100%', border: 'none', borderRadius: 10,
                  padding: 12, fontSize: 14, fontWeight: 800, cursor: 'pointer',
                  fontFamily: 'inherit', background: 'var(--green)', color: 'var(--navy)',
                  transition: 'all .15s', textAlign: 'center',
                }}
                onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.transform = 'translateY(-1px)' }}
                onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.transform = '' }}
              >
                Reservar lugar USA →
              </button>
              <div style={{ marginTop: 10, textAlign: 'center', fontSize: 12, color: 'rgba(255,255,255,0.4)' }}>
                ¿No podés pagarlo?{' '}
                <Link href="/scholarship" style={{ color: 'var(--green)', fontWeight: 700, textDecoration: 'none' }}>Aplicá a una beca →</Link>
              </div>
            </div>

            {/* LATAM card — white */}
            <div style={{
              background: 'var(--white)', borderRadius: 18, padding: 28,
              border: '1px solid var(--border)', position: 'relative', overflow: 'hidden',
            }}>
              <div style={{ fontSize: 32, marginBottom: 14 }}>🌎</div>
              <div style={{
                display: 'inline-block', fontSize: 11, fontWeight: 700,
                textTransform: 'uppercase', letterSpacing: '0.06em',
                padding: '3px 10px', borderRadius: 20, marginBottom: 12,
                background: 'var(--teal-l)', color: 'var(--teal)',
              }}>Para Latinoamérica</div>
              <div style={{ fontWeight: 900, fontSize: 20, color: 'var(--ink)', marginBottom: 8 }}>Jóvenes de LATAM</div>
              <div style={{ fontSize: 14, lineHeight: 1.65, color: 'var(--ink3)', marginBottom: 16 }}>
                Si vivís en México, Colombia, Argentina, Perú, Venezuela, Ecuador, Chile o cualquier país de la región.
              </div>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 6, marginBottom: 16 }}>
                <span style={{ fontWeight: 900, fontSize: 32, color: 'var(--teal)' }}>$297</span>
                <span style={{ fontSize: 13, color: 'var(--ink3)' }}>USD · precio completo</span>
              </div>
              <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--gold)', marginBottom: 20 }}>🔥 Early bird: $197 — primeros 21 días</div>
              <button
                onClick={() => router.push('/apply?market=LATAM')}
                style={{
                  display: 'block', width: '100%', border: 'none', borderRadius: 10,
                  padding: 12, fontSize: 14, fontWeight: 800, cursor: 'pointer',
                  fontFamily: 'inherit', background: 'var(--navy)', color: '#fff',
                  transition: 'all .15s', textAlign: 'center',
                }}
                onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.transform = 'translateY(-1px)' }}
                onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.transform = '' }}
              >
                Reservar lugar LATAM →
              </button>
              <div style={{ marginTop: 10, textAlign: 'center', fontSize: 12, color: 'var(--ink3)' }}>
                ¿No podés pagarlo?{' '}
                <Link href="/scholarship" style={{ color: 'var(--teal)', fontWeight: 700, textDecoration: 'none' }}>Aplicá a una beca →</Link>
              </div>
            </div>
          </div>

          {/* Scholarship CTA row */}
          <div style={{
            background: 'var(--white)', borderRadius: 14, padding: '20px 24px',
            border: '1px solid var(--border)',
            display: 'flex', alignItems: 'center', gap: 16, flexWrap: 'wrap',
          }}>
            <div style={{ fontSize: 24, flexShrink: 0 }}>🎓</div>
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 800, fontSize: 15, color: 'var(--ink)', marginBottom: 3 }}>Becas completas disponibles</div>
              <div style={{ fontSize: 13, color: 'var(--ink3)', lineHeight: 1.6 }}>
                Reservamos 5 cupos por cohorte para estudiantes con talento y motivación que no pueden pagar. El proceso incluye carta de motivación, video de 60 segundos y carta de un referente.
              </div>
            </div>
            <button
              onClick={() => router.push('/scholarship')}
              style={{
                flexShrink: 0, background: 'var(--navy)', color: '#fff',
                border: 'none', borderRadius: 9, padding: '10px 18px',
                fontSize: 13, fontWeight: 700, cursor: 'pointer',
                fontFamily: 'inherit', whiteSpace: 'nowrap',
              }}
            >
              Aplicar a beca →
            </button>
          </div>
        </div>
      </section>

      {/* ── SCHOLARSHIP CTA ──────────────────────────────────────────────────── */}
      <section style={{ padding: '80px 5%', background: 'var(--green)', textAlign: 'center' }}>
        <h2 style={{ fontWeight: 900, fontSize: 36, color: 'var(--navy)', marginBottom: 12, lineHeight: 1.15 }}>
          Tu primer producto real<br />te espera.
        </h2>
        <p style={{ fontSize: 16, color: 'rgba(14,42,71,0.7)', marginBottom: 32, maxWidth: 480, marginLeft: 'auto', marginRight: 'auto', lineHeight: 1.6 }}>
          6 semanas. Un problema tuyo. Una cohorte de jóvenes como vos. Empezamos pronto.
        </p>
        <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
          <button
            onClick={() => scrollTo('precios')}
            style={{
              background: 'var(--navy)', color: '#fff', border: 'none',
              borderRadius: 12, padding: '14px 28px', fontSize: 15, fontWeight: 800,
              cursor: 'pointer', fontFamily: 'inherit', transition: 'all .15s',
            }}
            onMouseEnter={e => { const b = e.currentTarget as HTMLButtonElement; b.style.background = 'var(--navy2)'; b.style.transform = 'translateY(-1px)' }}
            onMouseLeave={e => { const b = e.currentTarget as HTMLButtonElement; b.style.background = 'var(--navy)'; b.style.transform = '' }}
          >
            Reservar mi lugar →
          </button>
          <button
            onClick={() => router.push('/scholarship')}
            style={{
              background: 'transparent', color: 'var(--navy)',
              border: '2px solid rgba(14,42,71,0.25)',
              borderRadius: 12, padding: '14px 24px', fontSize: 15, fontWeight: 700,
              cursor: 'pointer', fontFamily: 'inherit', transition: 'all .15s',
            }}
            onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.background = 'rgba(14,42,71,0.08)' }}
            onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = 'transparent' }}
          >
            Aplicar a beca
          </button>
        </div>
      </section>

      {/* ── FOOTER ──────────────────────────────────────────────────────────── */}
      <footer style={{
        background: 'var(--navy)', padding: '32px 5%',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{
            width: 26, height: 26, background: 'var(--green)', borderRadius: 6,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontWeight: 900, fontSize: 12, color: 'var(--navy)',
          }}>P</div>
          <span style={{ fontWeight: 700, fontSize: 14, color: '#fff' }}>Prospera Young AI</span>
        </div>
        <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.3)' }}>
          © 2025 Prospera IA LLC · Todos los derechos reservados
        </div>
        <div style={{ display: 'flex', gap: 20 }}>
          {[
            { label: 'Términos',   href: '/terms'      },
            { label: 'Privacidad', href: '/privacy'    },
            { label: 'Contacto',   href: '/contact'    },
          ].map(({ label, href }) => (
            <Link key={label} href={href} style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)', textDecoration: 'none', transition: 'color .15s' }}>
              {label}
            </Link>
          ))}
        </div>
      </footer>

    </div>
  )
}
