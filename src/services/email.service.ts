import nodemailer from 'nodemailer'

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT),
  secure: false, 
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
})

export async function sendOTPEmail(
  email: string,
  name: string,
  code: string
): Promise<void> {
  await transporter.sendMail({
    from: process.env.SMTP_FROM,
    to: email,
    subject: 'Your MatsyaKosh OTP Code',
    html: `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Your MatsyaKosh Login Code</title>
</head>
<body style="
  margin: 0;
  padding: 0;
  background-color: #f4f4f5;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
">

  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f4f4f5; padding: 40px 0;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="max-width: 600px; width: 100%;">

          <!-- LOGO HEADER -->
          <tr>
            <td align="center" style="padding: 0 0 24px 0;">
              <table cellpadding="0" cellspacing="0">
                <tr>
                  <td style="
                    font-size: 13px;
                    font-weight: 700;
                    color: #0D4A35;
                    letter-spacing: 0.5px;
                  ">
                    🐟 MatsyaKosh
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- MAIN CARD -->
          <tr>
            <td style="
              background-color: #ffffff;
              border-radius: 12px;
              border: 1px solid #e4e4e7;
              overflow: hidden;
            ">

              <!-- GREEN TOP BAR -->
              <tr>
                <td style="
                  background-color: #0D4A35;
                  height: 4px;
                  font-size: 0;
                  line-height: 0;
                ">&nbsp;</td>
              </tr>

              <!-- BODY -->
              <tr>
                <td style="padding: 40px 48px 32px;">

                  <!-- HEADING -->
                  <p style="
                    margin: 0 0 8px 0;
                    font-size: 22px;
                    font-weight: 700;
                    color: #09090b;
                    letter-spacing: -0.3px;
                  ">Your login code</p>

                  <p style="
                    margin: 0 0 32px 0;
                    font-size: 15px;
                    color: #71717a;
                    line-height: 1.6;
                  ">
                    Hello ${name}, use the code below to sign in to your MatsyaKosh account.
                    This code expires in <span style="color: #09090b; font-weight: 600;">10 minutes</span>.
                  </p>

                  <!-- DIVIDER -->
                  <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom: 32px;">
                    <tr>
                      <td style="border-top: 1px solid #f4f4f5; font-size: 0; line-height: 0;">&nbsp;</td>
                    </tr>
                  </table>

                  <!-- OTP CODE BOX -->
                  <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom: 32px;">
                    <tr>
                      <td align="center">
                        <table cellpadding="0" cellspacing="0">
                          <tr>
                            <td style="
                              background-color: #f4f4f5;
                              border-radius: 8px;
                              padding: 20px 48px;
                              text-align: center;
                            ">
                              <p style="
                                margin: 0 0 4px 0;
                                font-size: 11px;
                                font-weight: 600;
                                color: #a1a1aa;
                                letter-spacing: 2px;
                                text-transform: uppercase;
                              ">Verification Code</p>
                              <p style="
                                margin: 0;
                                font-size: 42px;
                                font-weight: 800;
                                color: #09090b;
                                letter-spacing: 12px;
                                font-variant-numeric: tabular-nums;
                              ">${code}</p>
                            </td>
                          </tr>
                        </table>
                      </td>
                    </tr>
                  </table>

                  <!-- DIVIDER -->
                  <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom: 32px;">
                    <tr>
                      <td style="border-top: 1px solid #f4f4f5; font-size: 0; line-height: 0;">&nbsp;</td>
                    </tr>
                  </table>

                  <!-- SECURITY NOTE -->
                  <table width="100%" cellpadding="0" cellspacing="0">
                    <tr>
                      <td style="
                        background-color: #fafafa;
                        border-radius: 8px;
                        border: 1px solid #e4e4e7;
                        padding: 16px 20px;
                      ">
                        <p style="
                          margin: 0;
                          font-size: 13px;
                          color: #71717a;
                          line-height: 1.6;
                        ">
                          <span style="color: #09090b; font-weight: 600;">Didn't request this?</span>
                          &nbsp;If you didn't try to log in, you can safely ignore this email.
                          Someone may have entered your email by mistake.
                        </p>
                      </td>
                    </tr>
                  </table>

                </td>
              </tr>

            </td>
          </tr>

          <!-- FOOTER -->
          <tr>
            <td style="padding: 24px 0 0 0;">
              <table width="100%" cellpadding="0" cellspacing="0">

                <!-- FOOTER LINKS -->
                <tr>
                  <td align="center" style="padding-bottom: 12px;">
                    <a href="#" style="
                      font-size: 12px;
                      color: #a1a1aa;
                      text-decoration: none;
                      margin: 0 12px;
                    ">Help</a>
                    <span style="color: #e4e4e7;">|</span>
                    <a href="#" style="
                      font-size: 12px;
                      color: #a1a1aa;
                      text-decoration: none;
                      margin: 0 12px;
                    ">Privacy Policy</a>
                    <span style="color: #e4e4e7;">|</span>
                    <a href="#" style="
                      font-size: 12px;
                      color: #a1a1aa;
                      text-decoration: none;
                      margin: 0 12px;
                    ">Terms</a>
                  </td>
                </tr>

                <!-- COMPANY INFO -->
                <tr>
                  <td align="center">
                    <p style="
                      margin: 0;
                      font-size: 12px;
                      color: #a1a1aa;
                      line-height: 1.8;
                    ">
                      MatsyaKosh by Knowmadic<br>
                      Fishing Industry Management Platform<br>
                      <span style="color: #d4d4d8;">© 2026 Knowmadic. All rights reserved.</span>
                    </p>
                  </td>
                </tr>

              </table>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>

</body>
</html>
`,
  })
}

// Test connection on startup
export async function verifyEmailConnection(): Promise<void> {
  try {
    await transporter.verify()
    console.log('✉️  Email service ready')
  } catch (error) {
    console.error('❌ Email service failed:', error)
  }
}