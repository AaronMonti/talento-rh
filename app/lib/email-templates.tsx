import React from 'react'

export interface ContactEmailData {
    name: string
    email: string
    company?: string
    message: string
}

export function ContactEmailTemplate({ name, email, company, message }: ContactEmailData) {
    return (
        <div style={{
            fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
            maxWidth: '650px',
            margin: '0 auto',
            backgroundColor: '#ffffff',
            borderRadius: '16px',
            overflow: 'hidden',
            boxShadow: '0 20px 40px rgba(228, 79, 156, 0.15)'
        }}>
            {/* Header con gradiente */}
            <div style={{
                background: 'linear-gradient(135deg, #e44f9c 0%, #bd13ec 50%, #ff69b4 100%)',
                padding: '40px 30px',
                textAlign: 'center',
                position: 'relative'
            }}>
                <div style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    background: 'url("data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%23ffffff" fill-opacity="0.1"%3E%3Ccircle cx="30" cy="30" r="4"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")',
                    opacity: 0.3
                }} />

                <div style={{
                    position: 'relative',
                    zIndex: 1
                }}>
                    <h1 style={{
                        color: '#ffffff',
                        fontSize: '28px',
                        fontWeight: '700',
                        margin: '0 0 12px 0',
                        letterSpacing: '-0.5px'
                    }}>
                        💌 Nuevo Mensaje de Contacto
                    </h1>
                    <p style={{
                        color: 'rgba(255, 255, 255, 0.9)',
                        fontSize: '16px',
                        margin: '0',
                        fontWeight: '400'
                    }}>
                        Recibiste una nueva consulta desde TalentoRH
                    </p>
                </div>
            </div>

            {/* Información del contacto */}
            <div style={{
                padding: '40px 30px 30px 30px'
            }}>
                <div style={{
                    backgroundColor: '#fef7ff',
                    border: '2px solid #ff97d9',
                    borderRadius: '16px',
                    padding: '30px',
                    marginBottom: '30px',
                    position: 'relative'
                }}>
                    <div style={{
                        position: 'absolute',
                        top: '-2px',
                        right: '-2px',
                        width: '20px',
                        height: '20px',
                        backgroundColor: '#e44f9c',
                        borderRadius: '50%'
                    }} />

                    <h2 style={{
                        color: '#bd13ec',
                        fontSize: '20px',
                        fontWeight: '600',
                        margin: '0 0 20px 0',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px'
                    }}>
                        👤 Información del Contacto
                    </h2>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                        <div style={{
                            backgroundColor: '#ffffff',
                            padding: '16px 20px',
                            borderRadius: '12px',
                            border: '1px solid #ff97d9',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '12px'
                        }}>
                            <div style={{
                                width: '40px',
                                height: '40px',
                                backgroundColor: '#e44f9c',
                                borderRadius: '10px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontSize: '20px'
                            }}>
                                🎯
                            </div>
                            <div>
                                <p style={{
                                    margin: '0 0 4px 0',
                                    fontSize: '12px',
                                    textTransform: 'uppercase',
                                    letterSpacing: '0.5px',
                                    color: '#bd13ec',
                                    fontWeight: '600'
                                }}>
                                    NOMBRE COMPLETO
                                </p>
                                <p style={{
                                    margin: '0',
                                    fontSize: '16px',
                                    fontWeight: '600',
                                    color: '#2d1b69'
                                }}>
                                    {name}
                                </p>
                            </div>
                        </div>

                        <div style={{
                            backgroundColor: '#ffffff',
                            padding: '16px 20px',
                            borderRadius: '12px',
                            border: '1px solid #ff97d9',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '12px'
                        }}>
                            <div style={{
                                width: '40px',
                                height: '40px',
                                backgroundColor: '#ff69b4',
                                borderRadius: '10px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontSize: '20px'
                            }}>
                                📧
                            </div>
                            <div>
                                <p style={{
                                    margin: '0 0 4px 0',
                                    fontSize: '12px',
                                    textTransform: 'uppercase',
                                    letterSpacing: '0.5px',
                                    color: '#bd13ec',
                                    fontWeight: '600'
                                }}>
                                    EMAIL DE CONTACTO
                                </p>
                                <a href={`mailto:${email}`} style={{
                                    margin: '0',
                                    fontSize: '16px',
                                    fontWeight: '600',
                                    color: '#e44f9c',
                                    textDecoration: 'none'
                                }}>
                                    {email}
                                </a>
                            </div>
                        </div>

                        <div style={{
                            backgroundColor: '#ffffff',
                            padding: '16px 20px',
                            borderRadius: '12px',
                            border: '1px solid #ff97d9',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '12px'
                        }}>
                            <div style={{
                                width: '40px',
                                height: '40px',
                                backgroundColor: '#dd63ff',
                                borderRadius: '10px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontSize: '20px'
                            }}>
                                🏢
                            </div>
                            <div>
                                <p style={{
                                    margin: '0 0 4px 0',
                                    fontSize: '12px',
                                    textTransform: 'uppercase',
                                    letterSpacing: '0.5px',
                                    color: '#bd13ec',
                                    fontWeight: '600'
                                }}>
                                    EMPRESA
                                </p>
                                <p style={{
                                    margin: '0',
                                    fontSize: '16px',
                                    fontWeight: '600',
                                    color: '#2d1b69'
                                }}>
                                    {company || '🚫 No especificada'}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Mensaje */}
                <div style={{
                    backgroundColor: '#ffffff',
                    border: '2px solid #e44f9c',
                    borderRadius: '16px',
                    overflow: 'hidden'
                }}>
                    <div style={{
                        backgroundColor: '#e44f9c',
                        padding: '20px 25px',
                        borderBottom: '2px solid #bd13ec'
                    }}>
                        <h3 style={{
                            color: '#ffffff',
                            fontSize: '18px',
                            fontWeight: '600',
                            margin: '0',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px'
                        }}>
                            💬 Mensaje Completo
                        </h3>
                    </div>

                    <div style={{
                        padding: '25px',
                        backgroundColor: '#fef7ff'
                    }}>
                        <div style={{
                            backgroundColor: '#ffffff',
                            padding: '20px',
                            borderRadius: '12px',
                            border: '1px solid #ff97d9',
                            fontSize: '16px',
                            lineHeight: '1.6',
                            color: '#2d1b69'
                        }}>
                            {message.split('\n').map((line, index) => (
                                <React.Fragment key={index}>
                                    {line}
                                    {index < message.split('\n').length - 1 && <br />}
                                </React.Fragment>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Footer */}
            <div style={{
                background: 'linear-gradient(135deg, #2d1b69 0%, #bd13ec 100%)',
                padding: '30px',
                textAlign: 'center',
                borderTop: '4px solid #e44f9c'
            }}>
                <div style={{
                    backgroundColor: 'rgba(255, 255, 255, 0.1)',
                    borderRadius: '12px',
                    padding: '20px',
                    backdropFilter: 'blur(10px)'
                }}>
                    <h4 style={{
                        color: '#ffffff',
                        fontSize: '16px',
                        fontWeight: '600',
                        margin: '0 0 8px 0'
                    }}>
                        🎯 TalentoRH - Sistema de Contacto
                    </h4>
                    <p style={{
                        color: 'rgba(255, 255, 255, 0.8)',
                        fontSize: '14px',
                        margin: '0',
                        fontWeight: '400'
                    }}>
                        Este email fue generado automáticamente desde el formulario de contacto
                    </p>
                    <div style={{
                        marginTop: '15px',
                        paddingTop: '15px',
                        borderTop: '1px solid rgba(255, 255, 255, 0.2)'
                    }}>
                        <p style={{
                            color: 'rgba(255, 255, 255, 0.6)',
                            fontSize: '12px',
                            margin: '0'
                        }}>
                            💼 Potenciando el talento humano de las empresas
                        </p>
                    </div>
                </div>
            </div>
        </div>
    )
}

