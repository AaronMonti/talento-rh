import { supabase } from "../lib/supabase";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Building, MapPin, CircleDollarSign } from "lucide-react";
import Link from "next/link";
import CVUploadDialog from "../components/CVUploadDialog";

interface Trabajo {
    id: string;
    titulo_vacante: string;
    empresa: string;
    rubro: string | null;
    formacion: string | null;
    conocimientos_tecnicos: string | null;
    jornada_laboral: string | null;
    ubicacion: string | null;
    modalidad: "Presencial" | "Remoto" | "Híbrido";
    rango_salarial: string | null;
    descripcion: string;
    fecha_publicacion: string;
    activo: boolean;
}

export default async function TrabajosPage() {
    const { data, error } = await supabase
        .from("trabajos")
        .select("*")
        .eq("activo", true)
        .order("fecha_publicacion", { ascending: false });

    if (error) {
        return (
            <div className="max-w-6xl mx-auto p-6">
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                    <p>No se pudieron cargar los trabajos: {error.message}</p>
                </div>
            </div>
        );
    }

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
                    <div>
                        <CVUploadDialog />
                    </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {data.map((trabajo: Trabajo) => (
                        <Link href={`/empleos/${trabajo.id}`} key={trabajo.id} className="group">
                            <Card className="h-full transition-shadow hover:shadow-md hover:border-primary">
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
                                    <div className="mt-auto pt-4 border-t border-gray-100">
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
