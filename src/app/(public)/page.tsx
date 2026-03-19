import Link from 'next/link'

const WEEKS = [
  { n: 1, phase: 'Despertar', color: '#008ca5', title: 'El problema que te duele', deliverable: '3 evidencias externas de que el problema existe', tools: ['Claude', 'Notion'] },
  { n: 2, phase: 'Despertar', color: '#008ca5', title: 'IA como forma de pensar', deliverable: 'Biblioteca de 5 prompts validados por el pod', tools: ['Claude', 'ChatGPT'] },
  { n: 3, phase: 'Construir', color: '#ff5c35', title: 'Algo real en 5 días', deliverable: 'Prototipo funcional — un desconocido lo completa solo', tools: ['Claude Code', 'Glide'] },
  { n: 4, phase: 'Construir', color: '#ff5c35', title: 'Las 3 preguntas del negocio', deliverable: 'Modelo de 1 página + 2 precios confirmados externamente', tools: ['Claude', 'WhatsApp'] },
  { n: 5, phase: 'Construir', color: '#ff5c35', title: 'Agentes que trabajan mientras dormís', deliverable: 'Agente que ahorra 30+ min/semana en tu proyecto', tools: ['n8n', 'Make', 'Claude'] },
  { n: 6, phase: 'Lanzar', color: '#00c896', title: 'Demo Day: tu primer hito público', deliverable: 'Pitch grabado + link publicado + compromiso 30 días', tools: ['Claude', 'Loom'] },
]

const FEATURES = [
  { icon: '🤖', title: 'Próspero — tu tutor IA', desc: 'Disponible 24/7, habla como vos, te guía con preguntas en lugar de darte respuestas. Método socrático para Gen Z.' },
  { icon: '🫂', title: 'Sistema de Pods', desc: 'Grupos de 4–5 estudiantes por zona horaria. Un buddy asignado, rotación de liderazgo semanal.' },
  { icon: '📦', title: 'Entregables reales', desc: 'Cada semana terminás algo tangible. No teoría — evidencia, prototipos, precios validados, agentes.' },
  { icon: '🎓', title: 'Mentoría humana', desc: 'Mentores que revisan tu trabajo, dan feedback en tus reflexiones, y detectan cuando necesitás ayuda.' },
  { icon: '🏆', title: 'Certificado FGU', desc: 'Al completar el programa recibís certificación respaldada por FGU. Algo real para tu portafolio.' },
  { icon: '🌎', title: 'Comunidad LATAM + USA', desc: 'Estudiantes de Argentina, México, Colombia, Perú, y latinos en USA. Red que dura más que el programa.' },
]

