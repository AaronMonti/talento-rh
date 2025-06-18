"use client";

import * as React from "react";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import type { ThemeProviderProps } from "next-themes";
import { usePathname } from "next/navigation";

export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
    const pathname = usePathname();
    const isAdminRoute = pathname?.startsWith('/admin') || false;

    // Si no es ruta de admin, forzar tema light y deshabilitar el sistema de temas
    if (!isAdminRoute) {
        return (
            <NextThemesProvider
                {...props}
                forcedTheme="light"
                enableSystem={false}
                attribute="class"
            >
                {children}
            </NextThemesProvider>
        );
    }

    // Para rutas de admin, usar el ThemeProvider normal
    return <NextThemesProvider {...props}>{children}</NextThemesProvider>;
}