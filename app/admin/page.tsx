"use client";

import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import { useRouter } from "next/navigation";
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
import { Card, CardContent, CardFooter, CardTitle } from "@/components/ui/card";

const loginSchema = z.object({
    email: z.string().email("Por favor ingresa un email válido"),
    password: z.string().min(2, "La contraseña debe tener al menos 6 caracteres"),
});

type LoginFormData = z.infer<typeof loginSchema>;

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

export default function AdminPage() {
    const router = useRouter();
    const [authError, setAuthError] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [isCheckingSession, setIsCheckingSession] = useState(true);

    const form = useForm<LoginFormData>({
        resolver: zodResolver(loginSchema),
        defaultValues: {
            email: "",
            password: "",
        },
    });

    useEffect(() => {
        const checkSession = async () => {
            const { data } = await supabase.auth.getUser();
            if (data.user) {
                router.push("/admin/dashboard");
            } else {
                setIsCheckingSession(false);
            }
        };
        checkSession();
    }, [router]);

    const onSubmit = async (values: LoginFormData) => {
        setAuthError("");

        const { error } = await supabase.auth.signInWithPassword({
            email: values.email,
            password: values.password,
        });

        if (error) {
            setAuthError("Fallo al iniciar sesión. Por favor verifica tus credenciales.");
            console.error("Error al iniciar sesión:", error.message);
        } else {
            router.push("/admin/dashboard");
        }
    };

    if (isCheckingSession) {
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

    return (
        <div className="min-h-screen flex items-center justify-center bg-white px-4">
            <Card variant="neubrutalist" className="w-full max-w-md">
                <CardTitle className="text-3xl font-black uppercase text-center tracking-wide mb-6 text-primary">
                    Panel de Administración
                </CardTitle>
                <CardContent>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                            <FormField
                                control={form.control}
                                name="email"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="font-bold text-black uppercase tracking-wide">
                                            Correo Electrónico
                                        </FormLabel>
                                        <FormControl>
                                            <Input
                                                variant="brutalist"
                                                placeholder="admin@ejemplo.com"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage className="font-bold text-red-600" />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="password"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="font-bold text-black uppercase tracking-wide">
                                            Contraseña
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
                                    "Iniciar Sesión"
                                )}
                            </Button>
                            {authError && (
                                <div className="bg-red-100 border-2 border-red-600 p-3 text-center">
                                    <p className="text-red-600 font-bold text-sm">
                                        {authError}
                                    </p>
                                </div>
                            )}
                        </form>
                    </Form>
                </CardContent>
                <CardFooter className="text-center border-t-2 border-black pt-4">
                    <p className="text-sm font-bold text-gray-600 w-full">
                        ¿Olvidaste tu contraseña?{" "}
                        <a href="#" className="text-primary hover:underline font-black uppercase">
                            Recuperar
                        </a>
                    </p>
                </CardFooter>
            </Card>
        </div>
    );
}
