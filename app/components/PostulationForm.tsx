"use client";
import { useState } from "react";
import { supabase } from "@/app/lib/supabase";
import CVDropzone from "@/components/ui/draganddrop";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

type Props = {
    trabajoId: string;
};

export default function PostulacionForm({ trabajoId }: Props) {
    const [file, setFile] = useState<File | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [uploadError, setUploadError] = useState<string | null>(null);

    const handleFileDrop = (file: File) => {
        setFile(file);
        setUploadError(null);
    };

    const sanitizeFileName = (fileName: string) => {
        // Remover caracteres especiales y reemplazar espacios con guiones
        return fileName
            .normalize('NFD') // Normalizar acentos
            .replace(/[\u0300-\u036f]/g, '') // Remover diacríticos
            .replace(/[^a-zA-Z0-9.-]/g, '-') // Reemplazar caracteres especiales con guiones
            .replace(/-+/g, '-') // Reemplazar múltiples guiones con uno solo
            .replace(/^-|-$/g, ''); // Remover guiones al inicio y final
    };

    const handlePostular = async () => {
        if (!file) {
            setUploadError("Por favor, sube tu CV.");
            return;
        }

        setIsSubmitting(true);
        try {
            const sanitizedFileName = sanitizeFileName(file.name);
            const filePath = `cv-${Date.now()}-${sanitizedFileName}`;
            const { error: uploadError } = await supabase.storage
                .from("cvs")
                .upload(filePath, file);

            if (uploadError) throw uploadError;

            const { error: postError } = await supabase
                .from("postulaciones")
                .insert([
                    {
                        trabajo_id: trabajoId,
                        cv_storage_path: filePath, // ✅ solo guardamos la ruta
                    },
                ]);

            if (postError) throw postError;

            toast.success("¡Postulación enviada exitosamente!");
            setFile(null);
        } catch (error: unknown) {
            console.error(error);
            toast.error("Hubo un error al enviar tu postulación.");
        } finally {
            setIsSubmitting(false);
        }
    };


    return (
        <div className="space-y-6">
            <CVDropzone onFileDrop={handleFileDrop} file={file} />
            {uploadError && <p className="text-sm text-red-600">{uploadError}</p>}
            <Button
                onClick={handlePostular}
                disabled={isSubmitting || !file}
                className="w-full"
            >
                {isSubmitting ? "Enviando..." : "Postúlate"}
            </Button>
        </div>
    );
}
