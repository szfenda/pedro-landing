import nodemailer from 'nodemailer'

interface ContactFormData {
  name: string
  email: string
  message: string
}

export const sendContactEmail = async (data: ContactFormData) => {
  // Konfiguracja SMTP dla GoDaddy
  const transporter = nodemailer.createTransport({
    host: 'smtpout.secureserver.net',
    port: 587,
    secure: false, // STARTTLS
    auth: {
      user: process.env.SMTP_USER || 'kontakt@pedro.app',
      pass: process.env.SMTP_PASS,
    },
  })

  const mailOptions = {
    from: 'kontakt@pedro.app',
    to: process.env.SMTP_TO || 'kontakt@pedro.app',
    subject: `Nowa wiadomość z PEDRO.app od ${data.name}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #6C5CE7; border-bottom: 3px solid #2D3436; padding-bottom: 10px;">
          Nowa wiadomość kontaktowa - PEDRO.app
        </h2>
        <div style="background: #F7F9FC; padding: 20px; border: 3px solid #2D3436; border-radius: 16px; margin: 20px 0;">
          <p><strong style="color: #2D3436;">Imię:</strong> ${data.name}</p>
          <p><strong style="color: #2D3436;">Email:</strong> ${data.email}</p>
          <p><strong style="color: #2D3436;">Wiadomość:</strong></p>
          <div style="background: white; padding: 15px; border: 2px solid #2D3436; border-radius: 12px; margin-top: 10px;">
            ${data.message.replace(/\n/g, '<br>')}
          </div>
        </div>
        <p style="color: #666; font-size: 12px; text-align: center;">
          Wiadomość wysłana automatycznie z formularza kontaktowego PEDRO.app
        </p>
      </div>
    `,
    text: `
Nowa wiadomość kontaktowa - PEDRO.app

Imię: ${data.name}
Email: ${data.email}

Wiadomość:
${data.message}

---
Wiadomość wysłana automatycznie z formularza kontaktowego PEDRO.app
    `
  }

  return await transporter.sendMail(mailOptions)
}