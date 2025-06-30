'use server'

import { Resend } from 'resend'
import { generateContactEmailTemplate, type ContactEmailData } from '../lib/email-templates'

const resend = new Resend(process.env.NEXT_PUBLIC_RESEND_API_KEY)

export async function sendContactEmail({
  name,
  email,
  company,
  message,
}: ContactEmailData) {
  try {
    const emailHtml = generateContactEmailTemplate({ name, email, company, message })

    await resend.emails.send({
      from: 'Contacto <onboarding@resend.dev>', // Dominio sandbox (solo para pruebas)
      to: 'rrhh@talentopositivorh.com',
      subject: 'Nuevo mensaje de contacto',
      html: emailHtml,
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
