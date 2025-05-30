export interface Trabajo {
    id: string;
    titulo_vacante: string;
    empresa: string;
    rubro: string | null;
    formacion: string | null;
    conocimientos_tecnicos: string | null;
    jornada_laboral: string | null;
    ubicacion: string | null;
    modalidad: "Presencial" | "Remoto" | "Híbrido";
    rango_salarial: string | null;
    descripcion: string;
    fecha_publicacion: string;
    activo: boolean;
}