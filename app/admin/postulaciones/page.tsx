"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/app/lib/supabase";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Trash2, Download, ExternalLink } from "lucide-react";
import { toast } from "sonner";
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
import { Input } from "@/components/ui/input";

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

type PostulacionRaw = {
    id: string;
    cv_storage_path: string;
    fecha_postulacion: string;
    trabajos: {
        titulo_vacante: string;
        fecha_publicacion: string;
    };
};


export default function Postulaciones() {
    const [postulaciones, setPostulaciones] = useState<
        Array<{
            id: string;
            cv_storage_path: string;
            fecha_postulacion: string;
            trabajos: {
                titulo_vacante: string;
                fecha_publicacion: string;
            } | null;
            cv_url?: string | null;
        }>
    >([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [sortAsc, setSortAsc] = useState(true);

    async function handleOpenCv(path: string) {
        const url = await getSignedUrl(path);
        if (url) {
            window.open(url, "_blank");
        } else {
            toast.error("Error obteniendo URL para el CV.");
        }
    }

    async function handleDownloadCv(path: string, fileName: string) {
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
    }


    useEffect(() => {
        async function fetchPostulaciones() {
            const { data, error } = await supabase
                .from("postulaciones")
                .select(`
                    id,
                    cv_storage_path,
                    fecha_postulacion,
                    trabajos (
                    titulo_vacante,
                    fecha_publicacion
                    )
                `) as unknown as { data: PostulacionRaw[]; error: undefined };

            if (error) {
                toast.error("Error cargando postulaciones: " + error);
                setLoading(false);
                return;
            }

            const postulacionesConUrl = await Promise.all(
                (data || []).map(async (p) => {
                    const url = await getSignedUrl(p.cv_storage_path);

                    const trabajo = p.trabajos as {
                        titulo_vacante: string;
                        fecha_publicacion: string;
                    };

                    return {
                        id: String(p.id),
                        cv_storage_path: String(p.cv_storage_path),
                        fecha_postulacion: String(p.fecha_postulacion),
                        trabajos: {
                            titulo_vacante: trabajo.titulo_vacante,
                            fecha_publicacion: trabajo.fecha_publicacion,
                        },
                        cv_url: url,
                    };
                })
            );

            setPostulaciones(postulacionesConUrl);
            setLoading(false);
        }

        fetchPostulaciones();
    }, []);

    async function handleDelete(id: string) {
        // Buscar la postulación para obtener la ruta del CV
        const { data: postulacion, error: fetchError } = await supabase
            .from("postulaciones")
            .select("cv_storage_path")
            .eq("id", id)
            .single();

        if (fetchError) {
            toast.error("Error al obtener postulación: " + fetchError.message);
            return;
        }

        if (!postulacion?.cv_storage_path) {
            toast.error("No se encontró la ruta del CV para esta postulación.");
            return;
        }

        // Borrar el archivo CV del storage
        const { error: deleteFileError } = await supabase.storage
            .from("cvs")
            .remove([postulacion.cv_storage_path]);

        if (deleteFileError) {
            toast.error("Error al borrar archivo CV: " + deleteFileError.message);
            return;
        }

        // Borrar la postulación en la base de datos
        const { error: deletePostulacionError } = await supabase
            .from("postulaciones")
            .delete()
            .eq("id", id);

        if (deletePostulacionError) {
            toast.error("Error al borrar postulación: " + deletePostulacionError.message);
            return;
        }

        toast.success("Postulación y archivo CV borrados correctamente");
        setPostulaciones((prev) => prev.filter((p) => p.id !== id));
    }

    const filteredPostulaciones = postulaciones
        .filter((p) =>
            p.trabajos?.titulo_vacante
                ?.toLowerCase()
                .includes(searchTerm.toLowerCase())
        )
        .sort((a, b) => {
            const dateA = new Date(a.fecha_postulacion).getTime();
            const dateB = new Date(b.fecha_postulacion).getTime();
            return sortAsc ? dateA - dateB : dateB - dateA;
        });

    if (loading) {
        return (
            <div className="space-y-6">
                <Card variant="neubrutalist" className="!p-4">
                    <h1 className="text-3xl font-bold text-primary uppercase tracking-wide">
                        Postulaciones
                    </h1>
                </Card>
                <Card variant="neubrutalist" className="!p-6">
                    <p className="text-center font-bold text-lg">Cargando postulaciones...</p>
                </Card>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <Card variant="neubrutalist" className="!p-4">
                <h1 className="text-3xl font-bold text-primary uppercase tracking-wide">
                    Postulaciones
                </h1>
            </Card>

            {postulaciones.length === 0 && (
                <Card variant="neubrutalist" className="!p-6">
                    <p className="text-center font-bold text-lg">No hay postulaciones registradas.</p>
                </Card>
            )}

            <Card variant="neubrutalist" className="!p-4 space-y-4">
                <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
                    <Input
                        variant="brutalist"
                        type="text"
                        placeholder="Buscar por título de vacante..."
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

            {filteredPostulaciones.map((p) => {
                const nombreCV =
                    p.cv_storage_path?.split("-").slice(2).join("-") || "Archivo";

                return (
                    <Card key={p.id} variant="neubrutalist">
                        <CardHeader>
                            <CardTitle className="text-xl font-black uppercase tracking-wide text-black dark:text-white">
                                {nombreCV}
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-2">
                            <p className="font-bold">
                                <strong className="text-primary">Vacante para:</strong> {p.trabajos?.titulo_vacante || "—"}
                            </p>
                            <p className="font-bold">
                                <strong className="text-primary">Fecha de publicación de empleo:</strong>{" "}
                                {p.trabajos?.fecha_publicacion ? new Date(p.trabajos.fecha_publicacion).toLocaleDateString('es-AR') : "—"}
                            </p>
                            <p className="font-bold">
                                <strong className="text-primary">Fecha postulación:</strong>{" "}
                                {p.fecha_postulacion ? new Date(p.fecha_postulacion).toLocaleDateString('es-AR') : "—"}
                            </p>

                            <div className="flex gap-4 mt-4 flex-wrap">
                                {p.cv_url && (
                                    <>
                                        <Button variant="brutalist" asChild className="bg-[#ff69b4] hover:bg-[#e44f9c] text-white">
                                            <a
                                                onClick={() => handleOpenCv(p.cv_storage_path)}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="flex items-center font-bold uppercase"
                                            >
                                                <ExternalLink className="w-4 h-4 mr-1" /> Ver CV
                                            </a>
                                        </Button>

                                        <Button
                                            variant="brutalist"
                                            onClick={() => handleDownloadCv(p.cv_storage_path, nombreCV)}
                                            className="flex items-center font-bold uppercase bg-[#dd63ff] hover:bg-[#bd13ec] text-white"
                                        >
                                            <Download className="w-4 h-4 mr-1" /> Descargar
                                        </Button>
                                    </>
                                )}

                                {/* Alert Dialog para borrar */}
                                <AlertDialog>
                                    <AlertDialogTrigger asChild>
                                        <Button variant="brutalist" className="flex items-center font-bold uppercase bg-[#ff97d9] hover:bg-[#e44f9c] text-black">
                                            <Trash2 className="w-4 h-4 mr-1" /> Borrar
                                        </Button>
                                    </AlertDialogTrigger>
                                    <AlertDialogContent variant="neubrutalist">
                                        <AlertDialogHeader variant="neubrutalist">
                                            <AlertDialogTitle variant="neubrutalist">
                                                ¿Estás seguro que deseas borrar esta postulación?
                                            </AlertDialogTitle>
                                            <AlertDialogDescription variant="neubrutalist">
                                                Esta acción no se puede deshacer. La postulación y el archivo CV se eliminarán permanentemente.
                                            </AlertDialogDescription>
                                        </AlertDialogHeader>
                                        <AlertDialogFooter variant="neubrutalist">
                                            <AlertDialogCancel variant="neubrutalist">Cancelar</AlertDialogCancel>
                                            <AlertDialogAction
                                                variant="neubrutalist"
                                                onClick={() => handleDelete(p.id)}
                                            >
                                                Borrar
                                            </AlertDialogAction>
                                        </AlertDialogFooter>
                                    </AlertDialogContent>
                                </AlertDialog>
                            </div>
                        </CardContent>
                    </Card>
                );
            })}
        </div>
    );
}
