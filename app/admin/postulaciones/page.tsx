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

export default function Postulaciones() {
    const [postulaciones, setPostulaciones] = useState<
        Array<{
            id: number;
            cv_storage_path: string;
            fecha_postulacion: string;
            trabajos: { titulo_vacante: string; fecha_publicacion: string };
            cv_url?: string | null;
        }>
    >([]);
    const [loading, setLoading] = useState(true);

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
        `)
                .order("fecha_postulacion", { ascending: false });

            if (error) {
                toast.error("Error cargando postulaciones: " + error.message);
                setLoading(false);
                return;
            }

            const postulacionesConUrl = await Promise.all(
                (data || []).map(async (p) => {
                    const url = await getSignedUrl(p.cv_storage_path);

                    // Aseguramos que los tipos sean correctos
                    return {
                        id: Number(p.id),
                        cv_storage_path: String(p.cv_storage_path),
                        fecha_postulacion: String(p.fecha_postulacion),
                        trabajos: {
                            titulo_vacante: String(p.trabajos?.[0]?.titulo_vacante || ""),
                            fecha_publicacion: String(p.trabajos?.[0]?.fecha_publicacion || "")
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

    async function handleDelete(id: number) {
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


    if (loading) return <p>Cargando postulaciones...</p>;

    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-bold">Postulaciones</h1>

            {postulaciones.length === 0 && <p>No hay postulaciones registradas.</p>}

            {postulaciones.map((p) => {
                const nombreCV =
                    p.cv_storage_path?.split("-").slice(2).join("-") || "Archivo";

                return (
                    <Card key={p.id}>
                        <CardHeader>
                            <CardTitle>{nombreCV}</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-2">
                            <p>
                                <strong>Vacante para:</strong> {p.trabajos?.titulo_vacante || "—"}
                            </p>
                            <p>
                                <strong>Fecha de publicación de empleo:</strong>{" "}
                                {p.trabajos?.fecha_publicacion || "—"}
                            </p>
                            <p>
                                <strong>Fecha postulación:</strong>{" "}
                                {p.fecha_postulacion || "—"}
                            </p>

                            <div className="flex gap-4 mt-4">
                                {p.cv_url && (
                                    <>
                                        <Button variant="outline" asChild>
                                            <a
                                                href={p.cv_url}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="flex items-center"
                                            >
                                                <ExternalLink className="w-4 h-4 mr-1" /> Ver CV
                                            </a>
                                        </Button>

                                        <Button
                                            variant="secondary"
                                            onClick={() => window.open(p.cv_url!, "_blank")}
                                            className="flex items-center"
                                        >
                                            <Download className="w-4 h-4 mr-1" /> Descargar
                                        </Button>
                                    </>
                                )}

                                {/* Alert Dialog para borrar */}
                                <AlertDialog>
                                    <AlertDialogTrigger asChild>
                                        <Button variant="destructive" className="flex items-center">
                                            <Trash2 className="w-4 h-4 mr-1" /> Borrar
                                        </Button>
                                    </AlertDialogTrigger>
                                    <AlertDialogContent>
                                        <AlertDialogHeader>
                                            <AlertDialogTitle>
                                                ¿Estás seguro que deseas borrar esta postulación?
                                            </AlertDialogTitle>
                                            <AlertDialogDescription>
                                                Esta acción no se puede deshacer. El CV y los datos de
                                                la postulación se eliminarán permanentemente.
                                            </AlertDialogDescription>
                                        </AlertDialogHeader>
                                        <AlertDialogFooter>
                                            <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                            <AlertDialogAction
                                                onClick={() => handleDelete(p.id)}
                                                className="bg-destructive text-white hover:bg-destructive/90"
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
