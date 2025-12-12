import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";
import { ThemeProvider } from "@/app/components/theme-provider";
import { ConditionalFooter } from "@/app/components/ConditionalFooter";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://talentopositivorh.com.ar"),
  title: {
    default: "TALENTO POSITIVO RH - Consultoría en Atracción & Selección de Capital Humano",
    template: "%s | TALENTO POSITIVO RH"
  },
  description: "Consultora especializada en atracción y selección de profesionales con foco en perfiles industriales. Conectamos talento calificado con empresas PYMES, nacionales y multinacionales. +15 años de experiencia en Capital Humano.",
  keywords: [
    "recursos humanos",
    "selección de personal",
    "perfiles industriales",
    "consultora rrhh",
    "búsqueda ejecutiva",
    "talento humano",
    "empleos industriales",
    "reclutamiento",
    "búsqueda de empleo",
    "capital humano",
    "María Florencia Luna",
    "headhunting",
    "empleo Argentina",
    "vacantes industriales",
    "selección estratégica"
  ],
  authors: [{ name: "María Florencia Luna", url: "https://talentopositivorh.com.ar" }],
  creator: "TALENTO POSITIVO RH",
  publisher: "TALENTO POSITIVO RH",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    type: "website",
    locale: "es_AR",
    url: "https://talentopositivorh.com.ar",
    siteName: "TALENTO POSITIVO RH",
    title: "TALENTO POSITIVO RH - Consultoría en Atracción & Selección de Capital Humano",
    description: "Consultora especializada en atracción y selección de profesionales con foco en perfiles industriales. Conectamos talento calificado con empresas.",
    images: [
      {
        url: "/logo_talento-Photoroom.png",
        width: 1200,
        height: 630,
        alt: "TALENTO POSITIVO RH - Consultora en Recursos Humanos",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "TALENTO POSITIVO RH - Consultora en Recursos Humanos",
    description: "Consultora especializada en selección de perfiles industriales. +15 años conectando talento con empresas.",
    images: ["/logo_talento-Photoroom.png"],
  },
  alternates: {
    canonical: "https://talentopositivorh.com.ar",
  },
  category: "business",
  classification: "Recursos Humanos",
  verification: {
    // Agregar cuando tengas los códigos de verificación
    // google: "código-de-google-search-console",
    // bing: "código-de-bing-webmaster-tools",
  },
  other: {
    "contact:phone_number": "+54 11 6589-9729",
    "contact:email": "rrhh@talentopositivorh.com",
    "contact:country_name": "Argentina",
    "contact:region": "Buenos Aires",
    "business:contact_data:locality": "Buenos Aires",
    "business:contact_data:country_name": "Argentina",
    "business:contact_data:phone_number": "+54 11 6589-9729",
    "business:contact_data:email": "rrhh@talentopositivorh.com",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" suppressHydrationWarning>
      <head>
        {/* Structured Data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              "name": "TALENTO POSITIVO RH",
              "description": "Consultora especializada en atracción y selección de profesionales con foco en perfiles industriales",
              "url": "https://talentopositivorh.com.ar",
              "logo": "https://talentopositivorh.com.ar/logo_talento-Photoroom.png",
              "contactPoint": {
                "@type": "ContactPoint",
                "telephone": "+54-11-6589-9729",
                "contactType": "customer service",
                "email": "rrhh@talentopositivorh.com",
                "areaServed": "AR",
                "availableLanguage": "Spanish"
              },
              "address": {
                "@type": "PostalAddress",
                "addressCountry": "AR",
                "addressRegion": "Buenos Aires"
              },
              "founder": {
                "@type": "Person",
                "name": "María Florencia Luna",
                "jobTitle": "Fundadora",
                "description": "Licenciada en Gestión de Capital Humano (Universidad de Belgrano), con más de 15 años de experiencia en empresas PYMES, nacionales y multinacionales"
              },
              "serviceType": [
                "Selección de Personal",
                "Recursos Humanos",
                "Headhunting",
                "Consultoría en Capital Humano",
                "Búsqueda Ejecutiva"
              ],
              "industry": "Recursos Humanos",
              "foundingDate": "2010",
              "knowsAbout": [
                "Selección de personal industrial",
                "Recursos humanos",
                "Gestión de talento",
                "Búsqueda ejecutiva",
                "Capital humano"
              ]
            })
          }}
        />

        {/* Additional meta tags */}
        <meta name="geo.region" content="AR-C" />
        <meta name="geo.placename" content="Buenos Aires" />
        <meta name="geo.position" content="-34.6037;-58.3816" />
        <meta name="ICBM" content="-34.6037, -58.3816" />
        <meta name="theme-color" content="#bd13ec" />
        <meta name="msapplication-TileColor" content="#bd13ec" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="TALENTO POSITIVO RH" />
        <meta name="format-detection" content="telephone=yes" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange
        >
          {children}
          <ConditionalFooter />
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
