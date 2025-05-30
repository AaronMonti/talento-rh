'use client'

import {
    Form,
    FormField,
    FormItem,
    FormLabel,
    FormControl,
    FormMessage
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useState } from "react"
import { toast } from "sonner"
import { supabase } from "../lib/supabase"
import { useRouter } from "next/navigation"
import CVDropzone from "@/components/ui/draganddrop"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

const formSchema = z.object({
    nombre_apellido: z.string().min(1, "Requerido"),
    localidad: z.string().min(1, "Requerido"),
    puesto_posicion: z.string().min(1, "Requerido"),
    estudios: z.string().min(1, "Requerido"),
    file: z
        .custom<File>()
        .refine((file) => !!file, {
            message: "Debe subir un archivo PDF"
        })
})

export default function CvUploadPage() {
    const router = useRouter()
    const [loading, setLoading] = useState(false)

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            nombre_apellido: "",
            localidad: "",
            puesto_posicion: "",
            estudios: "",
            file: undefined
        }
    })

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        setLoading(true)

        try {
            const file = values.file
            const path = `cvs/${Date.now()}-${values.nombre_apellido.replace(/\s+/g, "_")}.pdf`

            // Subir a Supabase Storage
            const { error: uploadError } = await supabase.storage
                .from("cv-uploads")
                .upload(path, file)

            if (uploadError) throw uploadError

            const { data: publicUrlData } = supabase.storage
                .from("cv-uploads")
                .getPublicUrl(path)

            // Guardar en tabla `cvs`
            const { error: insertError } = await supabase.from("cvs").insert([
                {
                    nombre_apellido: values.nombre_apellido,
                    localidad: values.localidad,
                    puesto_posicion: values.puesto_posicion,
                    estudios: values.estudios,
                    cv_url: publicUrlData.publicUrl,
                    cv_storage_path: path
                }
            ])

            if (insertError) throw insertError

            toast.success("CV enviado correctamente")
            router.push("/cv/success")
        } catch (err: unknown) {
            if (err instanceof Error) {
                console.error(err);
                toast.error("Error al enviar el CV: " + err.message);
            } else {
                console.error("Error desconocido", err);
                toast.error("Error desconocido al enviar el CV");
            }
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="max-w-xl mx-auto py-10">
            <Card>
                <CardHeader>
                    <CardTitle className="text-2xl">Carga tu CV</CardTitle>
                    <CardDescription className="text-md">Completa el siguiente formulario para enviar tu CV. Asegúrate de que el archivo esté en formato PDF.</CardDescription>
                </CardHeader>
                <CardContent>

                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                            <FormField
                                control={form.control}
                                name="nombre_apellido"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Nombre y Apellido</FormLabel>
                                        <FormControl>
                                            <Input {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="localidad"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Localidad</FormLabel>
                                        <FormControl>
                                            <Input {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="puesto_posicion"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Puesto o Posición</FormLabel>
                                        <FormControl>
                                            <Input {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="estudios"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Estudios</FormLabel>
                                        <FormControl>
                                            <Textarea {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="file"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>CV (PDF)</FormLabel>
                                        <FormControl>
                                            <CVDropzone
                                                file={field.value}
                                                error={form.formState.errors.file?.message}
                                                onFileDrop={(file: File) => field.onChange(file)}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <Button className="w-full" type="submit" disabled={loading}>
                                {loading ? "Subiendo..." : "Enviar CV"}
                            </Button>
                        </form>
                    </Form>
                </CardContent>
            </Card>
        </div>
    )
}
