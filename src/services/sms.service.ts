import twilio from 'twilio'

const client = () => twilio(
  process.env.TWILIO_ACCOUNT_SID!,
  process.env.TWILIO_AUTH_TOKEN!
)

const SID = process.env.TWILIO_VERIFY_SERVICE_SID!

// Called in requestOTP — sends OTP via Twilio
export async function sendOTPSms(phone: string): Promise<void> {
  const to = phone.startsWith('+') ? phone : `+91${phone}`
  await client().verify.v2.services(SID).verifications.create({
    to,
    channel: 'sms',
  })
  console.log(`📱 OTP sent via Twilio to ${to}`)
}

// Called in verifyOTP — checks code with Twilio
export async function verifyOTPSms(phone: string, code: string): Promise<boolean> {
  const to = phone.startsWith('+') ? phone : `+91${phone}`
  const result = await client().verify.v2.services(SID).verificationChecks.create({ to, code })
  return result.status === 'approved'
}

export async function verifySmsService(): Promise<void> {
  const { TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, TWILIO_VERIFY_SERVICE_SID } = process.env
  if (!TWILIO_ACCOUNT_SID || !TWILIO_AUTH_TOKEN || !TWILIO_VERIFY_SERVICE_SID) {
    throw new Error('Missing Twilio env vars')
  }
  console.log('📱 Twilio Verify SMS service ready')
}