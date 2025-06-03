'use client';

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/app/lib/supabase";
import { Sidebar } from "@/app/components/NavBars/NavBarDashboard";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
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
  }, [router]);

  return (
    <div className="min-h-screen bg-white pt-20 md:pt-0">
      <div className="flex">
        {isAuthenticated && <Sidebar />}
        <div className={`flex-1 ${isAuthenticated ? "p-4" : ""}`}>
          {children}
        </div>
      </div>
    </div>
  );
}
