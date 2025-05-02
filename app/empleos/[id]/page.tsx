'use client';

import { useState, useEffect, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import { supabase } from "@/app/lib/supabase";
import * as Form from '@radix-ui/react-form';
import * as Label from '@radix-ui/react-label';
import * as Toast from '@radix-ui/react-toast';
import { Building, MapPin, Euro, Calendar, ArrowLeft, Share2, Bookmark, Briefcase, Upload } from "lucide-react";
import { Card } from "@/app/components/ui/main/Card";
import { Button } from "@/app/components/ui/main/Button";
import { Empleo, ApplicationFormData } from "@/app/lib/types";
import { getModalidadColor } from "@/app/lib/empleoUtils";

export default function JobDetail() {
    const params = useParams();
    const router = useRouter();
    const [empleo, setEmpleo] = useState<Empleo | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [showApplicationForm, setShowApplicationForm] = useState(false);
    const [submitLoading, setSubmitLoading] = useState(false);
    const [submitSuccess, setSubmitSuccess] = useState(false);
    const [cvFile, setCvFile] = useState<File | null>(null);
    const [cvFileName, setCvFileName] = useState<string>("");
    const [formData, setFormData] = useState<Omit<ApplicationFormData, "cv_url">>({
        nombre: "",
        apellidos: "",
        email: "",
        telefono: "",
        mensaje: ""
    });
    const [toastOpen, setToastOpen] = useState(false);
    const [toastMessage, setToastMessage] = useState({ title: "", description: "", variant: "default" });
    
    // Add ref to track if component is mounted
    const isMounted = useRef(true);

    useEffect(() => {
        const fetchEmpleo = async () => {
            try {
                if (!params.id) {
                    throw new Error("ID de empleo no proporcionado");
                }
    
                const empleoId = Array.isArray(params.id) ? params.id[0] : params.id;
                const { data, error } = await supabase
                    .from("empleos")
                    .select("*")
                    .eq("id", empleoId)
                    .single();
    
                if (error || !data) {
                    throw new Error("Empleo no encontrado");
                }
    
                setEmpleo(data as Empleo);
            } catch (err) {
                console.error("Error al cargar el empleo:", err);
                setError("No se pudo cargar la información del empleo.");
            } finally {
                setIsLoading(false);
            }
        };
    
        fetchEmpleo();
    }, [params.id]);
    
    // Set up the ref when component mounts
    useEffect(() => {
        isMounted.current = true;
        
        // Clean up function that runs when component unmounts
        return () => {
            isMounted.current = false;
        };
    }, []);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (files && files.length > 0) {
            const file = files[0];
            // Check if file is PDF
            if (file.type !== "application/pdf") {
                setToastMessage({
                    title: "Error",
                    description: "Por favor sube un archivo PDF",
                    variant: "destructive"
                });
                return;
            }
            // Check file size (max 5MB)
            if (file.size > 5 * 1024 * 1024) {
                setToastMessage({
                    title: "Error",
                    description: "El archivo es demasiado grande. Tamaño máximo: 5MB",
                    variant: "destructive"
                });
                return;
            }
            setCvFile(file);
            setCvFileName(file.name);
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const validateForm = () => {
        if (!formData.nombre || !formData.apellidos || !formData.email || !formData.telefono) {
            setToastMessage({
                title: "Error",
                description: "Por favor completa todos los campos obligatorios",
                variant: "destructive"
            });
            setToastOpen(true);
            return false;
        }
        
        if (!cvFile) {
            setToastMessage({
                title: "Error",
                description: "Por favor sube tu CV en formato PDF",
                variant: "destructive"
            });
            setToastOpen(true);
            return false;
        }
        
        // Basic email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(formData.email)) {
            setToastMessage({
                title: "Error",
                description: "Por favor ingresa un email válido",
                variant: "destructive"
            });
            setToastOpen(true);
            return false;
        }
        
        return true;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
    
        if (!validateForm()) return;
    
        setSubmitLoading(true);
    
        try {
            const empleoId = Array.isArray(params.id) ? params.id[0] : params.id;
            const timestamp = Date.now();
            const filePath = `${empleoId}/${formData.email}_${timestamp}.pdf`;
    
            // 1. Subir archivo a Supabase Storage
            const { data: uploadData, error: uploadError } = await supabase
                .storage
                .from("cvs")
                .upload(filePath, cvFile as File, {
                    cacheControl: "3600",
                    upsert: false
                });
    
            if (uploadError) {
                throw new Error(`Error al subir el CV: ${uploadError.message}`);
            }
    
            // 2. Obtener la URL pública del archivo (si el bucket es público)
            const {
                data: publicUrlData,
                error: publicUrlError
            } = supabase.storage
                .from("cvs")
                .getPublicUrl(filePath);
    
            if (publicUrlError || !publicUrlData.publicUrl) {
                throw new Error("No se pudo obtener la URL pública del CV");
            }
    
            // 3. Insertar postulación en Supabase
            const applicationData = {
                ...formData,
                cv_url: publicUrlData.publicUrl,
                empleo_id: empleoId,
                empleo_titulo: empleo?.titulo || "",
                empresa: empleo?.empresa || "",
                fecha_postulacion: new Date().toISOString(),
                estado: "pendiente"
            };
    
            const { error: insertError } = await supabase
                .from("postulaciones")
                .insert([applicationData]);
    
            if (insertError) {
                throw new Error(`Error al guardar la postulación: ${insertError.message}`);
            }
    
            setSubmitSuccess(true);
            setToastMessage({
                title: "¡Aplicación enviada!",
                description: "Tu postulación ha sido recibida correctamente.",
                variant: "default"
            });
            setToastOpen(true);
    
            // Reset form
            setFormData({
                nombre: "",
                apellidos: "",
                email: "",
                telefono: "",
                mensaje: ""
            });
            setCvFile(null);
            setCvFileName("");
    
            // Cerrar formulario después de 1.5s
            setTimeout(() => {
                setShowApplicationForm(false);
                setSubmitSuccess(false);
            }, 1500);
    
        } catch (err) {
            console.error("Error al enviar la postulación:", err);
            setToastMessage({
                title: "Error",
                description: "No se pudo enviar tu postulación. Por favor intenta de nuevo.",
                variant: "destructive"
            });
            setToastOpen(true);
        } finally {
            setSubmitLoading(false);
        }
    };

    if (isLoading) {
        return (
            <div className="max-w-4xl mx-auto p-6">
                <div className="animate-pulse">
                    <div className="h-8 bg-gray-200 rounded w-3/4 mb-4"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/2 mb-6"></div>
                    <div className="space-y-3">
                        <div className="h-4 bg-gray-200 rounded"></div>
                        <div className="h-4 bg-gray-200 rounded"></div>
                        <div className="h-4 bg-gray-200 rounded"></div>
                        <div className="h-4 bg-gray-200 rounded w-5/6"></div>
                    </div>
                </div>
            </div>
        );
    }

    if (error || !empleo) {
        return (
            <div className="max-w-4xl mx-auto p-6">
                <Button
                    variant="outline"
                    onClick={() => router.back()}
                    className="mb-6"
                >
                    <ArrowLeft size={16} className="mr-2" /> Volver
                </Button>
                <Card className="p-6">
                    <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                        <p>{error || "No se encontró el empleo solicitado."}</p>
                    </div>
                </Card>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto p-6">
            {/* Toast notifications */}
            <Toast.Provider swipeDirection="right">
                <Toast.Root 
                    className={`fixed bottom-4 right-4 p-4 rounded-md shadow-md ${toastMessage.variant === 'destructive' ? 'bg-red-100 border-l-4 border-red-500 text-red-700' : 'bg-green-100 border-l-4 border-green-500 text-green-700'}`}
                    open={toastOpen}
                    onOpenChange={setToastOpen}
                    duration={5000}
                >
                    <Toast.Title className="font-medium mb-1">{toastMessage.title}</Toast.Title>
                    <Toast.Description>{toastMessage.description}</Toast.Description>
                    <Toast.Close className="absolute top-2 right-2 p-1 rounded-full hover:bg-gray-200">
                        <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M11.7816 4.03157C12.0062 3.80702 12.0062 3.44295 11.7816 3.2184C11.5571 2.99385 11.193 2.99385 10.9685 3.2184L7.50005 6.68682L4.03164 3.2184C3.80708 2.99385 3.44301 2.99385 3.21846 3.2184C2.99391 3.44295 2.99391 3.80702 3.21846 4.03157L6.68688 7.49999L3.21846 10.9684C2.99391 11.193 2.99391 11.557 3.21846 11.7816C3.44301 12.0061 3.80708 12.0061 4.03164 11.7816L7.50005 8.31316L10.9685 11.7816C11.193 12.0061 11.5571 12.0061 11.7816 11.7816C12.0062 11.557 12.0062 11.193 11.7816 10.9684L8.31322 7.49999L11.7816 4.03157Z" fill="currentColor" fillRule="evenodd" clipRule="evenodd"></path>
                        </svg>
                    </Toast.Close>
                </Toast.Root>
                <Toast.Viewport />
            </Toast.Provider>
            
            {/* Navegación */}
            <div className="mb-6 flex justify-between items-center">
                <Button
                    variant="outline"
                    onClick={() => router.back()}
                >
                    <ArrowLeft size={16} className="mr-2" /> Volver a ofertas
                </Button>

                <div className="flex gap-2">
                    <Button variant="outline" size="sm">
                        <Share2 size={16} className="mr-1" /> Compartir
                    </Button>
                    <Button variant="outline" size="sm">
                        <Bookmark size={16} className="mr-1" /> Guardar
                    </Button>
                </div>
            </div>

            {/* Cabecera del empleo */}
            <Card className="p-8 mb-6">
                <div className="flex justify-between items-start mb-4">
                    <div>
                        <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${getModalidadColor(empleo.modalidad)} mb-3`}>
                            {empleo.modalidad.charAt(0).toUpperCase() + empleo.modalidad.slice(1)}
                        </span>
                        <h1 className="text-3xl font-bold text-gray-900 mb-2">{empleo.titulo}</h1>

                        <div className="flex items-center text-lg text-gray-700 mb-4">
                            <Building size={18} className="mr-2" />
                            <span>{empleo.empresa}</span>
                        </div>
                    </div>

                    <div className="hidden sm:block">
                        <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center">
                            <Briefcase size={32} className="text-gray-400" />
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border-t border-gray-100 pt-4">
                    <div className="flex items-center text-gray-600">
                        <MapPin size={18} className="mr-2 text-gray-400" />
                        <span>{empleo.ubicacion}</span>
                    </div>

                    {empleo.salario && (
                        <div className="flex items-center text-gray-600">
                            <Euro size={18} className="mr-2 text-gray-400" />
                            <span>{empleo.salario}</span>
                        </div>
                    )}

                    <div className="flex items-center text-gray-600">
                        <Calendar size={18} className="mr-2 text-gray-400" />
                        <span>Publicado recientemente</span>
                    </div>
                </div>
            </Card>

            {/* Contenido del empleo */}
            <Card className="p-8">
                <h2 className="text-xl font-bold mb-4">Descripción del puesto</h2>

                <div
                    className="prose prose-gray max-w-none"
                    dangerouslySetInnerHTML={{ __html: empleo.descripcion }}
                />

                <div className="mt-8 pt-6 border-t border-gray-100">
                    {!showApplicationForm ? (
                        <Button 
                            onClick={() => setShowApplicationForm(true)}
                            color="primary" 
                            size="lg" 
                            className="w-full sm:w-auto"
                        >
                            Aplicar a esta oferta
                        </Button>
                    ) : (
                        <div>
                            <h3 className="text-xl font-semibold mb-4">Completa tu postulación</h3>
                            <Form.Root onSubmit={handleSubmit} className="space-y-4">
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <Form.Field name="nombre" className="space-y-2">
                                        <div className="flex items-baseline justify-between">
                                            <Form.Label className="text-sm font-medium">Nombre*</Form.Label>
                                            <Form.Message className="text-xs text-red-500" match="valueMissing">
                                                Campo requerido
                                            </Form.Message>
                                        </div>
                                        <Form.Control asChild>
                                            <input
                                                className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none"
                                                type="text"
                                                value={formData.nombre}
                                                onChange={handleInputChange}
                                                placeholder="Tu nombre"
                                                required
                                            />
                                        </Form.Control>
                                    </Form.Field>
                                    
                                    <Form.Field name="apellidos" className="space-y-2">
                                        <div className="flex items-baseline justify-between">
                                            <Form.Label className="text-sm font-medium">Apellidos*</Form.Label>
                                            <Form.Message className="text-xs text-red-500" match="valueMissing">
                                                Campo requerido
                                            </Form.Message>
                                        </div>
                                        <Form.Control asChild>
                                            <input
                                                className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none"
                                                type="text"
                                                name="apellidos"
                                                value={formData.apellidos}
                                                onChange={handleInputChange}
                                                placeholder="Tus apellidos"
                                                required
                                            />
                                        </Form.Control>
                                    </Form.Field>
                                </div>
                                
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <Form.Field name="email" className="space-y-2">
                                        <div className="flex items-baseline justify-between">
                                            <Form.Label className="text-sm font-medium">Email*</Form.Label>
                                            <Form.Message className="text-xs text-red-500" match="valueMissing">
                                                Campo requerido
                                            </Form.Message>
                                            <Form.Message className="text-xs text-red-500" match="typeMismatch">
                                                Email inválido
                                            </Form.Message>
                                        </div>
                                        <Form.Control asChild>
                                            <input
                                                className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none"
                                                type="email"
                                                name="email"
                                                value={formData.email}
                                                onChange={handleInputChange}
                                                placeholder="ejemplo@correo.com"
                                                required
                                            />
                                        </Form.Control>
                                    </Form.Field>
                                    
                                    <Form.Field name="telefono" className="space-y-2">
                                        <div className="flex items-baseline justify-between">
                                            <Form.Label className="text-sm font-medium">Teléfono*</Form.Label>
                                            <Form.Message className="text-xs text-red-500" match="valueMissing">
                                                Campo requerido
                                            </Form.Message>
                                        </div>
                                        <Form.Control asChild>
                                            <input
                                                className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none"
                                                type="tel"
                                                name="telefono"
                                                value={formData.telefono}
                                                onChange={handleInputChange}
                                                placeholder="+34 600 000 000"
                                                required
                                            />
                                        </Form.Control>
                                    </Form.Field>
                                </div>
                                
                                <Form.Field name="mensaje" className="space-y-2">
                                    <Form.Label className="text-sm font-medium">
                                        ¿Por qué te interesa este puesto?
                                    </Form.Label>
                                    <Form.Control asChild>
                                        <textarea
                                            className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none"
                                            name="mensaje"
                                            value={formData.mensaje}
                                            onChange={handleInputChange}
                                            placeholder="Cuéntanos por qué te interesa este puesto y qué puedes aportar"
                                            rows={4}
                                        />
                                    </Form.Control>
                                </Form.Field>
                                
                                <div className="space-y-2">
                                    <Label.Root htmlFor="cv-upload" className="text-sm font-medium">
                                        Curriculum Vitae (PDF)*
                                    </Label.Root>
                                    <div className="flex items-center space-x-2">
                                        <label
                                            htmlFor="cv-upload"
                                            className="cursor-pointer px-4 py-2 border border-gray-300 rounded-md flex items-center justify-center hover:border-gray-400 transition-colors"
                                        >
                                            <Upload size={16} className="mr-2" />
                                            Subir CV
                                        </label>
                                        <input
                                            id="cv-upload"
                                            type="file"
                                            accept=".pdf"
                                            onChange={handleFileChange}
                                            className="hidden"
                                        />
                                        <span className="text-sm text-gray-500">
                                            {cvFileName || "Ningún archivo seleccionado (PDF, máx 5MB)"}
                                        </span>
                                    </div>
                                </div>
                                
                                <div className="flex items-center space-x-3 pt-4">
                                    <Form.Submit asChild>
                                        <Button
                                            disabled={submitLoading}
                                            className="w-full sm:w-auto"
                                        >
                                            {submitLoading ? (
                                                <div className="flex items-center">
                                                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                    </svg>
                                                    Enviando...
                                                </div>
                                            ) : submitSuccess ? "¡Enviado con éxito!" : "Enviar postulación"}
                                        </Button>
                                    </Form.Submit>
                                    <Button
                                        type="button"
                                        variant="outline"
                                        onClick={() => setShowApplicationForm(false)}
                                        disabled={submitLoading}
                                    >
                                        Cancelar
                                    </Button>
                                </div>
                            </Form.Root>
                        </div>
                    )}
                </div>
            </Card>
        </div>
    );
}