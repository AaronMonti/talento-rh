'use client';

import { useState } from "react";
import { supabase } from "@/app/lib/supabase";
import { useToast } from "../components/ui/radix-toast";

export function useCvUpload() {
    const [cvFile, setCvFile] = useState<File | null>(null);
    const [filePath, setFilePath] = useState<any | string>('');
    const { showToast } = useToast();

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];

        if (!file) return;

        if (file.type !== "application/pdf") {
            showToast({
                title: "Error",
                description: "Por favor sube un archivo PDF",
                variant: "destructive",
            });
            return;
        }

        if (file.size > 5 * 1024 * 1024) {
            showToast({
                title: "Error",
                description: "El archivo es demasiado grande. Tamaño máximo: 5MB",
                variant: "destructive",
            });
            return;
        }

        setCvFile(file);
    };

    const handleUpload = async () => {
        if (!cvFile) return;

        setFilePath(`curriculums/${cvFile.name}`);

        const fileName = cvFile.name;
        const { data: files, error: listError } = await supabase
        .storage
        .from("cvs")
        .list("curriculums", { limit: 100 });

        if (listError) {
        showToast({
            title: "Error al verificar archivo",
            description: "Hubo un problema al listar los archivos.",
            variant: "destructive"
        });
        return;
        }

        const fileExists = files?.some(file => file.name === fileName);

        if (fileExists) {
        showToast({
            title: "Archivo ya existe",
            description: "El archivo con ese nombre ya está cargado. Usa otro nombre.",
            variant: "destructive"
        });
        return;
        }
        
        const { error } = await supabase.storage
            .from("cvs")
            .upload(filePath, cvFile, {
                cacheControl: "3600",
                upsert: true,
            });

        if (error) {
            showToast({
                title: "Error al subir CV",
                description: error.message,
                variant: "destructive",
            });
        } else {
            showToast({
                title: "CV subido correctamente",
                description: `Tu archivo ha sido subido como ${filePath}`,
            });
            setCvFile(null);
        }
    };

    return {
        cvFile,
        filePath,
        handleFileChange,
        handleUpload,
    };
}
