import { supabase } from "@/app/lib/supabase";
import ResetPasswordForm from "./form";

type Props = {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function ResetPasswordPage({ searchParams }: Props) {
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
        return <ResetPasswordForm />;
    }

    // Await the searchParams promise
    const params = await searchParams;
    const accessToken = params.access_token;
    const refreshToken = params.refresh_token;

    if (!accessToken || !refreshToken) {
        return (
            <div className="min-h-screen flex items-center justify-center text-red-600 font-bold text-xl">
                Enlace inválido o expirado.
            </div>
        );
    }

    const { error } = await supabase.auth.setSession({
        access_token: accessToken as string,
        refresh_token: refreshToken as string,
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