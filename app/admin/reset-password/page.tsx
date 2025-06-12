// app/admin/reset-password/page.tsx

import { supabase } from "@/app/lib/supabase";
import ResetPasswordForm from "./form";

export default async function ResetPasswordPage({ searchParams }: { searchParams: { [key: string]: string } }) {
    // Si ya hay usuario, todo OK
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
        return <ResetPasswordForm />;
    }

    // Si no hay usuario, intentamos establecer sesión
    const accessToken = searchParams["access_token"];
    const refreshToken = searchParams["refresh_token"];

    if (!accessToken || !refreshToken) {
        return (
            <div className="min-h-screen flex items-center justify-center text-red-600 font-bold text-xl">
                Enlace inválido o expirado.
            </div>
        );
    }

    // Establecer sesión temporal
    const { error } = await supabase.auth.setSession({
        access_token: accessToken,
        refresh_token: refreshToken,
    });

    if (error) {
        return (
            <div className="min-h-screen flex items-center justify-center text-red-600 font-bold text-xl">
                Error al validar sesión: {error.message}
            </div>
        );
    }

    return <ResetPasswordForm />;
}
