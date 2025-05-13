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
import { useCvUpload } from "../hooks/useCvUpload";

export default function JobDetail() {
    const [submitLoading, setSubmitLoading] = useState(false);
    const [submitSuccess, setSubmitSuccess] = useState(false);
    const [formData, setFormData] = useState<Omit<ApplicationFormData, "cv_url">>({
        nombre: "",
        apellidos: "",
        email: "",
        telefono: "",
        mensaje: ""
    });
    const [toastOpen, setToastOpen] = useState(false);
    const [toastMessage, setToastMessage] = useState({ title: "", description: "", variant: "default" });
    const { handleFileChange, handleUpload, cvFile, filePath } = useCvUpload();

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
            handleUpload()
    
            // 2. Obtener la URL pública del archivo (si el bucket es público)
            const {
                data: publicUrlData,
            } = supabase.storage
                .from("cvs")
                .getPublicUrl(filePath);
    
            if (!publicUrlData.publicUrl) {
                throw new Error("No se pudo obtener la URL pública del CV");
            }
    
            // 3. Insertar postulación en Supabase
            const applicationData = {
                ...formData,
                cv_url: publicUrlData.publicUrl,
                empleo_id: '',
                empleo_titulo: "",
                empresa: "",
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
{/*     
                {cvFile && (
                    <button
                        onClick={handleUpload}
                        className="w-full mt-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                        Subir CV
                    </button>
                )} */}
            </div>
        );
    };

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
            

            {/* Contenido del empleo */}
            <Card className="p-8">
                <div className="mt-8 pt-6 border-t border-gray-100">
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
                                 <CVUploadSection />
                                </div>
                                
                                <div className="flex items-center space-x-3 pt-4">
                                    <Form.Submit asChild>
                                        <Button
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
                                        variant="outline"
                                        onClick={() => setShowApplicationForm(false)}
                                    >
                                        Cancelar
                                    </Button>
                                </div>
                            </Form.Root>
                        </div>
                </div>
            </Card>
        </div>
    );
}