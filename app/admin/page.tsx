"use client";

import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff } from "lucide-react";
import { motion, Transition, Variants } from "motion/react";
import { Button } from "@/components/ui/button"
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardFooter, CardTitle } from "@/components/ui/card";

const loginSchema = z.object({
    email: z.string().email("Por favor ingresa un email válido"),
    password: z.string().min(2, "La contraseña debe tener al menos 6 caracteres"),
    // Add any other validation rules you need
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

    const form = useForm<LoginFormData>({
        resolver: zodResolver(loginSchema),
        defaultValues: {
            email: "",
            password: "",
        }
    })

    useEffect(() => {
        const checkSession = async () => {
            const { data } = await supabase.auth.getUser();
            if (data.user) router.push("/admin/dashboard");
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

    return (
        <div className="min-h-screen flex items-center justify-center bg-tertiary/10 px-4">
            <Card className="w-full max-w-md">
                <CardTitle className="text-3xl font-extrabold uppercase text-center tracking-wide mb-6 text-primary">
                    Panel de Administración
                </CardTitle>

                <CardContent>

                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                            {/* Email */}
                            <FormField
                                control={form.control}
                                name="email"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Correo Electrónico</FormLabel>
                                        <FormControl>
                                            <Input variant="brutalist" placeholder="shadcn" {...field} />
                                        </FormControl>
                                        <FormMessage>
                                            {form.formState.errors.email?.message}
                                        </FormMessage>
                                    </FormItem>
                                )}
                            >
                            </FormField>
                            {/* Password */}
                            <FormField
                                control={form.control}
                                name="password"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Contraseña</FormLabel>
                                        <FormControl>
                                            <div className="relative">
                                                <Input
                                                    type={showPassword ? "text" : "password"}
                                                    variant="brutalist"
                                                    placeholder="********"
                                                    {...field}
                                                    className="pr-10" // Espacio para el ícono
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() => setShowPassword((prev) => !prev)}
                                                    className="absolute inset-y-0 right-0 px-3 flex items-center text-muted-foreground hover:text-primary"
                                                    tabIndex={1} // Evita que el botón sea parte del tab focus
                                                >
                                                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                                </button>
                                            </div>
                                        </FormControl>
                                        <FormMessage>
                                            {form.formState.errors.password?.message}
                                        </FormMessage>
                                    </FormItem>
                                )}
                            />
                            <Button
                                type="submit"
                                className="w-full"
                                variant={"brutalist"}
                                disabled={form.formState.isSubmitting}
                            >
                                {form.formState.isSubmitting ? (
                                    <motion.div
                                        variants={loadingContainerVariants}
                                        initial="start"
                                        animate="end"
                                    >
                                        <motion.div
                                            className="w-4 h-4 rounded-full bg-white"
                                            variants={loadingCircleVariants}
                                            transition={loadingCircleTransition}
                                        />
                                    </motion.div>
                                ) : (
                                    "Iniciar Sesión"
                                )}
                            </Button>
                            {authError && (
                                <p className="text-red-500 text-sm text-center mt-2">
                                    {authError}
                                </p>
                            )}
                        </form>
                    </Form>
                </CardContent>
                <CardFooter className="text-center">
                    <p className="text-sm text-muted-foreground">
                        ¿Olvidaste tu contraseña?{" "}
                        <a
                            href="#"
                            className="text-primary hover:underline"
                        >
                            Recuperar
                        </a>
                    </p>
                </CardFooter>
            </Card>
        </div>
    );
}
