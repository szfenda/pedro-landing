import nodemailer from 'nodemailer'
import { logger } from './logger'

interface ContactFormData {
  name: string
  email: string
  message: string
}

export const sendContactEmail = async (data: ContactFormData) => {
  try {
    // Konfiguracja SMTP dla GoDaddy z timeouts
    const transporter = nodemailer.createTransport({
      host: 'smtpout.secureserver.net',
      port: 587,
      secure: false, // STARTTLS
      connectionTimeout: 10000, // 10 seconds
      greetingTimeout: 5000,    // 5 seconds
      socketTimeout: 10000,     // 10 seconds
      auth: {
        user: process.env.SMTP_USER || 'kontakt@pedro.app',
        pass: process.env.SMTP_PASS,
      },
    })

    // Verify SMTP connection
    await transporter.verify()
    logger.info('SMTP connection verified successfully')

    const mailOptions = {
      from: process.env.SMTP_USER || 'kontakt@pedro.app',
      to: process.env.SMTP_TO || 'kontakt@pedro.app',
      subject: `Nowa wiadomość z PEDRO.app od ${data.name}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: #6C5CE7; color: white; padding: 20px; text-align: center;">
            <h1 style="margin: 0; font-size: 24px;">PEDRO.app</h1>
            <p style="margin: 5px 0 0 0;">Nowa wiadomość kontaktowa</p>
          </div>
          
          <div style="padding: 30px; background: #f9f9f9;">
            <h2 style="color: #2D3436; margin-top: 0;">Dane kontaktowe:</h2>
            <p><strong>Imię:</strong> ${data.name}</p>
            <p><strong>Email:</strong> ${data.email}</p>
            
            <h2 style="color: #2D3436;">Wiadomość:</h2>
            <div style="background: white; padding: 20px; border-left: 4px solid #6C5CE7; margin: 20px 0;">
              ${data.message.replace(/\n/g, '<br>')}
            </div>
            
            <hr style="border: none; border-top: 1px solid #ddd; margin: 30px 0;">
            <p style="color: #666; font-size: 12px;">
              Wiadomość wysłana automatycznie z formularza kontaktowego PEDRO.app<br>
              Timestamp: ${new Date().toISOString()}
            </p>
          </div>
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
Timestamp: ${new Date().toISOString()}
      `
    }

    const result = await transporter.sendMail(mailOptions)
    
    logger.info('Email sent successfully', {
      messageId: result.messageId,
      recipient: data.email,
      accepted: result.accepted,
      rejected: result.rejected
    })

    return result
  } catch (error) {
    logger.error('Failed to send email', error as Error, {
      recipient: data.email,
      smtpUser: process.env.SMTP_USER
    })
    throw error
  }
}