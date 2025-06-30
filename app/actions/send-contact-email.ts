'use server'

import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function sendContactEmail({
  name,
  email,
  company,
  message,
}: {
  name: string
  email: string
  company?: string
  message: string
}) {
  try {
    await resend.emails.send({
      from: 'Contacto <onboarding@resend.dev>', // Dominio sandbox (solo para pruebas)
      to: 'montiveroaaron@gmail.com',
      subject: 'Nuevo mensaje de contacto',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <h2 style="color: #333; border-bottom: 2px solid #007bff; padding-bottom: 10px;">
            Nuevo Mensaje de Contacto
          </h2>
          <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <p style="margin: 10px 0;"><strong>👤 Nombre:</strong> ${name}</p>
            <p style="margin: 10px 0;"><strong>📧 Email:</strong> <a href="mailto:${email}">${email}</a></p>
            <p style="margin: 10px 0;"><strong>🏢 Empresa:</strong> ${company || 'No especificada'}</p>
          </div>
          <div style="margin-top: 20px;">
            <h3 style="color: #555;">💬 Mensaje:</h3>
            <div style="background: white; padding: 15px; border-left: 4px solid #007bff; border-radius: 4px;">
              ${message.replace(/\n/g, "<br>")}
            </div>
          </div>
          <hr style="margin: 30px 0; border: none; border-top: 1px solid #ddd;">
          <p style="color: #666; font-size: 12px; text-align: center;">
            Este email fue enviado desde el formulario de contacto de TalentoRH
          </p>
        </div>
      `,
    })

    return { success: true }
  } catch (error) {
    console.error('Error al enviar correo:', error)

    // Log detallado para debugging
    if (error instanceof Error) {
      console.error('Mensaje de error:', error.message)
    }

    return {
      success: false,
      error: 'Error al enviar el email. Por favor intenta nuevamente.'
    }
  }
}
