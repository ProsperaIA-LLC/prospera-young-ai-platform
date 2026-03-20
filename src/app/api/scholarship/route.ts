import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function POST(req: NextRequest) {
  let body: {
    applicant_name?: string
    applicant_email?: string
    applicant_age?: number
    applicant_country?: string
    motivation_letter?: string
    video_url?: string
    reference_contact?: string
  }

  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'Cuerpo de solicitud inválido' }, { status: 400 })
  }

  const {
    applicant_name,
    applicant_email,
    applicant_age,
    applicant_country,
    motivation_letter,
    video_url,
    reference_contact,
  } = body

  // Validation
  if (!applicant_name?.trim()) {
    return NextResponse.json({ error: 'El nombre es requerido' }, { status: 400 })
  }
  if (!applicant_email?.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(applicant_email)) {
    return NextResponse.json({ error: 'Email inválido' }, { status: 400 })
  }
  if (!applicant_age || applicant_age < 10 || applicant_age > 25) {
    return NextResponse.json({ error: 'La edad debe estar entre 10 y 25 años' }, { status: 400 })
  }
  if (!applicant_country?.trim()) {
    return NextResponse.json({ error: 'El país es requerido' }, { status: 400 })
  }
  if (!motivation_letter?.trim()) {
    return NextResponse.json({ error: 'La carta de motivación es requerida' }, { status: 400 })
  }

  const wordCount = motivation_letter.trim().split(/\s+/).filter(Boolean).length
  if (wordCount < 200) {
    return NextResponse.json(
      { error: `La carta de motivación debe tener al menos 200 palabras (tiene ${wordCount})` },
      { status: 400 }
    )
  }

  // Use server client — anon key is enough (INSERT policy allows anon)
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('scholarship_applications')
    .insert({
      applicant_name:   applicant_name.trim(),
      applicant_email:  applicant_email.trim().toLowerCase(),
      applicant_age,
      applicant_country: applicant_country.trim(),
      motivation_letter: motivation_letter.trim(),
      video_url:         video_url?.trim() || null,
      reference_contact: reference_contact?.trim() || null,
      status:            'pending',
    })
    .select('id, created_at')
    .single()

  if (error) {
    console.error('scholarship insert error:', error)
    return NextResponse.json({ error: 'Error guardando la solicitud. Intentá de nuevo.' }, { status: 500 })
  }

  return NextResponse.json({ id: data.id, createdAt: data.created_at }, { status: 201 })
}
