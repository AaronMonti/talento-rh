"use client";

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
import { Switch } from "@/components/ui/switch";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
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

type TrabajoFormProps = {
    initialValues?: FormValues;
    onSubmit: (data: FormValues) => Promise<void>;
    submitLabel: string;
    disabled?: boolean;
};

export function TrabajoForm({
    initialValues,
    onSubmit,
    submitLabel,
    disabled = false,
}: TrabajoFormProps) {
    const form = useForm<FormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: initialValues ?? {
            titulo_vacante: "",
            empresa: "",
            rubro: "",
            formacion: "",
            conocimientos_tecnicos: "",
            jornada_laboral: "",
            ubicacion: "",
            modalidad: "",
            rango_salarial: { desde: "", hasta: "", moneda: "ARS" },
            descripcion: "",
            activo: true,
        },
    });

    // Formatear números igual que antes
    function formatNumber(numStr: string) {
        const num = Number(numStr.replace(/\D/g, ""));
        if (isNaN(num)) return numStr;
        return num.toLocaleString("es-AR");
    }

    async function handleSubmit(data: FormValues) {
        // Construir string rango salarial
        const { desde, hasta, moneda } = data.rango_salarial;
        let rango = "";
        if (desde && hasta) {
            rango = `$${formatNumber(desde)} - $${formatNumber(hasta)} ${moneda}`;
        } else if (desde) {
            rango = `$${formatNumber(desde)} ${moneda}`;
        }

        await onSubmit({ ...data, rango_salarial: { ...data.rango_salarial } });
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
                <FormField
                    control={form.control}
                    name="activo"
                    render={({ field }) => (
                        <FormItem className="flex items-center space-x-2">
                            <FormLabel className="mb-0">Activo</FormLabel>
                            <FormControl>
                                <Switch checked={field.value} onCheckedChange={field.onChange} disabled={disabled} />
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
                                if (field === "descripcion" || field === "conocimientos_tecnicos") {
                                    return (
                                        <FormItem>
                                            <FormLabel className="capitalize">{field.replace(/_/g, " ")}</FormLabel>
                                            <FormControl>
                                                <Textarea
                                                    value={typeof fieldProps.value === "string" ? fieldProps.value : ""}
                                                    onChange={(e) => fieldProps.onChange(e.target.value)}
                                                    disabled={disabled}
                                                />
                                            </FormControl>
                                        </FormItem>
                                    );
                                }

                                return (
                                    <FormItem>
                                        <FormLabel className="capitalize">{field.replace(/_/g, " ")}</FormLabel>
                                        <FormControl>
                                            <Input
                                                value={typeof fieldProps.value === "string" ? fieldProps.value : ""}
                                                onChange={(e) => fieldProps.onChange(e.target.value)}
                                                disabled={disabled}
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
                                        disabled={disabled}
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
                                        disabled={disabled}
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
                                        disabled={disabled}
                                    >
                                        <option value="ARS">ARS</option>
                                        <option value="USD">USD</option>
                                    </select>
                                </FormControl>
                            </FormItem>
                        )}
                    />
                </div>

                <div className="flex justify-end mt-6">
                    <Button type="submit" disabled={disabled}>
                        {submitLabel}
                    </Button>
                </div>
            </form>
        </Form>
    );
}
