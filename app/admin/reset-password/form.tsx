// app/admin/reset-password/form.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { supabase } from "@/app/lib/supabase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Form, FormField, FormItem, FormLabel, FormMessage, FormControl,
} from "@/components/ui/form";

const schema = z.object({
    password: z.string().min(6),
    confirmPassword: z.string().min(6),
}).refine((data) => data.password === data.confirmPassword, {
    message: "Las contraseñas no coinciden",
    path: ["confirmPassword"],
});

type FormData = z.infer<typeof schema>;

export default function ResetPasswordForm() {
    const router = useRouter();
    const [error, setError] = useState("");
    const [success, setSuccess] = useState(false);

    const form = useForm<FormData>({
        resolver: zodResolver(schema),
        defaultValues: { password: "", confirmPassword: "" },
    });

    const onSubmit = async (values: FormData) => {
        const { error } = await supabase.auth.updateUser({ password: values.password });
        if (error) {
            setError("Error al actualizar contraseña.");
        } else {
            setSuccess(true);
            await supabase.auth.signOut();
            setTimeout(() => router.push("/admin"), 3000);
        }
    };

    if (success) {
        return (
            <div className="text-center p-8 text-green-600">
                ¡Contraseña actualizada! Redirigiendo...
            </div>
        );
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 max-w-md mx-auto mt-12">
                <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Nueva Contraseña</FormLabel>
                            <FormControl>
                                <Input type="password" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="confirmPassword"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Confirmar Contraseña</FormLabel>
                            <FormControl>
                                <Input type="password" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                {error && <p className="text-red-600 font-bold">{error}</p>}
                <Button type="submit" className="w-full">Actualizar Contraseña</Button>
            </form>
        </Form>
    );
}
