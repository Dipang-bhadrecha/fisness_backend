import twilio from 'twilio'

const client = () => twilio(
  process.env.TWILIO_ACCOUNT_SID!,
  process.env.TWILIO_AUTH_TOKEN!
)

const SID = process.env.TWILIO_VERIFY_SERVICE_SID!

// Normalize Indian phone to E.164: digits only, then +91 + last 10 digits
function normalizePhone(phone: string): string {
  const digits = phone.replace(/\D/g, '')
  const ten = digits.length >= 10 ? digits.slice(-10) : digits
  return `+91${ten}`
}

// Called in requestOTP — sends OTP via Twilio
export async function sendOTPSms(phone: string): Promise<void> {
  const to = normalizePhone(phone)
  await client().verify.v2.services(SID).verifications.create({
    to,
    channel: 'sms',
  })
  console.log(`📱 OTP sent via Twilio to ${to}`)
}

// Called in verifyOTP — checks code with Twilio
export async function verifyOTPSms(phone: string, code: string): Promise<boolean> {
  const to = normalizePhone(phone)
  const codeTrimmed = String(code).trim().replace(/\s/g, '')

  // Dev bypass: accept test OTP 123456 for any phone when not in production
  if (process.env.NODE_ENV !== 'production' && codeTrimmed === '123456') {
    console.log(`🔓 Dev bypass: accepting test OTP for ${to}`)
    return true
  }

  try {
    const result = await client().verify.v2.services(SID).verificationChecks.create({
      to,
      code: codeTrimmed,
    })
    console.log(`📱 Twilio verify result for ${to}: status=${result.status}`)
    return result.status === 'approved'
  } catch (err: any) {
    console.log(`📱 Twilio verify error for ${to}:`, err?.code ?? err?.status, err?.message)
    // Twilio returns 404 when code is invalid/expired — treat as verification failed
    if (err?.code === 404 || err?.status === 404) return false
    throw err
  }
}

export async function verifySmsService(): Promise<void> {
  const { TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, TWILIO_VERIFY_SERVICE_SID } = process.env
  if (!TWILIO_ACCOUNT_SID || !TWILIO_AUTH_TOKEN || !TWILIO_VERIFY_SERVICE_SID) {
    throw new Error('Missing Twilio env vars')
  }
  console.log('📱 Twilio Verify SMS service ready')
}