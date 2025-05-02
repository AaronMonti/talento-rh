"use client";

import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff } from "lucide-react";
import { motion, Transition, Variants } from "framer-motion";

const loginSchema = z.object({
  email: z.string().email("Please provide a valid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
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

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  useEffect(() => {
    const checkSession = async () => {
      const { data } = await supabase.auth.getUser();
      if (data.user) router.push("/admin/dashboard");
    };
    checkSession();
  }, [router]);

  const onSubmit = async (data: LoginFormData) => {
    setAuthError("");

    const { error } = await supabase.auth.signInWithPassword({
      email: data.email,
      password: data.password,
    });

    if (error) {
      setAuthError("Failed to login. Please check your credentials.");
    } else {
      router.push("/admin/dashboard");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-tertiary/10 px-4">
      <div className="w-full max-w-md bg-white p-8 border-2 border-primary shadow-[2px_2px_0px_#e44f9c]">
        <h1 className="text-3xl font-extrabold uppercase text-center tracking-wide mb-6 text-primary">
          Panel de Administración
        </h1>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Email */}
          <div className="space-y-2">
            <label htmlFor="email" className="block text-md font-bold uppercase tracking-wider text-primary">
              Correo Electrónico
            </label>
            {errors.email && <span className="text-xs text-red-600">{errors.email.message}</span>}
            <input
              id="email"
              type="email"
              placeholder="correo@correo.com"
              {...register("email")}
              className="w-full px-4 py-2 border-2 border-primary shadow-[2px_2px_0px_#e44f9c] text-primary placeholder:text-gray-500 focus:outline-none focus:border-accent transition-colors"
            />
          </div>

          {/* Password */}
          <div className="space-y-2">
            <label htmlFor="password" className="block text-md font-bold uppercase tracking-wider text-primary">
              Contraseña
            </label>
            {errors.password && <span className="text-xs text-red-600">{errors.password.message}</span>}
            <div className="relative">
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="********"
                {...register("password")}
                className="w-full px-4 py-2 border-2 border-primary shadow-[2px_2px_0px_#e44f9c] text-primary placeholder:text-gray-500 focus:outline-none focus:border-accent transition-colors pr-12"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-highlight hover:text-accent transition-colors"
              >
                {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              </button>
            </div>
          </div>

          {authError && <p className="text-sm text-red-600">{authError}</p>}

          {/* Botón */}
          <motion.button
            type="submit"
            disabled={isSubmitting}
            className="relative w-full px-6 py-2 font-medium bg-primary text-white transition-colors hover:bg-accent disabled:opacity-50 disabled:cursor-not-allowed overflow-hidden"
            whileTap={{ scale: 0.95 }}
          >
            {isSubmitting ? (
              <motion.div
                className="flex items-center justify-center gap-2 py-2"
                variants={loadingContainerVariants}
                initial="start"
                animate="end"
              >
                {[0, 1, 2].map((_, i) => (
                  <motion.span
                    key={i}
                    className="w-2 h-2 bg-white rounded-full"
                    variants={loadingCircleVariants}
                    transition={loadingCircleTransition}
                  />
                ))}
              </motion.div>
            ) : (
              "Iniciar Sesión"
            )}
          </motion.button>
        </form>
      </div>
    </div>
  );
}
