'use client';

import { Trabajo } from "@/types";
import TrabajoDialog from "@/app/components/Jobs/TrabajoDialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MapPin, Calendar, DollarSign, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/app/lib/supabase";
import { toast } from "sonner";
import { useState } from "react";
import {
    AlertDialog,
    AlertDialogTrigger,
    AlertDialogContent,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogCancel,
    AlertDialogAction,
} from "@/components/ui/alert-dialog";
import { Input } from "@/components/ui/input";

export default function EmpleosClient({ trabajos: initialTrabajos }: { trabajos: Trabajo[] }) {
    const [trabajos, setTrabajos] = useState<Trabajo[]>(initialTrabajos);
    const [searchTerm, setSearchTerm] = useState("");
    const [sortAsc, setSortAsc] = useState(true);

    const handleDelete = async (id: number) => {
        const { error } = await supabase
            .from("trabajos")
            .delete()
            .eq("id", id);

        if (error) {
            toast.error("Error al borrar trabajo: " + error.message);
        } else {
            toast.success("Trabajo borrado correctamente");
            setTrabajos((prev) => prev.filter((trabajo) => Number(trabajo.id) !== id));
        }
    };

    // Función para manejar la creación de un nuevo trabajo
    const handleCreate = (nuevoTrabajo: Trabajo) => {
        setTrabajos((prev) => [...prev, nuevoTrabajo]);
    };

    // Función para manejar la actualización de un trabajo existente
    const handleUpdate = (trabajoActualizado: Trabajo) => {
        setTrabajos((prev) =>
            prev.map((trabajo) =>
                trabajo.id === trabajoActualizado.id ? trabajoActualizado : trabajo
            )
        );
    };

    const filteredTrabajos = trabajos
        .filter((t) =>
            t.titulo_vacante
                ?.toLowerCase()
                .includes(searchTerm.toLowerCase()) ||
            t.ubicacion
                ?.toLowerCase()
                .includes(searchTerm.toLowerCase()) ||
            t.descripcion
                ?.toLowerCase()
                .includes(searchTerm.toLowerCase()) ||
            t.rango_salarial
                ?.toLowerCase()
                .includes(searchTerm.toLowerCase())
        )
        .sort((a, b) => {
            const dateA = new Date(a.fecha_publicacion).getTime();
            const dateB = new Date(b.fecha_publicacion).getTime();
            return sortAsc ? dateA - dateB : dateB - dateA;
        });

    return (
        <div className="space-y-6">
            <Card variant="neubrutalist" className="!p-4">
                <div className="flex items-center justify-between">
                    <h1 className="text-3xl font-bold text-primary uppercase tracking-wide">
                        Gestión de Empleos
                    </h1>
                    <TrabajoDialog mode="create" onCreate={handleCreate} />
                </div>
            </Card>

            {(!trabajos || trabajos.length === 0) ? (
                <Card variant="neubrutalist" className="!p-6">
                    <p className="text-center font-bold text-lg text-gray-600">
                        No hay ofertas de empleo disponibles en este momento.
                    </p>
                    <div className="flex justify-center mt-4">
                       <TrabajoDialog mode="create" onCreate={handleCreate} />
                    </div>
                </Card>
            ) : (
                <>
                    <Card variant="neubrutalist" className="!p-4 space-y-4">
                        <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
                            <Input
                                variant="brutalist"
                                type="text"
                                placeholder="Buscar por título, ubicación, descripción o salario..."
                                className="px-4 py-2 w-full md:w-1/2"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                            <Button
                                variant="brutalist"
                                className="bg-[#8be9fd] hover:bg-[#50fa7b] text-black font-bold uppercase"
                                onClick={() => setSortAsc(!sortAsc)}
                            >
                                Ordenar por fecha: {sortAsc ? "Ascendente" : "Descendente"}
                            </Button>
                        </div>
                    </Card>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredTrabajos.map((trabajo) => (
                            <Card key={trabajo.id} variant="neubrutalist">
                                <CardHeader>
                                    <CardTitle className="text-xl font-black uppercase tracking-wide text-black">
                                        {trabajo.titulo_vacante}
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-3">
                                    <div className="flex items-center gap-2 font-bold">
                                        <MapPin className="w-4 h-4 text-primary" />
                                        <span className="text-sm">{trabajo.ubicacion}</span>
                                    </div>

                                    <div className="flex items-center gap-2 font-bold">
                                        <Calendar className="w-4 h-4 text-primary" />
                                        <span className="text-sm">
                                            Publicado: {new Date(trabajo.fecha_publicacion).toLocaleDateString('es-AR')}
                                        </span>
                                    </div>

                                    {trabajo.rango_salarial && (
                                        <div className="flex items-center gap-2 font-bold">
                                            <DollarSign className="w-4 h-4 text-primary" />
                                            <span className="text-sm">{trabajo.rango_salarial}</span>
                                        </div>
                                    )}

                                    <div className="bg-gray-100 p-3 border-2 border-black">
                                        <p className="text-sm font-bold text-gray-700 line-clamp-3">
                                            {trabajo.descripcion}
                                        </p>
                                    </div>

                                    <div className="flex justify-between items-center pt-2 gap-2">
                                        <span className={`px-3 py-1 text-xs font-black uppercase border-2 border-black ${trabajo.activo
                                            ? 'bg-green-300 text-green-800'
                                            : 'bg-red-300 text-red-800'
                                            }`}>
                                            {trabajo.activo ? 'Activo' : 'Inactivo'}
                                        </span>

                                        <div className="flex gap-2">
                                            <TrabajoDialog 
                                                trabajo={trabajo} 
                                                mode="edit" 
                                                onUpdate={handleUpdate}
                                            />

                                            <AlertDialog>
                                                <AlertDialogTrigger asChild>
                                                    <Button
                                                        variant="brutalist"
                                                        size="sm"
                                                        className="rounded-none flex items-center gap-1 bg-[#ff97d9] hover:bg-[#e44f9c] text-black"
                                                    >
                                                        <Trash2 className="w-3 h-3" />
                                                    </Button>
                                                </AlertDialogTrigger>
                                                <AlertDialogContent variant="neubrutalist">
                                                    <AlertDialogHeader variant="neubrutalist">
                                                        <AlertDialogTitle variant="neubrutalist">
                                                            ¿Estás seguro que deseas borrar este trabajo?
                                                        </AlertDialogTitle>
                                                        <AlertDialogDescription variant="neubrutalist">
                                                            Esta acción no se puede deshacer. El trabajo se eliminará permanentemente junto con todas sus postulaciones asociadas.
                                                        </AlertDialogDescription>
                                                    </AlertDialogHeader>
                                                    <AlertDialogFooter variant="neubrutalist">
                                                        <AlertDialogCancel variant="neubrutalist">Cancelar</AlertDialogCancel>
                                                        <AlertDialogAction
                                                            variant="neubrutalist"
                                                            onClick={() => handleDelete(Number(trabajo.id))}
                                                        >
                                                            Borrar
                                                        </AlertDialogAction>
                                                    </AlertDialogFooter>
                                                </AlertDialogContent>
                                            </AlertDialog>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </>
            )}
        </div>
    );
}