"use client";

import { useEffect, useState, Suspense } from "react";
import { supabase } from "../../lib/supabase";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff } from "lucide-react";
import { motion, Transition, Variants } from "motion/react";
import { Button } from "@/components/ui/button";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardTitle } from "@/components/ui/card";

// Configuración dinámica para evitar prerenderizado
export const dynamic = "force-dynamic";
export const revalidate = 0;

const resetPasswordSchema = z.object({
    password: z.string().min(6, "La contraseña debe tener al menos 6 caracteres"),
    confirmPassword: z.string().min(6, "Por favor confirma tu contraseña"),
}).refine(data => data.password === data.confirmPassword, {
    message: "Las contraseñas no coinciden",
    path: ["confirmPassword"],
});

type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>;

const loadingContainerVariants: Variants = {
    start: { transition: { staggerChildren: 0.2 } },
    end: { transition: { staggerChildren: 0.2 } },
};

const loadingCircleVariants: Variants = {
    start: { y: "0%" },
    end: { y: "100%" },
};

const loadingCircleTransition: Transition = {
    duration: 0.5,
    repeat: Infinity,
    repeatType: "reverse",
    ease: "easeInOut",
};

function ResetPasswordContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [error, setError] = useState("");
    const [success, setSuccess] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [isValidSession, setIsValidSession] = useState<boolean | null>(null);
    const [mounted, setMounted] = useState(false);

    const form = useForm<ResetPasswordFormData>({
        resolver: zodResolver(resetPasswordSchema),
        defaultValues: {
            password: "",
            confirmPassword: "",
        },
    });

    useEffect(() => {
        setMounted(true);
    }, []);

    useEffect(() => {
        if (!mounted) return;

        const checkSession = async () => {
            try {
                // Verificar si hay una sesión de reset válida
                const { data } = await supabase.auth.getUser();

                if (data.user) {
                    setIsValidSession(true);
                } else {
                    // Verificar parámetros de URL para token de reset
                    const accessToken = searchParams.get("access_token");
                    const refreshToken = searchParams.get("refresh_token");

                    if (accessToken && refreshToken) {
                        // Establecer la sesión con los tokens
                        const { error } = await supabase.auth.setSession({
                            access_token: accessToken,
                            refresh_token: refreshToken,
                        });

                        if (error) {
                            console.error("Error al establecer sesión:", error);
                            setIsValidSession(false);
                        } else {
                            setIsValidSession(true);
                        }
                    } else {
                        setIsValidSession(false);
                    }
                }
            } catch (error) {
                console.error("Error al verificar sesión:", error);
                setIsValidSession(false);
            }
        };

        checkSession();
    }, [searchParams, mounted]);

    const onSubmit = async (values: ResetPasswordFormData) => {
        setError("");

        try {
            const { error } = await supabase.auth.updateUser({
                password: values.password,
            });

            if (error) {
                setError("Error al actualizar la contraseña. Por favor intenta de nuevo.");
                console.error("Error al actualizar contraseña:", error.message);
            } else {
                setSuccess(true);
                // Cerrar sesión después de actualizar la contraseña
                await supabase.auth.signOut();
                setTimeout(() => {
                    router.push("/admin");
                }, 3000);
            }
        } catch (error) {
            console.error("Error inesperado:", error);
            setError("Error inesperado. Por favor intenta de nuevo.");
        }
    };

    if (!mounted || isValidSession === null) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-white">
                <motion.div
                    className="flex gap-2"
                    variants={loadingContainerVariants}
                    initial="start"
                    animate="end"
                >
                    {[...Array(3)].map((_, i) => (
                        <motion.div
                            key={i}
                            className="w-4 h-4 rounded-full bg-primary"
                            variants={loadingCircleVariants}
                            transition={loadingCircleTransition}
                        />
                    ))}
                </motion.div>
            </div>
        );
    }

    if (!isValidSession) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-white px-4">
                <Card variant="neubrutalist" className="w-full max-w-md">
                    <CardTitle className="text-3xl font-black uppercase text-center tracking-wide mb-6 text-red-600">
                        Enlace Inválido
                    </CardTitle>
                    <CardContent className="text-center space-y-4">
                        <p className="text-gray-600">
                            El enlace de recuperación de contraseña ha expirado o no es válido.
                        </p>
                        <Button
                            onClick={() => router.push("/admin")}
                            variant="brutalist"
                            className="w-full bg-gray-800 hover:bg-gray-900 text-white"
                        >
                            Volver al Login
                        </Button>
                    </CardContent>
                </Card>
            </div>
        );
    }

    if (success) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-white px-4">
                <Card variant="neubrutalist" className="w-full max-w-md">
                    <CardTitle className="text-3xl font-black uppercase text-center tracking-wide mb-6 text-green-600">
                        ¡Contraseña Actualizada!
                    </CardTitle>
                    <CardContent className="text-center space-y-4">
                        <div className="bg-green-100 border-2 border-green-600 p-4 rounded">
                            <p className="text-green-700 font-bold">
                                Tu contraseña ha sido actualizada exitosamente.
                            </p>
                            <p className="text-green-600 text-sm mt-2">
                                Por seguridad, tu sesión se ha cerrado. Serás redirigido al login en unos segundos...
                            </p>
                        </div>
                        <motion.div
                            className="flex gap-2 justify-center"
                            variants={loadingContainerVariants}
                            initial="start"
                            animate="end"
                        >
                            {[...Array(3)].map((_, i) => (
                                <motion.div
                                    key={i}
                                    className="w-3 h-3 rounded-full bg-green-600"
                                    variants={loadingCircleVariants}
                                    transition={loadingCircleTransition}
                                />
                            ))}
                        </motion.div>
                    </CardContent>
                </Card>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-white px-4">
            <Card variant="neubrutalist" className="w-full max-w-md">
                <CardTitle className="text-3xl font-black uppercase text-center tracking-wide mb-6 text-primary">
                    Nueva Contraseña
                </CardTitle>
                <CardContent>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                            <div className="text-center mb-4">
                                <p className="text-gray-600 text-sm">
                                    Ingresa tu nueva contraseña para completar el proceso de recuperación.
                                </p>
                            </div>
                            <FormField
                                control={form.control}
                                name="password"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="font-bold text-black uppercase tracking-wide">
                                            Nueva Contraseña
                                        </FormLabel>
                                        <FormControl>
                                            <div className="relative">
                                                <Input
                                                    type={showPassword ? "text" : "password"}
                                                    variant="brutalist"
                                                    placeholder="********"
                                                    {...field}
                                                    className="pr-12"
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() => setShowPassword((prev) => !prev)}
                                                    className="absolute inset-y-0 right-0 px-3 flex items-center text-black hover:text-primary font-bold border-l-2 border-black bg-gray-100 hover:bg-gray-200 transition-colors"
                                                    tabIndex={-1}
                                                >
                                                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                                </button>
                                            </div>
                                        </FormControl>
                                        <FormMessage className="font-bold text-red-600" />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="confirmPassword"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="font-bold text-black uppercase tracking-wide">
                                            Confirmar Contraseña
                                        </FormLabel>
                                        <FormControl>
                                            <div className="relative">
                                                <Input
                                                    type={showConfirmPassword ? "text" : "password"}
                                                    variant="brutalist"
                                                    placeholder="********"
                                                    {...field}
                                                    className="pr-12"
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() => setShowConfirmPassword((prev) => !prev)}
                                                    className="absolute inset-y-0 right-0 px-3 flex items-center text-black hover:text-primary font-bold border-l-2 border-black bg-gray-100 hover:bg-gray-200 transition-colors"
                                                    tabIndex={-1}
                                                >
                                                    {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                                </button>
                                            </div>
                                        </FormControl>
                                        <FormMessage className="font-bold text-red-600" />
                                    </FormItem>
                                )}
                            />
                            <Button
                                type="submit"
                                className="w-full bg-[#bd13ec] hover:bg-[#e44f9c] text-white"
                                variant="brutalist"
                                disabled={form.formState.isSubmitting}
                            >
                                {form.formState.isSubmitting ? (
                                    <motion.div
                                        className="flex gap-2"
                                        variants={loadingContainerVariants}
                                        initial="start"
                                        animate="end"
                                    >
                                        {[...Array(3)].map((_, i) => (
                                            <motion.div
                                                key={i}
                                                className="w-3 h-3 rounded-full bg-black"
                                                variants={loadingCircleVariants}
                                                transition={loadingCircleTransition}
                                            />
                                        ))}
                                    </motion.div>
                                ) : (
                                    "Actualizar Contraseña"
                                )}
                            </Button>
                            {error && (
                                <div className="bg-red-100 border-2 border-red-600 p-3 text-center">
                                    <p className="text-red-600 font-bold text-sm">
                                        {error}
                                    </p>
                                </div>
                            )}
                        </form>
                    </Form>
                </CardContent>
            </Card>
        </div>
    );
}

export default function ResetPasswordPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen flex items-center justify-center bg-white">
                <motion.div
                    className="flex gap-2"
                    variants={loadingContainerVariants}
                    initial="start"
                    animate="end"
                >
                    {[...Array(3)].map((_, i) => (
                        <motion.div
                            key={i}
                            className="w-4 h-4 rounded-full bg-primary"
                            variants={loadingCircleVariants}
                            transition={loadingCircleTransition}
                        />
                    ))}
                </motion.div>
            </div>
        }>
            <ResetPasswordContent />
        </Suspense>
    );
} 