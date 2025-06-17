import { MetadataRoute } from 'next'
import { getTrabajosActivos } from './actions/getTrabajos'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const baseUrl = 'https://talentopositivorh.com'

    // Obtener trabajos activos para incluirlos en el sitemap
    const trabajos = await getTrabajosActivos() || []

    // URLs estáticas
    const staticUrls = [
        {
            url: baseUrl,
            lastModified: new Date(),
            changeFrequency: 'weekly' as const,
            priority: 1,
        },
        {
            url: `${baseUrl}/empleos`,
            lastModified: new Date(),
            changeFrequency: 'daily' as const,
            priority: 0.9,
        },
        {
            url: `${baseUrl}/cargar-cv`,
            lastModified: new Date(),
            changeFrequency: 'monthly' as const,
            priority: 0.8,
        },
    ]

    // URLs dinámicas de trabajos
    const trabajosUrls = trabajos.map((trabajo) => ({
        url: `${baseUrl}/empleos/${trabajo.id}`,
        lastModified: new Date(trabajo.fecha_publicacion),
        changeFrequency: 'weekly' as const,
        priority: 0.7,
    }))

    return [...staticUrls, ...trabajosUrls]
} 