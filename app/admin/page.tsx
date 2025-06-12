"use client";

import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff, ArrowLeft } from "lucide-react";
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

const resetPasswordSchema = z.object({
    email: z.string().email("Por favor ingresa un email válido"),
});

type LoginFormData = z.infer<typeof loginSchema>;
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

export default function AdminPage() {
    const router = useRouter();
    const [authError, setAuthError] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [isCheckingSession, setIsCheckingSession] = useState(true);
    const [isResetMode, setIsResetMode] = useState(false);
    const [resetSuccess, setResetSuccess] = useState(false);

    const loginForm = useForm<LoginFormData>({
        resolver: zodResolver(loginSchema),
        defaultValues: {
            email: "",
            password: "",
        },
    });

    const resetForm = useForm<ResetPasswordFormData>({
        resolver: zodResolver(resetPasswordSchema),
        defaultValues: {
            email: "",
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

    // Limpiar formularios cuando cambie el modo
    useEffect(() => {
        if (isResetMode) {
            resetForm.reset();
            setAuthError("");
        } else {
            loginForm.reset();
            setAuthError("");
        }
    }, [isResetMode, resetForm, loginForm]);

    const onLoginSubmit = async (values: LoginFormData) => {
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

    const onResetSubmit = async (values: ResetPasswordFormData) => {
        setAuthError("");

        const { error } = await supabase.auth.resetPasswordForEmail(values.email, {
            redirectTo: `${window.location.origin}/admin/reset-password`,
        });

        if (error) {
            setAuthError("Error al enviar el email de recuperación. Por favor intenta de nuevo.");
            console.error("Error al resetear contraseña:", error.message);
        } else {
            setResetSuccess(true);
        }
    };

    const handleBackToLogin = () => {
        setIsResetMode(false);
        setResetSuccess(false);
        setAuthError("");
        resetForm.reset();
        loginForm.clearErrors();
    };

    const handleShowResetMode = () => {
        setIsResetMode(true);
        setAuthError("");
        loginForm.clearErrors();
        resetForm.reset();
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
                    {isResetMode ? "Recuperar Contraseña" : "Panel de Administración"}
                </CardTitle>
                <CardContent>
                    {!isResetMode ? (
                        // Login Form
                        <Form {...loginForm}>
                            <form onSubmit={loginForm.handleSubmit(onLoginSubmit)} className="space-y-6">
                                <FormField
                                    control={loginForm.control}
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
                                    control={loginForm.control}
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
                                    disabled={loginForm.formState.isSubmitting}
                                >
                                    {loginForm.formState.isSubmitting ? (
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
                    ) : resetSuccess ? (
                        // Success Message
                        <div className="text-center space-y-4">
                            <div className="bg-green-100 border-2 border-green-600 p-4 rounded">
                                <p className="text-green-700 font-bold">
                                    ¡Email enviado exitosamente!
                                </p>
                                <p className="text-green-600 text-sm mt-2">
                                    Revisa tu bandeja de entrada y sigue las instrucciones para restablecer tu contraseña.
                                </p>
                            </div>
                            <Button
                                onClick={handleBackToLogin}
                                variant="brutalist"
                                className="w-full bg-gray-800 hover:bg-gray-900 text-white"
                            >
                                <ArrowLeft className="w-4 h-4 mr-2" />
                                Volver al Login
                            </Button>
                        </div>
                    ) : (
                        // Reset Password Form
                        <Form {...resetForm} key="reset-form">
                            <form onSubmit={resetForm.handleSubmit(onResetSubmit)} className="space-y-6">
                                <div className="text-center mb-4">
                                    <p className="text-gray-600 text-sm">
                                        Ingresa tu email y te enviaremos un enlace para restablecer tu contraseña.
                                    </p>
                                </div>
                                <FormField
                                    control={resetForm.control}
                                    name="email"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="font-bold text-black uppercase tracking-wide">
                                                Correo Electrónico
                                            </FormLabel>
                                            <FormControl>
                                                <Input
                                                    type="email"
                                                    variant="brutalist"
                                                    placeholder="admin@ejemplo.com"
                                                    autoComplete="email"
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormMessage className="font-bold text-red-600" />
                                        </FormItem>
                                    )}
                                />
                                <div className="space-y-3">
                                    <Button
                                        type="submit"
                                        className="w-full bg-[#bd13ec] hover:bg-[#e44f9c] text-white"
                                        variant="brutalist"
                                        disabled={resetForm.formState.isSubmitting}
                                    >
                                        {resetForm.formState.isSubmitting ? (
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
                                            "Enviar Email de Recuperación"
                                        )}
                                    </Button>
                                    <Button
                                        type="button"
                                        onClick={handleBackToLogin}
                                        variant="brutalist"
                                        className="w-full bg-gray-800 hover:bg-gray-900 text-white"
                                    >
                                        <ArrowLeft className="w-4 h-4 mr-2" />
                                        Volver al Login
                                    </Button>
                                </div>
                                {authError && (
                                    <div className="bg-red-100 border-2 border-red-600 p-3 text-center">
                                        <p className="text-red-600 font-bold text-sm">
                                            {authError}
                                        </p>
                                    </div>
                                )}
                            </form>
                        </Form>
                    )}
                </CardContent>
                {!isResetMode && (
                    <CardFooter className="text-center border-t-2 border-black pt-4">
                        <p className="text-sm font-bold text-gray-600 w-full">
                            ¿Olvidaste tu contraseña?{" "}
                            <button
                                onClick={handleShowResetMode}
                                className="text-primary hover:underline font-black uppercase"
                            >
                                Recuperar
                            </button>
                        </p>
                    </CardFooter>
                )}
            </Card>
        </div>
    );
}
