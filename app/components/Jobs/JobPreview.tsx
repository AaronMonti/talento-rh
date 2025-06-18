"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
    Building,
    MapPin,
    CircleDollarSign,
    GraduationCap,
    Clock,
} from "lucide-react";
import { format } from "date-fns";
import { es } from "date-fns/locale";

interface JobPreviewProps {
    data: {
        titulo_vacante: string;
        empresa: string;
        rubro: string;
        formacion: string;
        conocimientos_tecnicos: string;
        jornada_laboral: string;
        ubicacion: string;
        modalidad: "Presencial" | "Remoto" | "Híbrido";
        rango_salarial: {
            desde?: string;
            hasta?: string;
            moneda: "ARS" | "USD";
        };
        descripcion: string;
        activo: boolean;
    };
}

export default function JobPreview({ data }: JobPreviewProps) {
    const formatNumber = (numStr: string) => {
        const num = Number(numStr.replace(/\D/g, ""));
        if (isNaN(num)) return numStr;
        return num.toLocaleString("es-AR");
    };

    const formatSalary = () => {
        const { desde, hasta, moneda } = data.rango_salarial;
        if (desde && hasta) {
            return `$${formatNumber(desde)} - $${formatNumber(hasta)} ${moneda}`;
        } else if (desde) {
            return `$${formatNumber(desde)} ${moneda}`;
        }
        return null;
    };

    const formatoFecha = format(new Date(), "d 'de' MMMM yyyy", {
        locale: es,
    });

    return (
        <div className="max-w-3xl mx-auto space-y-6">
            <Card className="bg-fuchsia-50 min-h-[80vh]">
                <CardContent className="p-6 space-y-6">
                    <header className="flex justify-between items-start">
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900">
                                {data.titulo_vacante || "Título de la vacante"}
                            </h1>
                            <div className="flex items-center text-gray-600 mt-1">
                                <Building size={20} className="mr-2" />
                                {data.empresa || "Nombre de la empresa"}
                            </div>
                            <div className="text-gray-500 mt-1">
                                Publicado el {formatoFecha}
                            </div>
                        </div>
                        <div className="flex flex-col gap-2 items-end">
                            <Badge variant="outline">{data.modalidad}</Badge>
                            <div className="text-xs text-gray-500">
                                {data.activo ? "✓ Activo" : "⚠ Inactivo"}
                            </div>
                        </div>
                    </header>

                    <section className="space-y-2 text-gray-700">
                        <h2 className="font-semibold text-gray-800">Información general</h2>
                        {data.ubicacion && (
                            <div className="flex items-center">
                                <MapPin size={20} className="mr-3" />
                                <span>{data.ubicacion}</span>
                            </div>
                        )}
                        {formatSalary() && (
                            <div className="flex items-center">
                                <CircleDollarSign size={20} className="mr-3" />
                                <span>{formatSalary()}</span>
                            </div>
                        )}
                        {data.formacion && (
                            <div className="flex items-center">
                                <GraduationCap size={20} className="mr-3" />
                                <span>{data.formacion}</span>
                            </div>
                        )}
                        {data.jornada_laboral && (
                            <div className="flex items-center">
                                <Clock size={20} className="mr-3" />
                                <span>{data.jornada_laboral}</span>
                            </div>
                        )}
                        {data.rubro && (
                            <div>
                                <strong>Rubro:</strong> {data.rubro}
                            </div>
                        )}
                    </section>

                    {data.conocimientos_tecnicos && (
                        <section className="text-gray-700">
                            <h2 className="font-semibold text-gray-800 mb-1">
                                Conocimientos técnicos
                            </h2>
                            <p>{data.conocimientos_tecnicos}</p>
                        </section>
                    )}

                    <section className="text-gray-800">
                        <h2 className="font-semibold text-gray-800 mb-1">Descripción</h2>
                        <p className="leading-relaxed whitespace-pre-line">
                            {data.descripcion || "Descripción del puesto..."}
                        </p>
                    </section>

                    <section>
                        <h2 className="font-semibold text-gray-800 mb-2">Postularse</h2>
                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                            <p className="text-sm text-blue-800">
                                📝 Aquí aparecería el formulario de postulación
                            </p>
                        </div>
                    </section>

                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                        <p className="text-sm text-yellow-800 font-medium">
                            📋 Vista previa - Así es como se verá este empleo para los usuarios
                        </p>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
} 