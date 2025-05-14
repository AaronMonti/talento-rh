'use server'

import { Resend } from 'resend'

const resend = new Resend(process.env.NEXT_PUBLIC_RESEND_API_KEY)

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
      from: 'Contacto <onboarding@resend.dev>',
      to: email,
      subject: 'Nuevo mensaje de contacto',
      html: `
        <p><strong>Nombre:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Empresa:</strong> ${company || '-'}</p>
        <p><strong>Mensaje:</strong></p>
        <p>${message.replace(/\n/g, "<br>")}</p>
      `,
    })

    return { success: true }
  } catch (error) {
    console.error('Error al enviar correo:', error)
    return { success: false }
  }
}
