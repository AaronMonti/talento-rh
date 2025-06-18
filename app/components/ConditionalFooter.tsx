"use client";

import { usePathname } from "next/navigation";
import Footer from "./Footer";

export function ConditionalFooter() {
    const pathname = usePathname();
    const isAdminRoute = pathname?.startsWith('/admin') || false;

    // No mostrar Footer en rutas de admin
    if (isAdminRoute) {
        return null;
    }

    return <Footer />;
} 