export default function LandingPage() {
  return (
    <div style={{ fontFamily: "-apple-system,'Segoe UI',system-ui,sans-serif", background: 'white', color: '#111110' }}>

      {/* Nav */}
      <nav style={{
        position: 'sticky', top: 0, zIndex: 100,
        background: 'rgba(255,255,255,0.95)', backdropFilter: 'blur(12px)',
        borderBottom: '1px solid rgba(17,17,16,0.08)',
        padding: '14px 5%',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '9px' }}>
          <div style={{
            width: '32px', height: '32px', background: '#00c896',
            borderRadius: '8px', display: 'flex', alignItems: 'center',
            justifyContent: 'center', fontWeight: 900, fontSize: '15px', color: '#0E2A47',
          }}>P</div>
          <span style={{ fontWeight: 800, fontSize: '16px' }}>Prospera Young AI</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          <Link href="/scholarship" style={{ fontSize: '14px', fontWeight: 500, color: '#8a8884', textDecoration: 'none' }}>
            Becas
          </Link>
          <Link href="/login" style={{ fontSize: '14px', fontWeight: 500, color: '#8a8884', textDecoration: 'none' }}>
            Ingresar
          </Link>
          <Link href="/apply" style={{
            background: '#0E2A47', color: 'white', borderRadius: '9px',
            padding: '9px 20px', fontSize: '14px', fontWeight: 700, textDecoration: 'none',
          }}>
            Aplicar ahora
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section style={{
        background: '#0E2A47', padding: '80px 5% 72px',
        position: 'relative', overflow: 'hidden',
      }}>
        <div style={{
          position: 'absolute', right: '-80px', top: '-80px',
          width: '400px', height: '400px',
          background: 'radial-gradient(circle,rgba(0,200,150,0.14) 0%,transparent 70%)',
          pointerEvents: 'none',
        }} />
        <div style={{ maxWidth: '720px', margin: '0 auto', textAlign: 'center', position: 'relative', zIndex: 1 }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: '8px',
            background: 'rgba(0,200,150,0.12)', border: '1px solid rgba(0,200,150,0.25)',
            borderRadius: '20px', padding: '6px 16px', marginBottom: '24px',
          }}>
            <span style={{ width: '7px', height: '7px', borderRadius: '50%', background: '#00c896', display: 'inline-block' }} />
            <span style={{ fontSize: '12px', fontWeight: 700, color: '#00c896' }}>Inscripciones abiertas — Cohorte 2026</span>
          </div>
          <h1 style={{
            fontWeight: 900, fontSize: '48px', color: 'white',
            lineHeight: 1.1, marginBottom: '18px', letterSpacing: '-1px',
          }}>
            Construí algo <span style={{ color: '#00c896' }}>real con IA</span><br />en 6 semanas
          </h1>
          <p style={{ fontSize: '17px', color: 'rgba(255,255,255,0.6)', lineHeight: 1.7, maxWidth: '560px', margin: '0 auto 36px' }}>
            Programa intensivo para jóvenes latinos de 14 a 18 años. Sin teoría — construís un producto real, lo validás con personas reales, y lo lanzás.
          </p>
          <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link href="/apply" style={{
              background: '#00c896', color: '#0E2A47',
              borderRadius: '12px', padding: '14px 28px',
              fontSize: '15px', fontWeight: 800, textDecoration: 'none',
              display: 'inline-block',
            }}>
              Aplicar al programa →
            </Link>
            <Link href="/scholarship" style={{
              background: 'rgba(255,255,255,0.08)', color: 'white',
              border: '1px solid rgba(255,255,255,0.2)',
              borderRadius: '12px', padding: '14px 24px',
              fontSize: '15px', fontWeight: 600, textDecoration: 'none',
              display: 'inline-block',
            }}>
              Solicitar beca
            </Link>
          </div>
          <div style={{
            display: 'flex', justifyContent: 'center', gap: '40px',
            marginTop: '48px', paddingTop: '32px',
            borderTop: '1px solid rgba(255,255,255,0.08)',
          }}>
            {[
              { n: '6', l: 'semanas intensivas' },
              { n: '4–5', l: 'estudiantes por pod' },
              { n: '24/7', l: 'tutor IA (Próspero)' },
              { n: '100%', l: 'en línea, en español' },
            ].map(({ n, l }) => (
              <div key={l} style={{ textAlign: 'center' }}>
                <p style={{ fontWeight: 900, fontSize: '28px', color: '#00c896', margin: '0 0 2px' }}>{n}</p>
                <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.45)', margin: 0 }}>{l}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works — 6 weeks */}
      <section style={{ padding: '72px 5%', background: '#f5f4f0' }}>
        <div style={{ maxWidth: '860px', margin: '0 auto' }}>
          <p style={{ fontSize: '11px', fontWeight: 700, color: '#008ca5', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '10px' }}>El programa</p>
          <h2 style={{ fontWeight: 900, fontSize: '32px', marginBottom: '12px', lineHeight: 1.15 }}>6 semanas, 6 entregables</h2>
          <p style={{ fontSize: '15px', color: '#8a8884', lineHeight: 1.7, maxWidth: '540px', marginBottom: '36px' }}>
            Cada semana terminás algo concreto. No hay tareas para leer — hay cosas que construir, personas a quienes entrevistar, y productos que lanzar.
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {WEEKS.map(w => (
              <div key={w.n} style={{
                display: 'grid', gridTemplateColumns: '60px 1fr',
                gap: '16px', alignItems: 'start',
              }}>
                <div style={{ textAlign: 'right', paddingTop: '14px' }}>
                  <span style={{ fontWeight: 900, fontSize: '28px', color: '#ebebE4' }}>0{w.n}</span>
                </div>
                <div style={{
                  background: 'white', borderRadius: '14px',
                  padding: '16px 20px', border: '1px solid rgba(17,17,16,0.08)',
                }}>
                  <p style={{ fontSize: '10px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.07em', color: w.color, margin: '0 0 4px' }}>
                    {w.phase}
                  </p>
                  <p style={{ fontWeight: 800, fontSize: '15px', margin: '0 0 4px' }}>{w.title}</p>
                  <p style={{ fontSize: '13px', color: '#8a8884', margin: '0 0 8px' }}>Entregable: {w.deliverable}</p>
                  <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                    {w.tools.map(t => (
                      <span key={t} style={{
                        fontSize: '11px', fontWeight: 600, padding: '2px 9px',
                        borderRadius: '20px', background: 'white',
                        border: '1px solid rgba(17,17,16,0.08)', color: '#3a3936',
                      }}>{t}</span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section style={{ padding: '72px 5%', background: '#0E2A47' }}>
        <div style={{ maxWidth: '900px', margin: '0 auto' }}>
          <p style={{ fontSize: '11px', fontWeight: 700, color: '#00c896', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '10px' }}>Por qué Prospera</p>
          <h2 style={{ fontWeight: 900, fontSize: '32px', color: 'white', marginBottom: '12px', lineHeight: 1.15 }}>Todo lo que necesitás para llegar</h2>
          <p style={{ fontSize: '15px', color: 'rgba(255,255,255,0.5)', lineHeight: 1.7, maxWidth: '540px', marginBottom: '36px' }}>
            No es un curso de videos. Es un sistema completo — IA, comunidad, mentores, y entregables que importan.
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '14px' }}>
            {FEATURES.map(f => (
              <div key={f.title} style={{
                background: 'rgba(255,255,255,0.05)',
                border: '1px solid rgba(255,255,255,0.08)',
                borderRadius: '16px', padding: '22px',
              }}>
                <div style={{
                  width: '40px', height: '40px', borderRadius: '10px',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '20px', marginBottom: '14px',
                  background: 'rgba(255,255,255,0.06)',
                }}>
                  {f.icon}
                </div>
                <p style={{ fontWeight: 800, fontSize: '15px', color: 'white', marginBottom: '6px' }}>{f.title}</p>
                <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.5)', lineHeight: 1.65, margin: 0 }}>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Próspero section */}
      <section style={{ padding: '64px 5%', background: '#fce8f4' }}>
        <div style={{ maxWidth: '900px', margin: '0 auto', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '48px', alignItems: 'center' }}>
          <div>
            <p style={{ fontSize: '11px', fontWeight: 700, color: '#a5086b', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '10px' }}>Tutor IA</p>
            <h2 style={{ fontWeight: 900, fontSize: '30px', marginBottom: '14px', lineHeight: 1.2 }}>Conocé a Próspero</h2>
            <p style={{ fontSize: '15px', color: '#8a8884', lineHeight: 1.7, margin: 0 }}>
              Tu tutor IA personal — disponible a cualquier hora, habla con voseo latinoamericano, y usa el método socrático para guiarte sin darte las respuestas. Conecta cada conversación con tu entregable de la semana.
            </p>
          </div>
          <div style={{
            background: '#0E2A47', borderRadius: '18px', padding: '20px',
            boxShadow: '0 16px 48px rgba(14,42,71,0.2)',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px', paddingBottom: '14px', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
              <div style={{
                width: '36px', height: '36px', borderRadius: '50%',
                background: '#a5086b', display: 'flex', alignItems: 'center',
                justifyContent: 'center', fontSize: '17px', flexShrink: 0,
              }}>🌟</div>
              <div>
                <p style={{ fontWeight: 800, fontSize: '14px', color: 'white', margin: 0 }}>Próspero</p>
                <p style={{ fontSize: '11px', color: 'rgba(255,255,255,0.4)', margin: 0 }}>Tutor IA · Prospera Young AI</p>
              </div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <div style={{
                maxWidth: '85%', padding: '10px 13px', borderRadius: '4px 14px 14px 14px',
                background: 'rgba(255,255,255,0.07)', color: 'rgba(255,255,255,0.85)', fontSize: '13px', lineHeight: 1.5,
              }}>
                ¡Hola! Soy Próspero. ¿En qué parte de tu entregable de esta semana estás trabado/a?
              </div>
              <div style={{
                maxWidth: '85%', alignSelf: 'flex-end', padding: '10px 13px',
                borderRadius: '14px 4px 14px 14px',
                background: '#a5086b', color: 'white', fontSize: '13px', lineHeight: 1.5,
              }}>
                No sé cómo validar mi idea sin tener plata para publicidad
              </div>
              <div style={{
                maxWidth: '85%', padding: '10px 13px', borderRadius: '4px 14px 14px 14px',
                background: 'rgba(255,255,255,0.07)', color: 'rgba(255,255,255,0.85)', fontSize: '13px', lineHeight: 1.5,
              }}>
                Buena pregunta 🎯 ¿A cuántas personas hablaste esta semana sobre el problema que identificaste?
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA final */}
      <section style={{ padding: '80px 5%', background: '#00c896', textAlign: 'center' }}>
        <h2 style={{ fontWeight: 900, fontSize: '36px', color: '#0E2A47', marginBottom: '12px', lineHeight: 1.15 }}>
          Tu producto existe.<br />Solo falta construirlo.
        </h2>
        <p style={{ fontSize: '16px', color: 'rgba(14,42,71,0.7)', marginBottom: '32px', maxWidth: '480px', marginLeft: 'auto', marginRight: 'auto' }}>
          Inscripción abierta para LATAM y USA. Becas disponibles para quienes las necesiten.
        </p>
        <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link href="/apply" style={{
            background: '#0E2A47', color: 'white',
            borderRadius: '12px', padding: '14px 28px',
            fontSize: '15px', fontWeight: 800, textDecoration: 'none',
            display: 'inline-block',
          }}>
            Aplicar al programa
          </Link>
          <Link href="/scholarship" style={{
            background: 'transparent', color: '#0E2A47',
            border: '2px solid rgba(14,42,71,0.25)',
            borderRadius: '12px', padding: '14px 24px',
            fontSize: '15px', fontWeight: 700, textDecoration: 'none',
            display: 'inline-block',
          }}>
            Solicitar beca
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer style={{ background: '#0E2A47', padding: '32px 5%', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div style={{
            width: '26px', height: '26px', background: '#00c896',
            borderRadius: '6px', display: 'flex', alignItems: 'center',
            justifyContent: 'center', fontWeight: 900, fontSize: '12px', color: '#0E2A47',
          }}>P</div>
          <span style={{ fontWeight: 700, fontSize: '13px', color: 'rgba(255,255,255,0.5)' }}>Prospera Young AI</span>
        </div>
        <div style={{ display: 'flex', gap: '20px' }}>
          <Link href="/login" style={{ fontSize: '12px', color: 'rgba(255,255,255,0.4)', textDecoration: 'none' }}>Ingresar</Link>
          <Link href="/scholarship" style={{ fontSize: '12px', color: 'rgba(255,255,255,0.4)', textDecoration: 'none' }}>Becas</Link>
        </div>
        <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.25)', margin: 0 }}>© 2026 ProsperaIA LLC</p>
      </footer>

    </div>
  )
}
