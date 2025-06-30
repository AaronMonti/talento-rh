// app/empleos/layout.tsx
import { ReactNode } from "react";
import Header from "@/app/components/NavBars/header"
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Enviar CV - Únete a Nuestro Banco de Talentos",
    description: "Sube tu currículum vitae y forma parte de nuestro banco de talentos especializado en perfiles industriales. Conectamos profesionales con las mejores oportunidades laborales.",
    keywords: [
        "enviar cv",
        "subir curriculum",
        "banco de talentos",
        "busco trabajo",
        "cv online",
        "postulación empleo",
        "curriculum vitae",
        "talento industrial",
        "oportunidades laborales"
    ],
    openGraph: {
        title: "Enviar CV - Únete a Nuestro Banco de Talentos | TALENTO POSITIVO RH",
        description: "Sube tu currículum vitae y forma parte de nuestro banco de talentos especializado en perfiles industriales.",
        type: "website",
        url: "https://talentopositivorh.com.ar/cargar-cv",
    },
    alternates: {
        canonical: "https://talentopositivorh.com.ar/cargar-cv",
    },
};

export default function CargarCVLayout({ children }: { children: ReactNode }) {
    return (
        <div className="min-h-screen">
            <Header />
            <main className="relative top-25">{children}</main>
        </div>
    );
}