import { NextResponse } from 'next/server'

const requiredEnvVars = [
  'POLAR_ACCESS_TOKEN',
  'POLAR_WEBHOOK_SECRET',
  'POLAR_ENV',
  'NEXT_PUBLIC_APP_URL',
  'POLAR_STANDARD_PLAN',
  'INNGEST_EVENT_KEY',
  'INNGEST_SIGNING_KEY',
  'INNGEST_DEV',
  'ANTHROPIC_API_KEY'
]

export async function GET() {
  const missingVars: string[] = []
  
  for (const varName of requiredEnvVars) {
    const value = process.env[varName]
    if (!value || value.trim() === '') {
      missingVars.push(varName)
    }
  }

  return NextResponse.json({
    isValid: missingVars.length === 0,
    missingVars
  })
}

