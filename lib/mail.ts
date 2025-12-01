import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export const sendVerificationEmail = async (email: string, token: string) => {
  const confirmLink = `${process.env.NEXTAUTH_URL}/verify?token=${token}`;

  await resend.emails.send({
    from: 'Orderform <onboarding@resend.dev>',
    to: email,
    subject: 'Verify your email address',
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Verify your email</title>
          <style>
            @import url('https://fonts.googleapis.com/css2?family=Instrument+Sans:wght@400;500;600&family=Instrument+Serif:ital@0;1&display=swap');

            body {
              font-family: 'Instrument Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
              background-color: #FDFBF9;
              margin: 0;
              padding: 0;
              -webkit-font-smoothing: antialiased;
            }
            .container {
              max-width: 600px;
              margin: 0 auto;
              padding: 60px 20px;
            }
            .card {
              background-color: #ffffff;
              border-radius: 24px;
              padding: 48px;
              box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
              text-align: center;
              border: 1px solid rgba(0, 0, 0, 0.09);
            }
            .logo {
              font-family: 'Instrument Serif', serif;
              font-size: 32px;
              font-weight: bold;
              color: #000000;
              margin-bottom: 40px;
              display: block;
              text-decoration: none;
              letter-spacing: -0.02em;
            }
            h1 {
              font-family: 'Instrument Serif', serif;
              color: #111827;
              font-size: 32px;
              font-weight: 400;
              margin: 0 0 24px;
              line-height: 1.2;
            }
            p {
              color: #4b5563;
              font-size: 16px;
              line-height: 28px;
              margin: 0 0 32px;
            }
            .button {
              display: inline-block;
              background-color: #000000;
              color: #ffffff;
              font-size: 16px;
              font-weight: 500;
              text-decoration: none;
              padding: 16px 40px;
              border-radius: 12px;
              transition: all 0.2s;
            }
            .button:hover {
              background-color: #1f2937;
              transform: translateY(-1px);
            }
            .footer {
              margin-top: 40px;
              text-align: center;
              color: #9ca3af;
              font-size: 14px;
            }
            .divider {
              height: 1px;
              background-color: #f3f4f6;
              margin: 40px 0;
            }
            .small-text {
              font-size: 14px;
              color: #6b7280;
              margin-top: 24px;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="card">
              <a href="${process.env.NEXTAUTH_URL}" class="logo">Orderform</a>
              <h1>Verify your email</h1>
              <p>
                Welcome to Orderform. To ensure the security of your account and access all features, please verify your email address by clicking the button below.
              </p>
              <a href="${confirmLink}" class="button">Verify Email Address</a>

              <div class="divider"></div>

              <p class="small-text">
                If you didn't create an account with Orderform, you can safely ignore this email.
                This link will expire in 24 hours.
              </p>
            </div>
            <div class="footer">
              <p>© ${new Date().getFullYear()} Orderform. All rights reserved.</p>
            </div>
          </div>
        </body>
      </html>
    `
  });
};
