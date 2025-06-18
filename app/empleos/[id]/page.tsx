import { supabase } from "@/app/lib/supabase";
import { notFound } from "next/navigation";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
    Building,
    MapPin,
    Euro,
    GraduationCap,
    Clock,
    ArrowLeft,
} from "lucide-react";
import PostulacionForm from "@/app/components/PostulationForm";
import { Button } from "@/components/ui/button";
import { Metadata } from "next";

// Función para generar metadata dinámica
export async function generateMetadata({
    params,
}: {
    params: Promise<{ id: string }>;
}): Promise<Metadata> {
    const { id } = await params;

    const { data: trabajo } = await supabase
        .from("trabajos")
        .select("*")
        .eq("id", id)
        .single();

    if (!trabajo) {
        return {
            title: "Empleo no encontrado | Talento Positivo RH",
            description: "La oferta de empleo que buscas no está disponible.",
        };
    }

    const descripcionCorta = trabajo.descripcion
        ? trabajo.descripcion.slice(0, 150) + "..."
        : "Detalles de la oferta de empleo";

    return {
        title: `${trabajo.titulo_vacante} en ${trabajo.empresa} - ${trabajo.ubicacion || "Argentina"}`,
        description: `${descripcionCorta} Modalidad: ${trabajo.modalidad}. ${trabajo.rango_salarial ? `Salario: ${trabajo.rango_salarial}.` : ""} Aplica ahora en Talento Positivo RH.`,
        keywords: [
            trabajo.titulo_vacante,
            trabajo.empresa,
            trabajo.ubicacion || "Argentina",
            trabajo.modalidad,
            trabajo.rubro || "industrial",
            "empleo",
            "trabajo",
            "vacante",
            "oportunidad laboral"
        ],
        openGraph: {
            title: `${trabajo.titulo_vacante} en ${trabajo.empresa}`,
            description: descripcionCorta,
            type: "website",
            url: `https://talentopositivorh.com/empleos/${id}`,
            siteName: "Talento Positivo RH",
        },
        twitter: {
            card: "summary",
            title: `${trabajo.titulo_vacante} en ${trabajo.empresa}`,
            description: descripcionCorta,
        },
        alternates: {
            canonical: `https://talentopositivorh.com/empleos/${id}`,
        },
        other: {
            "job:company": trabajo.empresa,
            "job:location": trabajo.ubicacion || "",
            "job:type": trabajo.modalidad,
            "job:salary": trabajo.rango_salarial || "",
            "job:posted_date": trabajo.fecha_publicacion,
        },
    };
}

export default async function TrabajoDetallePage({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const { id } = await params;

    const { data, error } = await supabase
        .from("trabajos")
        .select("*")
        .eq("id", id)
        .single();

    if (error || !data) return notFound();

    const trabajo = data;
    const formatoFecha = format(
        new Date(trabajo.fecha_publicacion),
        "d 'de' MMMM yyyy",
        {
            locale: es,
        }
    );

    return (
        <>
            {/* Structured Data para ofertas de empleo */}
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                    __html: JSON.stringify({
                        "@context": "https://schema.org",
                        "@type": "JobPosting",
                        "title": trabajo.titulo_vacante,
                        "description": trabajo.descripcion,
                        "identifier": {
                            "@type": "PropertyValue",
                            "name": "Talento Positivo RH",
                            "value": trabajo.id
                        },
                        "datePosted": trabajo.fecha_publicacion,
                        "employmentType": trabajo.modalidad === "Presencial" ? "FULL_TIME" :
                            trabajo.modalidad === "Remoto" ? "FULL_TIME" : "OTHER",
                        "hiringOrganization": {
                            "@type": "Organization",
                            "name": trabajo.empresa,
                        },
                        "jobLocation": {
                            "@type": "Place",
                            "address": {
                                "@type": "PostalAddress",
                                "addressLocality": trabajo.ubicacion,
                                "addressCountry": "AR"
                            }
                        },
                        "baseSalary": trabajo.rango_salarial ? {
                            "@type": "MonetaryAmount",
                            "currency": "ARS",
                            "value": {
                                "@type": "QuantitativeValue",
                                "value": trabajo.rango_salarial,
                                "unitText": "MONTH"
                            }
                        } : undefined,
                        "qualifications": trabajo.formacion,
                        "skills": trabajo.conocimientos_tecnicos,
                        "industry": trabajo.rubro || "Industrial",
                        "workHours": trabajo.jornada_laboral,
                        "applicantLocationRequirements": {
                            "@type": "Country",
                            "name": "Argentina"
                        }
                    })
                }}
            />

            <div className="max-w-3xl mx-auto p-6 space-y-6 pb-20">
                <Button asChild variant="link">
                    <Link
                        href="/empleos"
                    >
                        <ArrowLeft className="mr-1 h-4 w-4" />
                        Volver al listado de empleos
                    </Link>
                </Button>

                <Card className="bg-fuchsia-50">
                    <CardContent className="p-6 space-y-6">
                        <header className="flex justify-between items-start">
                            <div>
                                <h1 className="text-2xl font-bold text-gray-900">
                                    {trabajo.titulo_vacante}
                                </h1>
                                <div className="flex items-center text-gray-600 mt-1">
                                    <Building size={16} className="mr-1" />
                                    {trabajo.empresa}
                                </div>
                                <div className="text-gray-500 mt-1">
                                    Publicado el {formatoFecha}
                                </div>
                            </div>
                            <Badge variant="outline">{trabajo.modalidad}</Badge>
                        </header>

                        <section className="space-y-2 text-gray-700">
                            <h2 className="font-semibold text-gray-800">Información general</h2>
                            {trabajo.ubicacion && (
                                <div className="flex items-center">
                                    <MapPin size={16} className="mr-2" />
                                    <span>{trabajo.ubicacion}</span>
                                </div>
                            )}
                            {trabajo.rango_salarial && (
                                <div className="flex items-center">
                                    <Euro size={16} className="mr-2" />
                                    <span>{trabajo.rango_salarial}</span>
                                </div>
                            )}
                            {trabajo.formacion && (
                                <div className="flex items-center">
                                    <GraduationCap size={16} className="mr-2" />
                                    <span>{trabajo.formacion}</span>
                                </div>
                            )}
                            {trabajo.jornada_laboral && (
                                <div className="flex items-center">
                                    <Clock size={16} className="mr-2" />
                                    <span>{trabajo.jornada_laboral}</span>
                                </div>
                            )}
                            {trabajo.rubro && (
                                <div>
                                    <strong>Rubro:</strong> {trabajo.rubro}
                                </div>
                            )}
                        </section>

                        {trabajo.conocimientos_tecnicos && (
                            <section className="text-gray-700">
                                <h2 className="font-semibold text-gray-800 mb-1">
                                    Conocimientos técnicos
                                </h2>
                                <p>{trabajo.conocimientos_tecnicos}</p>
                            </section>
                        )}

                        <section className="text-gray-800">
                            <h2 className="font-semibold text-gray-800 mb-1">Descripción</h2>
                            <p className="leading-relaxed whitespace-pre-line">
                                {trabajo.descripcion}
                            </p>
                        </section>

                        <section>
                            <h2 className="font-semibold text-gray-800 mb-2">Postularse</h2>
                            <PostulacionForm trabajoId={trabajo.id} />
                        </section>
                    </CardContent>
                </Card>
            </div>
        </>
    );
}
