'use server';

import { supabase } from "@/app/lib/supabase";
import { Trabajo } from "@/types";

// Función flexible que puede obtener todos o solo activos
export async function getTrabajos(soloActivos: boolean = false): Promise<Trabajo[]> {
    let query = supabase
        .from("trabajos")
        .select("*");

    // Solo aplicar filtro si soloActivos es true
    if (soloActivos) {
        query = query.eq("activo", true);
    }

    const { data, error } = await query.order("fecha_publicacion", { ascending: false });

    if (error) {
        console.error("Error al obtener trabajos:", error.message);
        return [];
    }

    return data as Trabajo[];
}

// Mantener la función original para compatibilidad
export async function getTrabajosActivos(): Promise<Trabajo[]> {
    return getTrabajos(true);
}

// Nueva función específica para el dashboard
export async function getTrabajosParaDashboard(): Promise<Trabajo[]> {
    return getTrabajos(false);
}