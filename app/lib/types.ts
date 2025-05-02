export interface Empleo {
    id: string;
    titulo: string;
    empresa: string;
    ubicacion: string;
    modalidad: string;
    salario: string;
    descripcion: string;
}

export interface ApplicationFormData {
    nombre: string;
    apellidos: string;
    email: string;
    telefono: string;
    mensaje: string;
    cv_url: string;
}

export type ToastVariant = "default" | "destructive";