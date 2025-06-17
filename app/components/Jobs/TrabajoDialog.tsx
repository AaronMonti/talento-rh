"use client";

import { useState } from "react";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import {
    Form,
    FormField,
    FormItem,
    FormLabel,
    FormControl,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Trabajo } from "@/types";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Switch } from "@/components/ui/switch";
import { supabase } from "@/app/lib/supabase";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";

const formSchema = z.object({
    titulo_vacante: z.string(),
    empresa: z.string(),
    rubro: z.string(),
    formacion: z.string(),
    conocimientos_tecnicos: z.string(),
    jornada_laboral: z.string(),
    ubicacion: z.string(),
    modalidad: z.enum(["Presencial", "Remoto", "Híbrido"]),
    rango_salarial: z.object({
        desde: z.string().optional(),
        hasta: z.string().optional(),
        moneda: z.enum(["ARS", "USD"]),
    }),
    descripcion: z.string(),
    activo: z.boolean(),
});

type FormValues = z.infer<typeof formSchema>;

type TrabajoDialogProps = {
    mode: 'create' | 'edit';
    trabajo?: Trabajo;
    onCreate?: (nuevoTrabajo: Trabajo) => void;
    onUpdate?: (trabajoActualizado: Trabajo) => void; // Nueva prop para actualizar
};

