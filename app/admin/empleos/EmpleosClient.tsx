'use client';

import { Trabajo } from "@/types";
import TrabajoDialog from "@/app/components/Jobs/TrabajoDialog";

export default function EmpleosClient({ trabajos }: { trabajos: Trabajo[] }) {
    return (
        <div className="mx-auto p-6 space-y-8">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold">Gestión de Empleos</h1>
                <TrabajoDialog mode="create" />
            </div>

            {(!trabajos || trabajos.length === 0) ? (
                <p className="text-gray-500 text-center">No hay ofertas de empleo disponibles en este momento.</p>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {trabajos.map((trabajo) => (
                        <TrabajoDialog key={trabajo.id} trabajo={trabajo} mode="edit" />
                    ))}
                </div>
            )}
        </div>
    );
}
