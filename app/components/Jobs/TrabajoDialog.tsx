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
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Trabajo } from "@/types";
import { Building, CircleDollarSign, MapPin } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Switch } from "@/components/ui/switch";
import { supabase } from "@/app/lib/supabase";

const formSchema = z.object({
    titulo_vacante: z.string(),
    empresa: z.string(),
    rubro: z.string(),
    formacion: z.string(),
    conocimientos_tecnicos: z.string(),
    jornada_laboral: z.string(),
    ubicacion: z.string(),
    modalidad: z.string(),
    rango_salarial: z.object({
        desde: z.string().optional(),
        hasta: z.string().optional(),
        moneda: z.enum(["ARS", "USD"]),
    }),
    descripcion: z.string(),
    activo: z.boolean(),
});

type FormValues = z.infer<typeof formSchema>;

interface TrabajoDialogProps {
    mode: "create" | "edit";
    trabajo?: Trabajo;
}

export default function TrabajoDialog({ mode, trabajo }: TrabajoDialogProps) {
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
            modalidad: trabajo?.modalidad ?? "",
            rango_salarial: defaultRango,
            descripcion: trabajo?.descripcion ?? "",
            activo: trabajo?.activo ?? true,
        },
    });

    const getModalidadColor = (modalidad: string) => {
        switch (modalidad.toLowerCase()) {
            case "remoto":
                return "bg-green-100 text-green-800";
            case "presencial":
                return "bg-blue-100 text-blue-800";
            case "híbrido":
                return "bg-purple-100 text-purple-800";
            default:
                return "bg-gray-100 text-gray-800";
        }
    };

    async function onSubmit(data: FormValues) {
        const { desde, hasta, moneda } = data.rango_salarial;
        let rango = "";
        if (desde && hasta) {
            rango = `$${formatNumber(desde)} - $${formatNumber(hasta)} ${moneda}`;
        } else if (desde) {
            rango = `$${formatNumber(desde)} ${moneda}`;
        }

        const payload = {
            ...data,
            rango_salarial: rango,
        };

        if (mode === "edit" && trabajo?.id) {
            // Actualizar
            const { error } = await supabase
                .from("trabajos")
                .update(payload)
                .eq("id", trabajo.id);

            if (error) {
                console.error("Error al actualizar:", error.message);
            } else {
                console.log("Trabajo actualizado");
                setEditMode(false);
            }
        } else {
            // Crear nuevo
            const { error } = await supabase.from("trabajos").insert([payload]);
            if (error) {
                console.error("Error al crear:", error.message);
            } else {
                console.log("Trabajo creado");
                setOpen(false);
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
                    <Card className="h-full transition-shadow hover:shadow-md hover:border-primary cursor-pointer">
                        <CardContent className="p-6 flex flex-col h-full">
                            <div className="flex justify-between mb-3">
                                <Badge className={getModalidadColor(trabajo?.modalidad ?? "")}>
                                    {trabajo?.modalidad}
                                </Badge>
                            </div>
                            <h2 className="text-xl font-semibold mb-1">
                                {trabajo?.titulo_vacante}
                            </h2>
                            <div className="flex items-center text-sm text-gray-600 mb-2">
                                <Building size={16} className="mr-1" />
                                {trabajo?.empresa}
                            </div>
                            <div className="space-y-1 mb-4 text-sm text-gray-500">
                                {trabajo?.ubicacion && (
                                    <div className="flex items-center">
                                        <MapPin size={16} className="mr-1" />
                                        {trabajo.ubicacion}
                                    </div>
                                )}
                                {trabajo?.rango_salarial && (
                                    <div className="flex items-center">
                                        <CircleDollarSign size={16} className="mr-1" />
                                        {trabajo.rango_salarial}
                                    </div>
                                )}
                            </div>
                            <div className="mt-auto pt-4 border-t border-gray-100 text-primary text-sm font-medium">
                                Ver detalles →
                            </div>
                        </CardContent>
                    </Card>
                ) : (
                    <Button>Crear Trabajo</Button>
                )}
            </DialogTrigger>

            <DialogContent className="w-full max-w-4xl sm:max-w-3xl md:max-w-5xl lg:max-w-6xl max-h-[90vh] overflow-y-auto px-4 sm:px-6 lg:px-8">
                <DialogHeader>
                    <DialogTitle>
                        {mode === "edit" ? trabajo?.titulo_vacante : "Crear nuevo trabajo"}
                    </DialogTitle>
                    <DialogDescription>
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
                                    <FormLabel className="mb-0">Activo</FormLabel>
                                    <FormControl>
                                        <Switch
                                            checked={field.value}
                                            onCheckedChange={field.onChange}
                                            disabled={mode === "edit" ? !editMode : false}
                                        />
                                    </FormControl>
                                </FormItem>
                            )}
                        />

                        {Object.keys(formSchema.shape)
                            .filter((field) => field !== "rango_salarial" && field !== "activo")
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
                                                    <FormLabel className="capitalize">
                                                        {field.replace(/_/g, " ")}
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
                                                        />
                                                    </FormControl>
                                                </FormItem>
                                            );
                                        }

                                        return (
                                            <FormItem>
                                                <FormLabel className="capitalize">
                                                    {field.replace(/_/g, " ")}
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
                                                    />
                                                </FormControl>
                                            </FormItem>
                                        );
                                    }}
                                />
                            ))}

                        <div className="flex flex-col md:flex-row gap-4">
                            <FormField
                                control={form.control}
                                name="rango_salarial.desde"
                                render={({ field }) => (
                                    <FormItem className="w-full md:w-1/3">
                                        <FormLabel>Salario Desde</FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder="Ej: 800000"
                                                value={field.value}
                                                onChange={field.onChange}
                                                disabled={mode === "edit" ? !editMode : false}
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
                                        <FormLabel>Salario Hasta</FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder="Ej: 1000000"
                                                value={field.value}
                                                onChange={field.onChange}
                                                disabled={mode === "edit" ? !editMode : false}
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
                                        <FormLabel>Moneda</FormLabel>
                                        <FormControl>
                                            <select
                                                className="w-full border border-input rounded-md px-3 py-2 text-sm bg-background"
                                                value={field.value}
                                                onChange={(e) => field.onChange(e.target.value)}
                                                disabled={mode === "edit" ? !editMode : false}
                                            >
                                                <option value="ARS">ARS</option>
                                                <option value="USD">USD</option>
                                            </select>
                                        </FormControl>
                                    </FormItem>
                                )}
                            />
                        </div>

                        <DialogFooter className="mt-6 flex justify-start gap-4">
                            {mode === "edit" ? (
                                !editMode ? (
                                    <Button
                                        type="button"
                                        onClick={() => setEditMode(true)}
                                        className="text-lg px-6 py-3"
                                    >
                                        Editar
                                    </Button>
                                ) : (
                                    <div className="flex gap-4">
                                        <Button
                                            type="button"
                                            variant="secondary"
                                            onClick={() => setEditMode(false)}
                                            className="text-lg px-6 py-3"
                                        >
                                            Cancelar
                                        </Button>
                                        <Button type="submit" className="text-lg px-6 py-3">
                                            Guardar
                                        </Button>
                                    </div>
                                )
                            ) : (
                                <Button type="submit" className="text-lg px-6 py-3">
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
