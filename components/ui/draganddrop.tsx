import { useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { Card } from "@/components/ui/card";

type Props = {
    onFileDrop: (file: File) => void;
    file?: File | null;
    error?: string | null;
};

export default function CVDropzone({ onFileDrop, file, error }: Props) {
    const onDrop = useCallback(
        (acceptedFiles: File[]) => {
            if (acceptedFiles.length > 0) {
                onFileDrop(acceptedFiles[0]);
            }
        },
        [onFileDrop]
    );

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: { "application/pdf": [".pdf"] },
        maxFiles: 1,
    });

    return (
        <div className="space-y-2">
            <Card
                {...getRootProps()}
                className={`bg-fuchsia-50 w-full max-w-full p-6 text-center cursor-pointer border-2 border-dashed rounded-lg transition ${isDragActive
                    ? "border-blue-500 bg-blue-50"
                    : error
                        ? "border-red-500 bg-red-50"
                        : "border-gray-300"
                    }`}
            >
                <input {...getInputProps()} />
                {isDragActive ? (
                    <p className="text-blue-600">Suelta tu CV aquí...</p>
                ) : file ? (
                    <div>
                        <p className="text-green-700 font-medium">Archivo seleccionado:</p>
                        <p className="text-green-700">{file.name}</p>
                    </div>
                ) : (
                    <p className="text-gray-600">Arrastra y suelta tu CV aquí o haz clic para seleccionar un PDF</p>
                )}
            </Card>
            {error && <p className="text-sm text-red-600">{error}</p>}
        </div>
    );
}
