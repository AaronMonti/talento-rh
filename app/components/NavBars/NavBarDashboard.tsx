import React, { Dispatch, SetStateAction, useState } from "react";
import {
  LayoutDashboard,
  Briefcase,
  FileText,
  Users,
  ChevronDown,
  ChevronsRight,
  LogOut,
  Building2
} from "lucide-react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { supabase } from "@/app/lib/supabase";
import * as Dialog from '@radix-ui/react-dialog';
import { usePathname } from 'next/navigation'; // Añadir este import

const menuItems = [
  {
    title: "Dashboard",
    description: "Vista general",
    icon: LayoutDashboard,
    path: "/admin/dashboard"
  },
  {
    title: "Empleos",
    description: "Gestión de ofertas",
    icon: Briefcase,
    path: "/admin/empleos"
  },
  {
    title: "CVs",
    description: "Banco de currículums",
    icon: FileText,
    path: "/admin/cvs"
  },
  {
    title: "Postulaciones",
    description: "Seguimiento de aplicaciones",
    icon: Users,
    path: "/admin/postulaciones"
  },
];

export const Sidebar = () => {
  const [open, setOpen] = useState(true);
  const router = useRouter();
  const pathname = usePathname(); // Reemplazar el window.location

  // Encontrar el título del ítem basado en la ruta actual
  const getCurrentTitle = () => {
    const currentItem = menuItems.find(item => pathname === item.path);
    return currentItem ? currentItem.title : "Dashboard";
  };

  const handleLogout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      window.location.href = "/admin"; // Forzar recarga completa
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
    }
  };

  return (
    <motion.nav
      layout
      className="sticky top-0 h-screen shrink-0 border-r-4 border-primary bg-pink-200/70 p-6"
      style={{
        width: open ? "280px" : "fit-content",
      }}
    >
      <TitleSection open={open} />

      <div className="space-y-4">
        {menuItems.map((item) => (
          <Option
            key={item.title}
            Icon={item.icon}
            title={item.title}
            description={item.description}
            selected={pathname?.startsWith(item.path)}
            open={open}
            path={item.path}
          />
        ))}
      </div>

      <div className="absolute bottom-20 left-0 right-0 border-t-4 border-primary px-6 pt-6">
        <Dialog.Root>
          <Dialog.Trigger asChild>
            <motion.button
              layout
              className="flex w-full items-center gap-3 bg-red-500 px-4 py-3 text-white transition-all hover:translate-x-[3px] hover:translate-y-[3px]"
            >
              <LogOut className="h-5 w-5" />
              {open && (
                <motion.span
                  layout
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.125 }}
                  className="text-sm font-bold"
                >
                  Cerrar Sesión
                </motion.span>
              )}
            </motion.button>
          </Dialog.Trigger>

          <Dialog.Portal>
            <Dialog.Overlay className="fixed inset-0 bg-black/40" />
            <Dialog.Content className="fixed left-1/2 top-1/2 w-[90vw] max-w-md -translate-x-1/2 -translate-y-1/2 bg-white p-6">
              <Dialog.Title className="text-xl font-bold">
                Confirmar Cierre de Sesión
              </Dialog.Title>

              <Dialog.Description className="mt-3 text-gray-600">
                ¿Estás seguro de que deseas cerrar sesión? Necesitarás volver a iniciar sesión para acceder al panel de administración.
              </Dialog.Description>

              <div className="mt-6 flex justify-end gap-4">
                <Dialog.Close asChild>
                  <button className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100">
                    Cancelar
                  </button>
                </Dialog.Close>
                <Dialog.Close asChild>
                  <button
                    onClick={handleLogout}
                    className="bg-red-500 px-4 py-2 text-sm font-medium text-white hover:bg-red-600"
                  >
                    Sí, cerrar sesión
                  </button>
                </Dialog.Close>
              </div>
            </Dialog.Content>
          </Dialog.Portal>
        </Dialog.Root>
      </div>

      <ToggleClose open={open} setOpen={setOpen} />
    </motion.nav>
  );
};

const Option = ({
  Icon,
  title,
  description,
  selected,
  open,
  path,
}: {
  Icon: React.ComponentType<any>;
  title: string;
  description: string;
  selected: boolean;
  open: boolean;
  path: string;
}) => {
  const router = useRouter();
  

  const handleClick = () => {
    router.push(path);
  };

  return (
    <motion.button
      layout
      onClick={handleClick}
      className={`relative text-left flex w-full items-center gap-3 px-4 py-3 transition-all hover:translate-x-[3px] hover:translate-y-[3px]
        ${selected
          ? "bg-primary text-white"
          : "text-black hover:bg-black/5"
        }`}
    >
      <motion.div layout>
        <Icon className="h-5 w-5" />
      </motion.div>
      {open && (
        <motion.div
          layout
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.125 }}
        >
          <span className="block text-md font-bold">{title}</span>
          <span className="block text-xs font-medium">{description}</span>
        </motion.div>
      )}
    </motion.button>
  );
};

const TitleSection = ({ open }: { open: boolean }) => {
  return (
    <div className="mb-8 border-b-4 border-primary pb-6">
      <div className="flex cursor-pointer items-center justify-between">
        <div className="flex items-center gap-3">
          <Logo />
          {open && (
            <motion.div
              layout
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.125 }}
            >
              <span className="block text-sm font-bold">TalentoRH</span>
              <span className="block text-xs opacity-60">Panel de Admin</span>
            </motion.div>
          )}
        </div>
        {open && <ChevronDown className="h-4 w-4" />}
      </div>
    </div>
  );
};

const Logo = () => {
  return (
    <motion.div
      layout
      className="grid h-10 w-10 place-content-center bg-[#4CAF50]"
    >
      <Building2 className="h-6 w-6 text-white" />
    </motion.div>
  );
};

const ToggleClose = ({
  open,
  setOpen,
}: {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
}) => {
  return (
    <motion.button
      layout
      onClick={() => setOpen((pv) => !pv)}
      className="absolute bottom-6 left-0 right-0 px-6"
    >
      <div className="flex items-center gap-3 px-4 py-3 transition-all hover:translate-x-[3px] hover:translate-y-[3px] hover:bg-primary/10">
        <motion.div layout>
          <ChevronsRight
            className={`h-5 w-5 transition-transform ${open && "rotate-180"}`}
          />
        </motion.div>
        {open && (
          <motion.span
            layout
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.125 }}
            className="text-sm font-bold"
          >
            Ocultar Panel
          </motion.span>
        )}
      </div>
    </motion.button>
  );
};