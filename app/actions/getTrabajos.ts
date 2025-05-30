'use server';

import { supabase } from "@/app/lib/supabase";
import { Trabajo } from "@/types";

export async function getTrabajosActivos(): Promise<Trabajo[]> {
    const { data, error } = await supabase
        .from("trabajos")
        .select("*")
        .eq("activo", true)
        .order("fecha_publicacion", { ascending: false });

    if (error) {
        console.error("Error al obtener trabajos:", error.message);
        return [];
    }

    return data as Trabajo[];
}
