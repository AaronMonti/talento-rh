'use server';

import { supabase } from "@/app/lib/supabase";
import { Trabajo } from "@/types";

// Función flexible que puede obtener todos o solo activos
export async function getTrabajos(soloActivos: boolean = false): Promise<Trabajo[]> {
    try {
        let query = supabase
            .from("trabajos")
            .select("*");

        // Solo aplicar filtro si soloActivos es true
        if (soloActivos) {
            query = query.eq("activo", true);
        }

        const { data, error } = await query.order("fecha_publicacion", { ascending: false });

        if (error) {
            // Solo mostrar error si no es durante el build (cuando NEXT_PHASE no es 'phase-production-build')
            if (process.env.NEXT_PHASE !== 'phase-production-build') {
                console.error("Error al obtener trabajos:", error.message);
            }
            return [];
        }

        return data as Trabajo[];
    } catch (error) {
        // Capturar errores de red o conexión (especialmente durante el build)
        // Durante el build, Supabase puede no estar disponible, esto es normal
        const isBuildPhase = process.env.NEXT_PHASE === 'phase-production-build';
        if (!isBuildPhase) {
            if (error instanceof Error) {
                console.error("Error al obtener trabajos:", error.message);
            } else {
                console.error("Error al obtener trabajos:", error);
            }
        }
        return [];
    }
}

// Mantener la función original para compatibilidad
export async function getTrabajosActivos(): Promise<Trabajo[]> {
    return getTrabajos(true);
}

// Nueva función específica para el dashboard
export async function getTrabajosParaDashboard(): Promise<Trabajo[]> {
    return getTrabajos(false);
}