// Función helper para renderizar el componente a string (si necesitas compatibilidad con sistemas de email)
export function generateContactEmailTemplate(data: ContactEmailData): string {
    const { name, email, company, message } = data

    return `
    <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; max-width: 650px; margin: 0 auto; background-color: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 20px 40px rgba(228, 79, 156, 0.15);">
      <div style="background: linear-gradient(135deg, #e44f9c 0%, #bd13ec 50%, #ff69b4 100%); padding: 40px 30px; text-align: center; position: relative;">
        <div style="position: absolute; top: 0; left: 0; right: 0; bottom: 0; background: url('data:image/svg+xml,%3Csvg width=&quot;60&quot; height=&quot;60&quot; viewBox=&quot;0 0 60 60&quot; xmlns=&quot;http://www.w3.org/2000/svg&quot;%3E%3Cg fill=&quot;none&quot; fill-rule=&quot;evenodd&quot;%3E%3Cg fill=&quot;%23ffffff&quot; fill-opacity=&quot;0.1&quot;%3E%3Ccircle cx=&quot;30&quot; cy=&quot;30&quot; r=&quot;4&quot;/%3E%3C/g%3E%3C/g%3E%3C/svg%3E'); opacity: 0.3;"></div>
        <div style="position: relative; z-index: 1;">
          <h1 style="color: #ffffff; font-size: 28px; font-weight: 700; margin: 0 0 12px 0; letter-spacing: -0.5px;">💌 Nuevo Mensaje de Contacto</h1>
          <p style="color: rgba(255, 255, 255, 0.9); font-size: 16px; margin: 0; font-weight: 400;">Recibiste una nueva consulta desde TalentoRH</p>
        </div>
      </div>
      
      <div style="padding: 40px 30px 30px 30px;">
        <div style="background-color: #fef7ff; border: 2px solid #ff97d9; border-radius: 16px; padding: 30px; margin-bottom: 30px; position: relative;">
          <div style="position: absolute; top: -2px; right: -2px; width: 20px; height: 20px; background-color: #e44f9c; border-radius: 50%;"></div>
          <h2 style="color: #bd13ec; font-size: 20px; font-weight: 600; margin: 0 0 20px 0;">👤 Información del Contacto</h2>
          
          <div style="background-color: #ffffff; padding: 16px 20px; border-radius: 12px; border: 1px solid #ff97d9; margin-bottom: 16px;">
            <p style="margin: 0 0 4px 0; font-size: 12px; text-transform: uppercase; letter-spacing: 0.5px; color: #bd13ec; font-weight: 600;">NOMBRE COMPLETO</p>
            <p style="margin: 0; font-size: 16px; font-weight: 600; color: #2d1b69;">${name}</p>
          </div>
          
          <div style="background-color: #ffffff; padding: 16px 20px; border-radius: 12px; border: 1px solid #ff97d9; margin-bottom: 16px;">
            <p style="margin: 0 0 4px 0; font-size: 12px; text-transform: uppercase; letter-spacing: 0.5px; color: #bd13ec; font-weight: 600;">EMAIL DE CONTACTO</p>
            <a href="mailto:${email}" style="margin: 0; font-size: 16px; font-weight: 600; color: #e44f9c; text-decoration: none;">${email}</a>
          </div>
          
          <div style="background-color: #ffffff; padding: 16px 20px; border-radius: 12px; border: 1px solid #ff97d9;">
            <p style="margin: 0 0 4px 0; font-size: 12px; text-transform: uppercase; letter-spacing: 0.5px; color: #bd13ec; font-weight: 600;">EMPRESA</p>
            <p style="margin: 0; font-size: 16px; font-weight: 600; color: #2d1b69;">${company || '🚫 No especificada'}</p>
          </div>
        </div>
        
        <div style="background-color: #ffffff; border: 2px solid #e44f9c; border-radius: 16px; overflow: hidden;">
          <div style="background-color: #e44f9c; padding: 20px 25px; border-bottom: 2px solid #bd13ec;">
            <h3 style="color: #ffffff; font-size: 18px; font-weight: 600; margin: 0;">💬 Mensaje Completo</h3>
          </div>
          <div style="padding: 25px; background-color: #fef7ff;">
            <div style="background-color: #ffffff; padding: 20px; border-radius: 12px; border: 1px solid #ff97d9; font-size: 16px; line-height: 1.6; color: #2d1b69;">
              ${message.replace(/\n/g, "<br>")}
            </div>
          </div>
        </div>
      </div>
      
      <div style="background: linear-gradient(135deg, #2d1b69 0%, #bd13ec 100%); padding: 30px; text-align: center; border-top: 4px solid #e44f9c;">
        <div style="background-color: rgba(255, 255, 255, 0.1); border-radius: 12px; padding: 20px;">
          <h4 style="color: #ffffff; font-size: 16px; font-weight: 600; margin: 0 0 8px 0;">🎯 TalentoRH - Sistema de Contacto</h4>
          <p style="color: rgba(255, 255, 255, 0.8); font-size: 14px; margin: 0; font-weight: 400;">Este email fue generado automáticamente desde el formulario de contacto</p>
          <div style="margin-top: 15px; padding-top: 15px; border-top: 1px solid rgba(255, 255, 255, 0.2);">
            <p style="color: rgba(255, 255, 255, 0.6); font-size: 12px; margin: 0;">💼 Potenciando el talento humano de las empresas</p>
          </div>
        </div>
      </div>
    </div>
  `
} 