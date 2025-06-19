'use client';

import { Trabajo } from "@/types";
import TrabajoDialog from "@/app/components/Jobs/TrabajoDialog";
import JobPreview from "@/app/components/Jobs/JobPreview";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MapPin, Calendar, DollarSign, Trash2, ChevronDown, ChevronUp, Eye, Users, Download, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/app/lib/supabase";
import { toast } from "sonner";
import { useState } from "react";
import {
    AlertDialog,
    AlertDialogTrigger,
    AlertDialogContent,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogCancel,
    AlertDialogAction,
} from "@/components/ui/alert-dialog";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";

type Postulacion = {
    id: string;
    cv_storage_path: string;
    fecha_postulacion: string;
    cv_url?: string | null;
};

async function getSignedUrl(path: string): Promise<string | null> {
    const { data, error } = await supabase.storage
        .from("cvs")
        .createSignedUrl(path, 60);
    if (error) {
        console.error("Error obteniendo URL firmada:", error);
        return null;
    }
    return data?.signedUrl || null;
}

export default function EmpleosClient({ trabajos: initialTrabajos }: { trabajos: Trabajo[] }) {
    const [trabajos, setTrabajos] = useState<Trabajo[]>(initialTrabajos);
    const [searchTerm, setSearchTerm] = useState("");
    const [sortAsc, setSortAsc] = useState(true);
    const [expandedDescriptions, setExpandedDescriptions] = useState<Set<string>>(new Set());
    const [previewTrabajo, setPreviewTrabajo] = useState<Trabajo | null>(null);
    const [postulaciones, setPostulaciones] = useState<Postulacion[]>([]);
    const [loadingPostulaciones, setLoadingPostulaciones] = useState(false);

    const MAX_DESCRIPTION_LENGTH = 150;

    // Función para obtener postulaciones por trabajo
    const fetchPostulacionesPorTrabajo = async (trabajoId: string) => {
        setLoadingPostulaciones(true);
        try {
            const { data, error } = await supabase
                .from("postulaciones")
                .select("id, cv_storage_path, fecha_postulacion")
                .eq("trabajo_id", trabajoId);

            if (error) {
                toast.error("Error cargando postulaciones: " + error.message);
                return;
            }

            const postulacionesConUrl = await Promise.all(
                (data || []).map(async (p) => {
                    const url = await getSignedUrl(p.cv_storage_path);
                    return {
                        id: p.id,
                        cv_storage_path: p.cv_storage_path,
                        fecha_postulacion: p.fecha_postulacion,
                        cv_url: url,
                    };
                })
            );

            setPostulaciones(postulacionesConUrl);
        } catch (error) {
            toast.error("Error inesperado: " + error);
        } finally {
            setLoadingPostulaciones(false);
        }
    };

    // Función para abrir CV
    const handleOpenCv = async (path: string) => {
        const url = await getSignedUrl(path);
        if (url) {
            window.open(url, "_blank");
        } else {
            toast.error("Error obteniendo URL para el CV.");
        }
    };

    // Función para descargar CV
    const handleDownloadCv = async (path: string, fileName: string) => {
        try {
            const { data, error } = await supabase.storage
                .from("cvs")
                .download(path);

            if (error) {
                console.error("Error descargando archivo:", error);
                toast.error("Error al descargar el archivo.");
                return;
            }

            if (data) {
                const url = window.URL.createObjectURL(data);
                const link = document.createElement('a');
                link.href = url;
                link.download = fileName;
                link.style.display = 'none';
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
                window.URL.revokeObjectURL(url);
            }
        } catch (error) {
            console.error("Error en descarga:", error);
            toast.error("Error al descargar el archivo.");
        }
    };

    // Función para convertir Trabajo a JobPreviewData
    const convertToJobPreviewData = (trabajo: Trabajo) => {
        // Parsear rango_salarial string a objeto
        const parseRangoSalarial = (rangoStr: string | null) => {
            if (!rangoStr) {
                return { desde: "", hasta: "", moneda: "ARS" as const };
            }

            // Buscar patrón como "$800,000 - $1,000,000 ARS" o "$800.000 - $1.000.000 ARS"
            const match = rangoStr.match(
                /\$?([\d\.\,]+)\s*-\s*\$?([\d\.\,]+)\s*(ARS|USD)/i
            );

            if (match) {
                const desde = match[1].replace(/\./g, "").replace(/,/g, "");
                const hasta = match[2].replace(/\./g, "").replace(/,/g, "");
                const moneda = match[3].toUpperCase();
                const isMonedaValida = moneda === "ARS" || moneda === "USD";

                return {
                    desde,
                    hasta,
                    moneda: isMonedaValida ? (moneda as "ARS" | "USD") : "ARS",
                };
            }

            // Buscar patrón como "$800,000 ARS" (solo desde)
            const singleMatch = rangoStr.match(
                /\$?([\d\.\,]+)\s*(ARS|USD)/i
            );

            if (singleMatch) {
                const desde = singleMatch[1].replace(/\./g, "").replace(/,/g, "");
                const moneda = singleMatch[2].toUpperCase();
                const isMonedaValida = moneda === "ARS" || moneda === "USD";

                return {
                    desde,
                    hasta: "",
                    moneda: isMonedaValida ? (moneda as "ARS" | "USD") : "ARS",
                };
            }

            // Si no coincide con ningún patrón, devolver el string original en desde
            return {
                desde: rangoStr,
                hasta: "",
                moneda: "ARS" as const,
            };
        };

        return {
            titulo_vacante: trabajo.titulo_vacante,
            empresa: trabajo.empresa,
            rubro: trabajo.rubro || "",
            formacion: trabajo.formacion || "",
            conocimientos_tecnicos: trabajo.conocimientos_tecnicos || "",
            jornada_laboral: trabajo.jornada_laboral || "",
            ubicacion: trabajo.ubicacion || "",
            modalidad: trabajo.modalidad as "Presencial" | "Remoto" | "Híbrido",
            rango_salarial: parseRangoSalarial(trabajo.rango_salarial),
            descripcion: trabajo.descripcion || "",
            activo: trabajo.activo,
        };
    };

    const toggleDescription = (trabajoId: string) => {
        setExpandedDescriptions(prev => {
            const newSet = new Set(prev);
            if (newSet.has(trabajoId)) {
                newSet.delete(trabajoId);
            } else {
                newSet.add(trabajoId);
            }
            return newSet;
        });
    };

    const handleDelete = async (id: string) => {
        try {
            const { error } = await supabase
                .from("trabajos")
                .delete()
                .eq("id", id);

            if (error) {
                console.error('Error de Supabase:', error);
                toast.error("Error al borrar trabajo: " + error.message);
                return;
            }

            setTrabajos((prev) => {
                const nuevosTrabajos = prev.filter((trabajo) => trabajo.id !== id);
                return nuevosTrabajos;
            });

            toast.success("Trabajo borrado correctamente");

        } catch (error) {
            toast.error("Error inesperado al borrar el trabajo: " + error);
        }
    };

    const handleCreate = (nuevoTrabajo: Trabajo) => {
        setTrabajos((prev) => [...prev, nuevoTrabajo]);
        setSearchTerm("");
    };

    // Función para manejar la actualización de un trabajo existente
    const handleUpdate = (trabajoActualizado: Trabajo) => {
        setTrabajos((prev) =>
            prev.map((trabajo) =>
                trabajo.id === trabajoActualizado.id ? trabajoActualizado : trabajo
            )
        );
    };

    const filteredTrabajos = trabajos
        .filter((t) =>
            t.titulo_vacante
                ?.toLowerCase()
                .includes(searchTerm.toLowerCase()) ||
            t.ubicacion
                ?.toLowerCase()
                .includes(searchTerm.toLowerCase()) ||
            t.descripcion
                ?.toLowerCase()
                .includes(searchTerm.toLowerCase()) ||
            t.rango_salarial
                ?.toLowerCase()
                .includes(searchTerm.toLowerCase())
        )
        .sort((a, b) => {
            const dateA = new Date(a.fecha_publicacion).getTime();
            const dateB = new Date(b.fecha_publicacion).getTime();
            return sortAsc ? dateA - dateB : dateB - dateA;
        });

    return (
        <div className="space-y-6">
            <Card variant="neubrutalist" className="!p-4">
                <div className="flex items-center justify-between">
                    <h1 className="text-3xl font-bold text-primary uppercase tracking-wide">
                        Gestión de Empleos
                    </h1>
                    <TrabajoDialog mode="create" onCreate={handleCreate} />
                </div>
            </Card>

            {(!trabajos || trabajos.length === 0) ? (
                <Card variant="neubrutalist" className="!p-6">
                    <p className="text-center font-bold text-lg text-gray-600 dark:text-gray-300">
                        No hay ofertas de empleo disponibles en este momento.
                    </p>
                    <div className="flex justify-center mt-4">
                        <TrabajoDialog mode="create" onCreate={handleCreate} />
                    </div>
                </Card>
            ) : (
                <>
                    <Card variant="neubrutalist" className="!p-4 space-y-4">
                        <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
                            <Input
                                variant="brutalist"
                                type="text"
                                placeholder="Buscar por título, ubicación, descripción o salario..."
                                className="px-4 py-2 w-full md:w-1/2"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                            <Button
                                variant="brutalist"
                                className="bg-[#8be9fd] hover:bg-[#50fa7b] text-black font-bold uppercase"
                                onClick={() => setSortAsc(!sortAsc)}
                            >
                                Ordenar por fecha: {sortAsc ? "Ascendente" : "Descendente"}
                            </Button>
                        </div>
                    </Card>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredTrabajos.map((trabajo) => {
                            const isExpanded = expandedDescriptions.has(trabajo.id);
                            const shouldShowToggle = trabajo.descripcion && trabajo.descripcion.length > MAX_DESCRIPTION_LENGTH;
                            const displayDescription = shouldShowToggle && !isExpanded
                                ? trabajo.descripcion.substring(0, MAX_DESCRIPTION_LENGTH) + "..."
                                : trabajo.descripcion;

                            return (
                                <Card key={trabajo.id} variant="neubrutalist">
                                    <CardHeader>
                                        <div className="flex items-center justify-between gap-2">
                                            <CardTitle className="text-xl font-black uppercase tracking-wide text-black dark:text-white">
                                                {trabajo.titulo_vacante}
                                            </CardTitle>
                                            <Dialog>
                                                <DialogTrigger asChild>
                                                    <Button
                                                        variant="brutalist"
                                                        size="sm"
                                                        className="rounded-none flex items-center gap-1 bg-[#ff69b4] hover:bg-[#e44f9c] text-white"
                                                        onClick={() => fetchPostulacionesPorTrabajo(trabajo.id)}
                                                    >
                                                        <Users className="w-3 h-3" />
                                                        Postulantes
                                                    </Button>
                                                </DialogTrigger>
                                                <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                                                    <DialogHeader>
                                                        <DialogTitle>Postulantes para: {trabajo.titulo_vacante}</DialogTitle>
                                                    </DialogHeader>
                                                    {loadingPostulaciones ? (
                                                        <div className="p-6 text-center">
                                                            <p className="font-bold text-lg">Cargando postulaciones...</p>
                                                        </div>
                                                    ) : postulaciones.length === 0 ? (
                                                        <div className="p-6 text-center">
                                                            <p className="font-bold text-lg text-gray-600 dark:text-gray-300">
                                                                No hay postulaciones para este empleo.
                                                            </p>
                                                        </div>
                                                    ) : (
                                                        <div className="space-y-4">
                                                            {postulaciones.map((postulacion) => {
                                                                const nombreCV = postulacion.cv_storage_path?.split("-").slice(2).join("-") || "Archivo";

                                                                return (
                                                                    <Card key={postulacion.id} variant="neubrutalist" className="!p-4">
                                                                        <div className="flex items-center justify-between">
                                                                            <div>
                                                                                <h4 className="font-black text-lg text-black dark:text-white">
                                                                                    {nombreCV}
                                                                                </h4>
                                                                                <p className="text-sm text-gray-600 dark:text-gray-300">
                                                                                    <strong>Fecha postulación:</strong>{" "}
                                                                                    {new Date(postulacion.fecha_postulacion).toLocaleDateString('es-AR')}
                                                                                </p>
                                                                            </div>
                                                                            <div className="flex gap-2">
                                                                                {postulacion.cv_url && (
                                                                                    <>
                                                                                        <Button
                                                                                            variant="brutalist"
                                                                                            size="sm"
                                                                                            className="bg-[#ff69b4] hover:bg-[#e44f9c] text-white"
                                                                                            onClick={() => handleOpenCv(postulacion.cv_storage_path)}
                                                                                        >
                                                                                            <ExternalLink className="w-3 h-3 mr-1" /> Ver CV
                                                                                        </Button>
                                                                                        <Button
                                                                                            variant="brutalist"
                                                                                            size="sm"
                                                                                            className="bg-[#dd63ff] hover:bg-[#bd13ec] text-white"
                                                                                            onClick={() => handleDownloadCv(postulacion.cv_storage_path, nombreCV)}
                                                                                        >
                                                                                            <Download className="w-3 h-3 mr-1" /> Descargar
                                                                                        </Button>
                                                                                    </>
                                                                                )}
                                                                            </div>
                                                                        </div>
                                                                    </Card>
                                                                );
                                                            })}
                                                        </div>
                                                    )}
                                                </DialogContent>
                                            </Dialog>
                                        </div>
                                    </CardHeader>
                                    <CardContent className="space-y-3">
                                        <div className="flex items-center gap-2 font-bold">
                                            <MapPin className="w-4 h-4 text-primary" />
                                            <span className="text-sm">{trabajo.ubicacion}</span>
                                        </div>

                                        <div className="flex items-center gap-2 font-bold">
                                            <Calendar className="w-4 h-4 text-primary" />
                                            <span className="text-sm">
                                                Publicado: {new Date(trabajo.fecha_publicacion).toLocaleDateString('es-AR')}
                                            </span>
                                        </div>

                                        {trabajo.rango_salarial && (
                                            <div className="flex items-center gap-2 font-bold">
                                                <DollarSign className="w-4 h-4 text-primary" />
                                                <span className="text-sm">{trabajo.rango_salarial}</span>
                                            </div>
                                        )}

                                        <div className="bg-gray-100 p-3 border-2 border-black dark:bg-gray-800 dark:border-white">
                                            <p className="text-sm text-gray-700 dark:text-gray-300 break-words whitespace-pre-line leading-relaxed">
                                                {displayDescription}
                                            </p>

                                            {shouldShowToggle && (
                                                <button
                                                    onClick={() => toggleDescription(trabajo.id)}
                                                    className="flex items-center gap-1 mt-2 text-xs font-bold text-primary hover:text-primary/80 transition-colors"
                                                >
                                                    {isExpanded ? (
                                                        <>
                                                            Ver menos <ChevronUp className="w-3 h-3" />
                                                        </>
                                                    ) : (
                                                        <>
                                                            Ver más <ChevronDown className="w-3 h-3" />
                                                        </>
                                                    )}
                                                </button>
                                            )}
                                        </div>

                                        <div className="flex justify-between items-center pt-2 gap-2">
                                            <span className={`px-3 py-1 text-xs font-black uppercase border-2 border-black ${trabajo.activo
                                                ? 'bg-green-300 text-green-800'
                                                : 'bg-red-300 text-red-800'
                                                }`}>
                                                {trabajo.activo ? 'Activo' : 'Inactivo'}
                                            </span>

                                            <div className="flex gap-2">
                                                <Dialog>
                                                    <DialogTrigger asChild>
                                                        <Button
                                                            variant="brutalist"
                                                            size="sm"
                                                            className="rounded-none flex items-center gap-1 bg-[#50fa7b] hover:bg-[#8be9fd] text-black"
                                                            onClick={() => setPreviewTrabajo(trabajo)}
                                                        >
                                                            <Eye className="w-3 h-3" />
                                                        </Button>
                                                    </DialogTrigger>
                                                    <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                                                        <DialogHeader>
                                                            <DialogTitle>Vista Previa - {trabajo.titulo_vacante}</DialogTitle>
                                                        </DialogHeader>
                                                        {previewTrabajo && (
                                                            <JobPreview data={convertToJobPreviewData(previewTrabajo)} />
                                                        )}
                                                    </DialogContent>
                                                </Dialog>

                                                <TrabajoDialog
                                                    trabajo={trabajo}
                                                    mode="edit"
                                                    onUpdate={handleUpdate}
                                                />

                                                <AlertDialog>
                                                    <AlertDialogTrigger asChild>
                                                        <Button
                                                            variant="brutalist"
                                                            size="sm"
                                                            className="rounded-none flex items-center gap-1 bg-[#ff97d9] hover:bg-[#e44f9c] text-black"
                                                        >
                                                            <Trash2 className="w-3 h-3" />
                                                        </Button>
                                                    </AlertDialogTrigger>
                                                    <AlertDialogContent variant="neubrutalist">
                                                        <AlertDialogHeader variant="neubrutalist">
                                                            <AlertDialogTitle variant="neubrutalist">
                                                                ¿Estás seguro que deseas borrar este trabajo?
                                                            </AlertDialogTitle>
                                                            <AlertDialogDescription variant="neubrutalist">
                                                                Esta acción no se puede deshacer. El trabajo se eliminará permanentemente junto con todas sus postulaciones asociadas.
                                                            </AlertDialogDescription>
                                                        </AlertDialogHeader>
                                                        <AlertDialogFooter variant="neubrutalist">
                                                            <AlertDialogCancel variant="neubrutalist">Cancelar</AlertDialogCancel>
                                                            <AlertDialogAction
                                                                variant="neubrutalist"
                                                                onClick={() => handleDelete(trabajo.id)}
                                                            >
                                                                Borrar
                                                            </AlertDialogAction>
                                                        </AlertDialogFooter>
                                                    </AlertDialogContent>
                                                </AlertDialog>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            );
                        })}
                    </div>
                </>
            )}
        </div>
    );
}