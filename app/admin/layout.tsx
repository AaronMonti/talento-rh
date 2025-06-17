'use client';

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { supabase } from "@/app/lib/supabase";
import { Sidebar } from "@/app/components/NavBars/NavBarDashboard";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Páginas que no deben mostrar el layout del dashboard
  const publicAdminPages = ["/admin", "/admin/reset-password"];
  const isPublicPage = publicAdminPages.includes(pathname);

  useEffect(() => {
    // No hacer verificación de autenticación en páginas públicas
    if (isPublicPage) {
      return;
    }

    // Comprobar si el usuario ya está autenticado
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        router.push("/admin");
      } else {
        setIsAuthenticated(true);
      }
    };

    checkSession();

    // Escuchar cambios de autenticación
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!session) {
        router.push("/admin");
      } else {
        setIsAuthenticated(true);
      }
    });

    return () => {
      listener.subscription.unsubscribe();
    };
  }, [router, isPublicPage]);

  // Para páginas públicas, renderizar solo el contenido sin layout
  if (isPublicPage) {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 pt-20 md:pt-0 transition-colors duration-300">
      <div className="flex">
        {isAuthenticated && <Sidebar />}
        <div className={`flex-1 ${isAuthenticated ? "p-4" : ""}`}>
          {children}
        </div>
      </div>
    </div>
  );
}
