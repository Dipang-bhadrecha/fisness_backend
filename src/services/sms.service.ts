import axios from 'axios'

export async function sendOTPSms(
  phone: string,
  code: string
): Promise<void> {
  try {
    const response = await axios.post(
      'https://www.fast2sms.com/dev/bulkV2',
      {
        route: 'q',
        message: `${code} is your MatsyaKosh login OTP. Valid for 10 minutes. Do not share with anyone.`,
        language: 'english',
        numbers: phone,
      },
      {
        headers: {
          authorization: process.env.FAST2SMS_API_KEY,
          'Content-Type': 'application/json',
        },
      }
    )

    if (!response.data.return) {
      throw new Error(`Fast2SMS error: ${JSON.stringify(response.data)}`)
    }

    console.log(`📱 OTP sent to +91${phone}`)

  } catch (error: any) {
    console.error('SMS send failed:', error?.response?.data ?? error.message)
    throw new Error('Failed to send OTP SMS')
  }
}

export async function verifySmsService(): Promise<void> {
  if (!process.env.FAST2SMS_API_KEY) {
    throw new Error('FAST2SMS_API_KEY is not set in .env')
  }
  console.log('📱 SMS service ready')
}