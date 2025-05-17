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
        <div className="max-w-3xl mx-auto p-6 space-y-6">
            <Button asChild variant="link">
                <Link
                    href="/empleos"
                >
                    <ArrowLeft className="mr-1 h-4 w-4" />
                    Volver al listado de empleos
                </Link>
            </Button>

            <Card>
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
    );
}
