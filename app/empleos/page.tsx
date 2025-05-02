'use client';

import { useState, useEffect } from "react";
import { Card } from "../components/ui/main/Card";
import { supabase } from "@/app/lib/supabase"; // Asegúrate de tener el cliente configurado correctamente
import Link from "next/link";
import { Building, MapPin, Euro, Upload } from "lucide-react";
import { useCvUpload } from "../hooks/useCvUpload";

interface Empleo {
    id: string;
    titulo: string;
    empresa: string;
    ubicacion: string;
    modalidad: string;
    salario: string;
    descripcion: string;
}

export default function Jobs() {
    const [empleos, setEmpleos] = useState<Empleo[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const { handleFileChange, handleUpload, cvFile } = useCvUpload();

    useEffect(() => {
        const fetchEmpleos = async () => {
            setIsLoading(true);
            const { data, error } = await supabase
                .from("empleos")
                .select("*")
                .order("created_at", { ascending: false });

            if (error) {
                console.error("Error al cargar empleos:", error);
                setError("No se pudieron cargar los empleos. Por favor, intenta de nuevo más tarde.");
            } else {
                setEmpleos(data as Empleo[]);
            }

            setIsLoading(false);
        };

        fetchEmpleos();
    }, []);

    const getModalidadColor = (modalidad: string) => {
        switch (modalidad.toLowerCase()) {
            case 'remoto':
                return 'bg-green-100 text-green-800';
            case 'presencial':
                return 'bg-blue-100 text-blue-800';
            case 'hibrido':
                return 'bg-purple-100 text-purple-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    const CVUploadSection = () => {
        const [isDragging, setIsDragging] = useState(false);
    
        const handleDragOver = (e: React.DragEvent<HTMLLabelElement>) => {
            e.preventDefault();
            e.stopPropagation();
            setIsDragging(true);
        };
    
        const handleDragLeave = () => {
            setIsDragging(false);
        };
    
        const handleDrop = (e: React.DragEvent<HTMLLabelElement>) => {
            e.preventDefault();
            e.stopPropagation();
            setIsDragging(false);
            const file = e.dataTransfer.files?.[0];
            if (file) {
                handleFileChange({ target: { files: [file] } } as any);
            }
        };
    
        return (
            <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6 mb-8">
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-xl font-semibold mb-2">Carga tu CV</h2>
                        <p className="text-gray-600 text-sm mb-4">
                            ¡Deja que las empresas te encuentren! Sube tu CV para recibir ofertas laborales.
                        </p>
                    </div>
                    <Upload className="text-blue-600 w-6 h-6" />
                </div>
    
                <div className="relative">
                    <input
                        type="file"
                        id="cv-upload"
                        className="hidden"
                        accept=".pdf,.doc,.docx"
                        onChange={handleFileChange}
                    />
                    <label
                        htmlFor="cv-upload"
                        onDragOver={handleDragOver}
                        onDragLeave={handleDragLeave}
                        onDrop={handleDrop}
                        className={`flex items-center justify-center px-4 py-6 border-2 border-dashed rounded-lg cursor-pointer transition-colors text-center
                            ${isDragging ? 'border-blue-500 bg-blue-50' :
                            cvFile ? 'border-green-500 bg-green-50' :
                            'border-gray-300 hover:border-blue-400 hover:bg-blue-50'}`}
                    >
                        <div>
                            {cvFile ? (
                                <>
                                    <p className="text-green-600 font-medium">{cvFile.name}</p>
                                    <p className="text-sm text-green-500 mt-1">Archivo cargado correctamente</p>
                                </>
                            ) : (
                                <>
                                    <p className="text-gray-600 font-medium">Arrastra tu CV aquí o haz clic para buscar</p>
                                    <p className="text-sm text-gray-500 mt-1">PDF, DOC, DOCX (Máx. 5MB)</p>
                                </>
                            )}
                        </div>
                    </label>
                </div>
    
                {cvFile && (
                    <button
                        onClick={handleUpload}
                        className="w-full mt-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                        Subir CV
                    </button>
                )}
            </div>
        );
    };
    

    if (isLoading) {
        return (
            <div className="max-w-6xl mx-auto p-6">
                <div className="flex items-center justify-between mb-8">
                    <h1 className="text-3xl font-bold">Trabaja con nosotros</h1>
                    <div className="h-10 w-28 bg-gray-200 rounded animate-pulse"></div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[...Array(6)].map((_, index) => (
                        <Card className="p-6 h-full" key={index}>
                            <div className="animate-pulse">
                                <div className="h-6 w-24 bg-gray-200 rounded mb-4"></div>
                                <div className="h-7 w-3/4 bg-gray-200 rounded mb-3"></div>
                                <div className="h-5 w-1/2 bg-gray-200 rounded mb-4"></div>
                                <div className="space-y-3 mb-6">
                                    <div className="h-5 w-2/3 bg-gray-200 rounded"></div>
                                    <div className="h-5 w-1/2 bg-gray-200 rounded"></div>
                                </div>
                                <div className="pt-4 border-t border-gray-100">
                                    <div className="h-5 w-28 bg-gray-200 rounded"></div>
                                </div>
                            </div>
                        </Card>
                    ))}
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="max-w-6xl mx-auto p-6">
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                    <p>{error}</p>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-6xl mx-auto p-6">
            <h1 className="text-3xl font-bold mb-8">Trabaja con nosotros</h1>
            <CVUploadSection />
            <h1 className="text-xl font-bold mb-4">Ofertas de empleo</h1>
            {empleos.length === 0 ? (
                <div className="text-center py-12">
                    <p className="text-gray-500">No hay ofertas de empleo disponibles en este momento.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {empleos.map((empleo) => (
                        <Link href={`/empleos/${empleo.id}`} key={empleo.id} className="group">
                            <Card className="p-6 h-full hover:shadow-md hover:border-primary group-hover:border-primary">
                                <div className="flex flex-col h-full">
                                    <div>
                                        <div className="flex justify-between items-start mb-3">
                                            <span className={`px-3 py-1 rounded-full text-xs font-medium ${getModalidadColor(empleo.modalidad)}`}>
                                                {empleo.modalidad.charAt(0).toUpperCase() + empleo.modalidad.slice(1)}
                                            </span>
                                        </div>

                                        <h2 className="text-xl font-bold text-gray-900 mb-1 group-hover:text-primary transition-colors">
                                            {empleo.titulo}
                                        </h2>

                                        <div className="flex items-center text-sm text-gray-600 mb-2">
                                            <Building size={16} className="mr-1" />
                                            <span>{empleo.empresa}</span>
                                        </div>

                                        <div className="space-y-2 mb-4">
                                            <div className="flex items-center text-sm text-gray-500">
                                                <MapPin size={16} className="mr-1" />
                                                <span>{empleo.ubicacion}</span>
                                            </div>

                                            {empleo.salario && (
                                                <div className="flex items-center text-sm text-gray-500">
                                                    <Euro size={16} className="mr-1" />
                                                    <span>{empleo.salario}</span>
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    <div className="mt-auto pt-4 border-t border-gray-100">
                                        <span className="text-primary text-sm font-medium inline-flex items-center group-hover:underline">
                                            Ver detalles
                                            <svg className="ml-1 w-4 h-4 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
                                            </svg>
                                        </span>
                                    </div>
                                </div>
                            </Card>
                        </Link>
                    ))}
                </div>
            )}
        </div>
    );
}
