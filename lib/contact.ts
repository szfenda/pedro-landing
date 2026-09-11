import { Resend } from 'resend'
import { logger } from './logger'

export interface ContactFormData {
  name: string
  email: string
  message: string
}

export const sendContactEmail = async (data: ContactFormData) => {
  const apiKey = process.env.RESEND_API_KEY

  if (!apiKey) {
    const errorMsg = 'RESEND_API_KEY is not configured in environment variables'
    logger.error('Resend configuration error', new Error(errorMsg))
    throw new Error(errorMsg)
  }

  const resend = new Resend(apiKey)

  try {
    const subject = `Nowa wiadomość z PEDRO.app od ${data.name}`
    const htmlContent = `
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
          <div style="background: white; padding: 20px; border-left: 4px solid #6C5CE7; margin: 20px 0; white-space: pre-wrap;">
            ${data.message.replace(/\n/g, '<br>')}
          </div>
          
          <hr style="border: none; border-top: 1px solid #ddd; margin: 30px 0;">
          <p style="color: #666; font-size: 12px;">
            Wiadomość wysłana automatycznie z formularza kontaktowego PEDRO.app<br>
            Timestamp: ${new Date().toISOString()}
          </p>
        </div>
      </div>
    `

    const textContent = `
Nowa wiadomość kontaktowa - PEDRO.app

Imię: ${data.name}
Email: ${data.email}

Wiadomość:
${data.message}

---
Wiadomość wysłana automatycznie z formularza kontaktowego PEDRO.app
Timestamp: ${new Date().toISOString()}
    `.trim()

    const { data: responseData, error: sendError } = await resend.emails.send({
      from: 'Kontakt Pedro <kontakt@pedro.app>',
      to: 'kontakt@pedro.app',
      replyTo: data.email,
      subject,
      html: htmlContent,
      text: textContent,
    })

    if (sendError) {
      logger.error('Resend API returned an error', new Error(sendError.message), {
        recipient: 'kontakt@pedro.app',
        sender: data.email,
        resendError: sendError,
      })
      throw new Error(`Resend error: ${sendError.message}`)
    }

    logger.info('Email sent successfully via Resend', {
      messageId: responseData?.id,
      sender: data.email,
      to: 'kontakt@pedro.app',
    })

    return responseData
  } catch (error) {
    logger.error('Failed to send email via Resend', error as Error, {
      sender: data.email,
      to: 'kontakt@pedro.app',
    })
    throw error
  }
}