export default function TrabajoDialog({ mode, trabajo, onCreate, onUpdate }: TrabajoDialogProps) {
    const [open, setOpen] = useState(false);
    const [editMode, setEditMode] = useState(mode === "create");

    // Para modo edición, parseamos rango_salarial
    const defaultRango: { desde?: string; hasta?: string; moneda?: "ARS" | "USD" } =
        (() => {
            if (!trabajo?.rango_salarial) {
                return { desde: "", hasta: "", moneda: "ARS" };
            }
            const match = trabajo.rango_salarial.match(
                /\$?([\d\.\,]+)\s*-\s*\$?([\d\.\,]+)\s*(ARS|USD)/i
            );
            if (match) {
                const moneda = match[3].toUpperCase();
                const isMonedaValida = moneda === "ARS" || moneda === "USD";
                return {
                    desde: match[1].replace(/\./g, "").replace(/,/g, ""),
                    hasta: match[2].replace(/\./g, "").replace(/,/g, ""),
                    moneda: isMonedaValida ? (moneda as "ARS" | "USD") : "ARS",
                };
            }
            return { desde: "", hasta: "", moneda: "ARS" };
        })();

    const form = useForm<FormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            titulo_vacante: trabajo?.titulo_vacante ?? "",
            empresa: trabajo?.empresa ?? "",
            rubro: trabajo?.rubro ?? "",
            formacion: trabajo?.formacion ?? "",
            conocimientos_tecnicos: trabajo?.conocimientos_tecnicos ?? "",
            jornada_laboral: trabajo?.jornada_laboral ?? "",
            ubicacion: trabajo?.ubicacion ?? "",
            modalidad: (trabajo?.modalidad as "Presencial" | "Remoto" | "Híbrido") ?? "Presencial",
            rango_salarial: defaultRango,
            descripcion: trabajo?.descripcion ?? "",
            activo: trabajo?.activo ?? true,
        },
    });

    async function onSubmit(data: FormValues) {
        const { desde, hasta, moneda } = data.rango_salarial;
        let rango = "";
        if (desde && hasta) {
            rango = `$${formatNumber(desde)} - $${formatNumber(hasta)} ${moneda}`;
        } else if (desde) {
            rango = `$${formatNumber(desde)} ${moneda}`;
        }

        const payload = {
            titulo_vacante: data.titulo_vacante,
            empresa: data.empresa,
            rubro: data.rubro,
            formacion: data.formacion,
            conocimientos_tecnicos: data.conocimientos_tecnicos,
            jornada_laboral: data.jornada_laboral,
            ubicacion: data.ubicacion,
            modalidad: data.modalidad,
            rango_salarial: rango,
            descripcion: data.descripcion,
            activo: data.activo,
        };

        if (mode === "edit" && trabajo?.id) {
            // Primero verificamos si el trabajo existe y obtenemos los datos actuales
            const { data: existingTrabajo, error: fetchError } = await supabase
                .from("trabajos")
                .select("*")
                .eq("id", trabajo.id)
                .maybeSingle();

            if (fetchError) {
                toast.error("Error al buscar el trabajo: " + fetchError.message);
                return;
            }

            if (!existingTrabajo) {
                toast.error("No se encontró el trabajo para actualizar");
                return;
            }

            const updateResult = await supabase
                .from("trabajos")
                .update(payload)
                .eq("id", trabajo.id);

            if (updateResult.error) {
                toast.error("Error al actualizar trabajo: " + updateResult.error.message);
                return;
            }

            // Ahora verificamos si realmente cambió en la base de datos
            const { data: updatedData, error: selectError } = await supabase
                .from("trabajos")
                .select("*")
                .eq("id", trabajo.id)
                .maybeSingle();

            if (selectError) {
                toast.error("Trabajo actualizado pero error al obtener datos: " + selectError.message);
                setEditMode(false);
                setOpen(false);
                return;
            }

            if (!updatedData) {
                toast.error("Trabajo actualizado pero no se pudieron obtener los datos");
                setEditMode(false);
                setOpen(false);
                return;
            }


            toast.success("Trabajo actualizado correctamente");

            if (onUpdate) {
                onUpdate(updatedData as Trabajo);
            }

            setEditMode(false);
            setOpen(false);
        } else {
            // Crear nuevo (sin cambios)
            const { data: newData, error } = await supabase
                .from("trabajos")
                .insert([payload])
                .select()
                .single();

            if (error) {
                toast.error("Error al crear trabajo: " + error.message);
            } else {
                toast.success("Trabajo creado correctamente");

                if (onCreate && newData) {
                    onCreate(newData as Trabajo);
                }

                setOpen(false);
                form.reset();
            }
        }
    }

    function formatNumber(numStr: string) {
        const num = Number(numStr.replace(/\D/g, ""));
        if (isNaN(num)) return numStr;
        return num.toLocaleString("es-AR");
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                {mode === "edit" ? (
                    <Button variant="brutalist" size="sm" className="rounded-none flex items-center gap-1 bg-[#dd63ff] hover:bg-[#bd13ec] text-white">
                        Editar
                    </Button>
                ) : (
                    <Button variant="brutalist" className="bg-[#e44f9c] hover:bg-[#bd13ec] text-white">Crear Trabajo</Button>
                )}
            </DialogTrigger>

            <DialogContent className="w-full max-w-4xl sm:max-w-3xl md:max-w-5xl lg:max-w-6xl max-h-[90vh] overflow-y-auto px-4 sm:px-6 lg:px-8" variant="brutalist">
                <DialogHeader variant="brutalist">
                    <DialogTitle variant="brutalist">
                        {mode === "edit" ? trabajo?.titulo_vacante : "Crear nuevo trabajo"}
                    </DialogTitle>
                    <DialogDescription variant="brutalist">
                        {mode === "edit" ? "Detalles del trabajo" : "Complete los datos para crear el trabajo"}
                    </DialogDescription>
                </DialogHeader>

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        {/* Switch al inicio */}
                        <FormField
                            control={form.control}
                            name="activo"
                            render={({ field }) => (
                                <FormItem className="flex items-center space-x-2">
                                    <FormLabel variant="brutalist" className="mb-0">Activo</FormLabel>
                                    <FormControl>
                                        <Switch
                                            variant="brutalist"
                                            checked={field.value}
                                            onCheckedChange={field.onChange}
                                            disabled={mode === "edit" ? !editMode : false}
                                        />
                                    </FormControl>
                                </FormItem>
                            )}
                        />

                        {Object.keys(formSchema.shape)
                            .filter((field) => field !== "rango_salarial" && field !== "activo" && field !== "modalidad")
                            .map((field) => (
                                <FormField
                                    key={field}
                                    control={form.control}
                                    name={field as keyof FormValues}
                                    render={({ field: fieldProps }) => {
                                        if (
                                            field === "descripcion" ||
                                            field === "conocimientos_tecnicos"
                                        ) {
                                            return (
                                                <FormItem>
                                                    <FormLabel variant="brutalist" className="capitalize">
                                                        {typeof field === "string" ? field.replace(/_/g, " ") : ""}
                                                    </FormLabel>
                                                    <FormControl>
                                                        <Textarea
                                                            value={
                                                                typeof fieldProps.value === "string"
                                                                    ? fieldProps.value
                                                                    : ""
                                                            }
                                                            onChange={(e) => fieldProps.onChange(e.target.value)}
                                                            disabled={mode === "edit" ? !editMode : false}
                                                            variant="brutalist"
                                                        />
                                                    </FormControl>
                                                </FormItem>
                                            );
                                        }

                                        return (
                                            <FormItem>
                                                <FormLabel variant="brutalist" className="capitalize">
                                                    {typeof field === "string" ? field.replace(/_/g, " ") : ""}
                                                </FormLabel>
                                                <FormControl>
                                                    <Input
                                                        value={
                                                            typeof fieldProps.value === "string"
                                                                ? fieldProps.value
                                                                : ""
                                                        }
                                                        onChange={(e) => fieldProps.onChange(e.target.value)}
                                                        disabled={mode === "edit" ? !editMode : false}
                                                        variant="brutalist"
                                                    />
                                                </FormControl>
                                            </FormItem>
                                        );
                                    }}
                                />
                            ))}

                        {/* Campo de Modalidad con Select */}
                        <FormField
                            control={form.control}
                            name="modalidad"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel variant="brutalist">Modalidad</FormLabel>
                                    <FormControl>
                                        <Select
                                            value={field.value}
                                            onValueChange={field.onChange}
                                            disabled={mode === "edit" ? !editMode : false}
                                        >
                                            <SelectTrigger className="w-full" variant="brutalist">
                                                <SelectValue placeholder="Seleccionar modalidad" />
                                            </SelectTrigger>
                                            <SelectContent variant="brutalist">
                                                <SelectItem value="Presencial" variant="brutalist">Presencial</SelectItem>
                                                <SelectItem value="Remoto" variant="brutalist">Remoto</SelectItem>
                                                <SelectItem value="Híbrido" variant="brutalist">Híbrido</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </FormControl>
                                </FormItem>
                            )}
                        />

                        <div className="flex gap-4">
                            <FormField
                                control={form.control}
                                name="rango_salarial.desde"
                                render={({ field }) => (
                                    <FormItem className="w-full md:w-1/3">
                                        <FormLabel variant="brutalist">Salario Desde</FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder="Ej: 800000"
                                                value={field.value}
                                                onChange={field.onChange}
                                                disabled={mode === "edit" ? !editMode : false}
                                                variant="brutalist"
                                            />
                                        </FormControl>
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="rango_salarial.hasta"
                                render={({ field }) => (
                                    <FormItem className="w-full md:w-1/3">
                                        <FormLabel variant="brutalist">Salario Hasta</FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder="Ej: 1000000"
                                                value={field.value}
                                                onChange={field.onChange}
                                                disabled={mode === "edit" ? !editMode : false}
                                                variant="brutalist"
                                            />
                                        </FormControl>
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="rango_salarial.moneda"
                                render={({ field }) => (
                                    <FormItem className="w-full md:w-1/3">
                                        <FormLabel variant="brutalist">Moneda</FormLabel>
                                        <FormControl>
                                            <Select
                                                value={field.value}
                                                onValueChange={field.onChange}
                                                disabled={mode === "edit" ? !editMode : false}
                                            >
                                                <SelectTrigger className="w-full" variant="brutalist">
                                                    <SelectValue placeholder="Seleccionar moneda" />
                                                </SelectTrigger>
                                                <SelectContent variant="brutalist">
                                                    <SelectItem value="ARS" variant="brutalist">ARS</SelectItem>
                                                    <SelectItem value="USD" variant="brutalist">USD</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </FormControl>
                                    </FormItem>
                                )}
                            />
                        </div>

                        <DialogFooter variant="brutalist">
                            {mode === "edit" ? (
                                !editMode ? (
                                    <Button
                                        type="button"
                                        variant="brutalist"
                                        onClick={() => setEditMode(true)}
                                        className="text-lg px-6 py-3 bg-[#ff69b4] hover:bg-[#e44f9c] text-white"
                                    >
                                        Editar
                                    </Button>
                                ) : (
                                    <div className="flex gap-4">
                                        <Button
                                            type="button"
                                            variant="brutalist"
                                            onClick={() => setEditMode(false)}
                                            className="text-lg px-6 py-3 bg-[#ff97d9] hover:bg-[#ff69b4] text-black"
                                        >
                                            Cancelar
                                        </Button>
                                        <Button variant="brutalist" type="submit" className="text-lg px-6 py-3 bg-[#bd13ec] hover:bg-[#e44f9c] text-white">
                                            Guardar
                                        </Button>
                                    </div>
                                )
                            ) : (
                                <Button variant="brutalist" type="submit" className="text-lg px-6 py-3 bg-[#bd13ec] hover:bg-[#e44f9c] text-white">
                                    Crear
                                </Button>
                            )}
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
}