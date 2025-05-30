'use client';

import { useState } from "react";
import { supabase } from "@/app/lib/supabase";
import { toast } from "sonner";

export function useCvUpload() {
    const [cvFile, setCvFile] = useState<File | null>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];

        if (!file) return;

        if (file.type !== "application/pdf") {
            toast.error("Por favor sube un archivo PDF");
            return;
        }

        if (file.size > 5 * 1024 * 1024) {
            toast.error("El archivo es demasiado grande. Tamaño máximo: 5MB");
            return;
        }

        setCvFile(file);
    };

    const handleUpload = async () => {
        if (!cvFile) return;

        const filePath = `curriculums/${cvFile.name}`;
        const fileName = cvFile.name;

        const { data: files, error: listError } = await supabase
            .storage
            .from("cvs")
            .list("curriculums", { limit: 100 });

        if (listError) {
            toast.error("Hubo un problema al listar los archivos.");
            return;
        }

        const fileExists = files?.some(file => file.name === fileName);

        if (fileExists) {
            toast.error("El archivo con ese nombre ya está cargado. Usa otro nombre.");
            return;
        }

        const { error } = await supabase.storage
            .from("cvs")
            .upload(filePath, cvFile, {
                cacheControl: "3600",
                upsert: true,
            });

        if (error) {
            toast.error(`Error al subir CV: ${error.message}`);
        } else {
            toast.success(`CV subido correctamente como ${filePath}`);
            setCvFile(null);
        }
    };

    return {
        cvFile,
        handleFileChange,
        handleUpload,
    };
}
