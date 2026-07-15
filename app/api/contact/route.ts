import { NextRequest, NextResponse } from 'next/server'

const RATE_LIMIT = new Map<string, { count: number; resetAt: number }>()
const MAX_REQUESTS = 5
const WINDOW_MS = 60 * 60 * 1000

function isRateLimited(ip: string): boolean {
  const now = Date.now()
  const entry = RATE_LIMIT.get(ip)

  if (!entry || now > entry.resetAt) {
    RATE_LIMIT.set(ip, { count: 1, resetAt: now + WINDOW_MS })
    return false
  }

  if (entry.count >= MAX_REQUESTS) return true
  entry.count++
  return false
}

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

export async function POST(request: NextRequest) {
  try {
    const ip = request.headers.get('x-forwarded-for')?.split(',')[0] ?? 'unknown'

    if (isRateLimited(ip)) {
      return NextResponse.json(
        { error: 'Too many requests. Please try again later.' },
        { status: 429 }
      )
    }

    const body = await request.json()
    const { name, email, subject, message, honeypot } = body

    if (honeypot) {
      return NextResponse.json({ success: true })
    }

    if (!name?.trim() || !email?.trim() || !subject?.trim() || !message?.trim()) {
      return NextResponse.json({ error: 'All fields are required.' }, { status: 400 })
    }

    if (!isValidEmail(email)) {
      return NextResponse.json({ error: 'Invalid email address.' }, { status: 400 })
    }

    if (message.length > 5000) {
      return NextResponse.json({ error: 'Message is too long.' }, { status: 400 })
    }

    // Log submission (replace with email service integration in production)
    console.log('[Contact Form]', {
      name: name.trim(),
      email: email.trim(),
      subject: subject.trim(),
      message: message.trim(),
      timestamp: new Date().toISOString(),
    })

    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ error: 'Failed to process request.' }, { status: 500 })
  }
}
