import { supabase } from "@/app/lib/supabase";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Building, MapPin, Euro, GraduationCap, Clock } from "lucide-react";
import { notFound } from "next/navigation";
import { format } from "date-fns";
import { es } from "date-fns/locale";

interface Params {
    params: {
        id: string;
    };
}

export default async function TrabajoDetallePage({ params }: { params: Promise<{ id: string }>}) {
    const { id } = await params;
    const { data, error } = await supabase
        .from("trabajos")
        .select("*")
        .eq("id", id)
        .single();

    if (error || !data) return notFound();

    const trabajo = data;

    const formatoFecha = format(new Date(trabajo.fecha_publicacion), "d 'de' MMMM yyyy", {
        locale: es,
    });

    return (
        <div className="max-w-3xl mx-auto p-6">
            <Card>
                <CardContent className="p-6 space-y-4">
                    <div className="flex justify-between items-start">
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900">{trabajo.titulo_vacante}</h1>
                            <div className="flex items-center text-sm text-gray-600 mt-1">
                                <Building size={16} className="mr-1" />
                                {trabajo.empresa}
                            </div>
                            <div className="text-sm text-gray-500 mt-1">
                                Publicado el {formatoFecha}
                            </div>
                        </div>
                        <Badge variant="outline">{trabajo.modalidad}</Badge>
                    </div>

                    <div className="space-y-2 text-sm text-gray-700">
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
                            <div className="text-gray-600">
                                <strong>Rubro:</strong> {trabajo.rubro}
                            </div>
                        )}
                    </div>

                    {trabajo.conocimientos_tecnicos && (
                        <div className="text-gray-700 text-sm">
                            <strong>Conocimientos técnicos:</strong> {trabajo.conocimientos_tecnicos}
                        </div>
                    )}

                    <div className="text-gray-800 leading-relaxed text-sm">
                        {trabajo.descripcion}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
