import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Building, MapPin, CircleDollarSign } from "lucide-react";
import Link from "next/link";
import CVUploadDialog from "../components/CVUploadDialog";
import { Trabajo } from "@/types";
import { getTrabajosActivos } from "../actions/getTrabajos";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Ofertas de Empleo Industriales - Trabajos Disponibles",
    description: "Descubre las mejores oportunidades laborales en perfiles industriales. Ofertas de empleo actualizadas diariamente con empresas PYMES, nacionales y multinacionales. Encuentra tu próximo trabajo.",
    keywords: [
        "ofertas de empleo",
        "trabajos industriales",
        "empleos Argentina",
        "vacantes industriales",
        "búsqueda de empleo",
        "trabajos presenciales",
        "empleos remotos",
        "empleos híbridos",
        "oportunidades laborales",
        "recursos humanos"
    ],
    openGraph: {
        title: "Ofertas de Empleo Industriales - Trabajos Disponibles | Talento Positivo RH",
        description: "Descubre las mejores oportunidades laborales en perfiles industriales. Ofertas actualizadas diariamente.",
        type: "website",
        url: "https://talentopositivorh.com/empleos",
    },
    alternates: {
        canonical: "https://talentopositivorh.com/empleos",
    },
};

export default async function TrabajosPage() {
    const data = await getTrabajosActivos();

    if (!data || data.length === 0) {
        return (
            <div className="max-w-6xl mx-auto p-6 text-center">
                <p className="text-gray-500">No hay ofertas de empleo disponibles en este momento.</p>
            </div>
        );
    }

    const getModalidadColor = (modalidad: string) => {
        switch (modalidad.toLowerCase()) {
            case "remoto":
                return "bg-green-100 text-green-800";
            case "presencial":
                return "bg-blue-100 text-blue-800";
            case "híbrido":
                return "bg-purple-100 text-purple-800";
            default:
                return "bg-gray-100 text-gray-800";
        }
    };

    return (
        <div>
            <div className="max-w-6xl mx-auto p-6">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8 gap-4">
                    <div>
                        <h1 className="text-4xl font-bold text-gray-800">Ofertas de empleo</h1>
                        <div className="w-20 h-1 bg-primary mt-2 rounded"></div>
                    </div>
                    <div className="flex items-center gap-2 p-2 bg-fuchsia-50 rounded-md shadow-sm">
                        <CVUploadDialog />
                        <span className="text-md font-semibold text-gray-800 tracking-wide">
                            y sumate a nuestro banco de talentos!
                        </span>
                    </div>



                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {data.map((trabajo: Trabajo) => (
                        <Link href={`/empleos/${trabajo.id}`} key={trabajo.id} className="group">
                            <Card className="h-full transition-shadow hover:shadow-md hover:border-primary bg-fuchsia-50">
                                <CardContent className="p-6 flex flex-col h-full">
                                    <div className="flex justify-between mb-3">
                                        <Badge className={getModalidadColor(trabajo.modalidad)}>
                                            {trabajo.modalidad}
                                        </Badge>
                                    </div>
                                    <h2 className="text-xl font-semibold mb-1 group-hover:text-primary transition-colors">
                                        {trabajo.titulo_vacante}
                                    </h2>
                                    <div className="flex items-center text-sm text-gray-600 mb-2">
                                        <Building size={16} className="mr-1" />
                                        {trabajo.empresa}
                                    </div>
                                    <div className="space-y-1 mb-4 text-sm text-gray-500">
                                        {trabajo.ubicacion && (
                                            <div className="flex items-center">
                                                <MapPin size={16} className="mr-1" />
                                                {trabajo.ubicacion}
                                            </div>
                                        )}
                                        {trabajo.rango_salarial && (
                                            <div className="flex items-center">
                                                <CircleDollarSign size={16} className="mr-1" />
                                                {trabajo.rango_salarial}
                                            </div>
                                        )}
                                    </div>
                                    <div className="mt-auto pt-4 border-t border-gray-700">
                                        <span className="text-primary text-sm font-medium inline-flex items-center group-hover:underline">
                                            Ver detalles
                                            <svg className="ml-1 w-4 h-4 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                                            </svg>
                                        </span>
                                    </div>
                                </CardContent>
                            </Card>
                        </Link>
                    ))}
                </div>
            </div>
        </div>
    );
}
