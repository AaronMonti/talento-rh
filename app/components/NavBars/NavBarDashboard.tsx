import React, { Dispatch, SetStateAction, useState } from "react";
import {
  LayoutDashboard,
  Briefcase,
  FileText,
  Users,
  ChevronsRight,
  LogOut,
  Building2,
  Menu,
  X
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { supabase } from "@/app/lib/supabase";
import * as Dialog from '@radix-ui/react-dialog';
import { usePathname } from 'next/navigation';
import { ThemeToggle } from "@/app/components/theme-toggle";
import { useTheme } from "next-themes";
import Image from "next/image";

const menuItems = [
  {
    title: "Dashboard",
    description: "Vista general",
    icon: LayoutDashboard,
    path: "/admin/dashboard",
    color: "#e44f9c"
  },
  {
    title: "Empleos",
    description: "Gestión de ofertas",
    icon: Briefcase,
    path: "/admin/empleos",
    color: "#bd13ec"
  },
  {
    title: "CVs",
    description: "Banco de currículums",
    icon: FileText,
    path: "/admin/cvs",
    color: "#ff69b4"
  },
  {
    title: "Postulaciones",
    description: "Seguimiento de aplicaciones",
    icon: Users,
    path: "/admin/postulaciones",
    color: "#dd63ff"
  },
];

// Navbar Mobile Component
const MobileNavbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  const handleLogout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      window.location.href = "/admin";
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
    }
  };

  return (
    <>
      {/* Mobile Header */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-50 bg-white dark:bg-gray-800 border-b-4 border-black dark:border-white p-4 transition-colors duration-300">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <motion.div
              className="grid h-10 w-10 place-content-center bg-[#bd13ec] dark:bg-purple-600 border-2 border-black dark:border-white transition-colors duration-300"
              whileHover={{ rotate: [0, 5, -5, 3, 0] }}
            >
              <Building2 className="h-5 w-5 text-white" />
            </motion.div>
            <span className="text-lg font-black tracking-tight text-[#bd13ec] dark:text-purple-400">TalentoRH</span>
          </div>

          <button
            onClick={() => setIsOpen(!isOpen)}
            className="p-2 border-2 border-black dark:border-white bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors"
            style={{ boxShadow: "2px 2px 0px 0px rgba(0,0,0,1)" }}
          >
            {isOpen ? <X className="h-6 w-6 text-black dark:text-white" /> : <Menu className="h-6 w-6 text-black dark:text-white" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="md:hidden fixed inset-0 z-40 bg-black/50"
            onClick={() => setIsOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Mobile Sidebar */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ type: "spring", damping: 20, stiffness: 300 }}
            className="md:hidden fixed top-0 left-0 bottom-0 z-50 w-80 bg-[#fff5fa] dark:bg-gray-800 border-r-4 border-black dark:border-white transition-colors duration-300"
            style={{ boxShadow: "4px 0px 0px 0px rgba(0,0,0,1)" }}
          >
            {/* Sidebar Content Container with proper flex layout */}
            <div className="flex flex-col h-full">
              {/* Header Section */}
              <div className="flex-shrink-0 pt-20 px-6 pb-4">
                <TitleSection open={true} />
              </div>

              {/* Navigation Menu - Scrollable if needed */}
              <div className="flex-1 px-6 overflow-y-auto">
                <div className="space-y-4">
                  {menuItems.map((item) => (
                    <MobileOption
                      key={item.title}
                      Icon={item.icon}
                      title={item.title}
                      description={item.description}
                      selected={pathname?.startsWith(item.path)}
                      path={item.path}
                      color={item.color}
                      onClose={() => setIsOpen(false)}
                    />
                  ))}
                </div>
              </div>

              {/* Footer Section - Always at bottom */}
              <div className="flex-shrink-0 p-6 border-t-4 border-[#bd13ec] dark:border-purple-400 bg-[#fff5fa] dark:bg-gray-800 transition-colors duration-300">
                {/* Theme Toggle Mobile */}
                <div className="mb-4 flex justify-center">
                  <ThemeToggle />
                </div>

                <Dialog.Root>
                  <Dialog.Trigger asChild>
                    <motion.button
                      className="w-full flex items-center justify-center gap-3 bg-red-600 dark:bg-red-700 border-2 border-black dark:border-white px-4 py-3 text-white transition-colors duration-300"
                      style={{ boxShadow: "4px 4px 0px 0px rgba(0,0,0,1)" }}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <LogOut className="h-5 w-5" />
                      <span className="text-sm font-bold">Cerrar Sesión</span>
                    </motion.button>
                  </Dialog.Trigger>

                  <Dialog.Portal>
                    <Dialog.Overlay className="fixed inset-0 bg-black/50 z-[60]" />
                    <Dialog.Content
                      className="fixed left-1/2 top-1/2 w-[90vw] max-w-md -translate-x-1/2 -translate-y-1/2 bg-white dark:bg-gray-800 p-6 border-4 border-[#bd13ec] dark:border-purple-400 z-[70] transition-colors duration-300"
                      style={{ boxShadow: "8px 8px 0px 0px rgba(0,0,0,1)" }}
                    >
                      <Dialog.Title className="text-xl font-bold text-[#bd13ec] dark:text-purple-400">
                        Confirmar Cierre de Sesión
                      </Dialog.Title>
                      <Dialog.Description className="mt-3 text-gray-700 dark:text-gray-300">
                        ¿Estás seguro de que deseas cerrar sesión?
                      </Dialog.Description>
                      <div className="mt-6 flex justify-end gap-4">
                        <Dialog.Close asChild>
                          <button
                            className="px-4 py-2 text-sm font-bold border-2 border-black dark:border-white bg-gray-200 dark:bg-gray-600 hover:bg-gray-300 dark:hover:bg-gray-500 text-black dark:text-white transition-colors"
                            style={{ boxShadow: "2px 2px 0px 0px rgba(0,0,0,1)" }}
                          >
                            Cancelar
                          </button>
                        </Dialog.Close>
                        <Dialog.Close asChild>
                          <motion.button
                            onClick={handleLogout}
                            className="bg-red-500 dark:bg-red-600 px-4 py-2 text-sm font-bold text-white border-2 border-black dark:border-white transition-colors"
                            style={{ boxShadow: "2px 2px 0px 0px rgba(0,0,0,1)" }}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                          >
                            Sí, cerrar sesión
                          </motion.button>
                        </Dialog.Close>
                      </div>
                    </Dialog.Content>
                  </Dialog.Portal>
                </Dialog.Root>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Spacer for mobile */}
      <div className="md:hidden h-20" />
    </>
  );
};

const MobileOption = ({
  Icon,
  title,
  description,
  selected,
  path,
  color,
  onClose
}: {
  Icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  title: string;
  description: string;
  selected: boolean;
  path: string;
  color: string;
  onClose: () => void;
}) => {
  const router = useRouter();

  const handleClick = () => {
    router.push(path);
    onClose();
  };

  return (
    <motion.button
      onClick={handleClick}
      className={`w-full text-left flex items-center gap-3 border-2 border-black dark:border-white px-4 py-3 transition-colors duration-200 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,0.8)]
        ${selected ? "text-white" : "text-black dark:text-white bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600"}
      `}
      style={{
        backgroundColor: selected ? color : undefined
      }}
      whileHover={{
        backgroundColor: selected ? color : `${color}20`,
        scale: 1.02
      }}
      whileTap={{ scale: 0.98 }}
    >
      <motion.div
        className="border-2 border-black dark:border-white h-10 w-10 flex items-center justify-center flex-shrink-0 transition-colors duration-300"
        style={{ backgroundColor: selected ? 'black' : color }}
      >
        <Icon className="h-5 w-5" style={{ color: selected ? color : 'white' }} />
      </motion.div>
      <div className="flex-1 min-w-0">
        <span className="block text-md font-bold truncate">{title}</span>
        <span className="block text-xs font-medium text-opacity-80 truncate">{description}</span>
      </div>
    </motion.button>
  );
};

export const Sidebar = () => {
  const [open, setOpen] = useState(true);
  const pathname = usePathname();

  const handleLogout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      window.location.href = "/admin";
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
    }
  };

  return (
    <>
      {/* Mobile Navbar */}
      <MobileNavbar />

      {/* Desktop Sidebar */}
      <motion.nav
        layout
        className="hidden md:block sticky top-0 h-screen shrink-0 border-r-4 border-black bg-[#fff5fa] dark:bg-gray-800 dark:border-white p-6 transition-colors duration-300"
        style={{
          width: open ? "280px" : "fit-content",
          boxShadow: "2px 2px 0px 0px rgba(0,0,0,1)"
        }}
        initial={{ x: -20, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{
          layout: { duration: 0.2, ease: "easeInOut" },
          duration: 0.3
        }}
      >
        <TitleSection open={open} />

        <div className="space-y-4 mt-8">
          {menuItems.map((item) => (
            <Option
              key={item.title}
              Icon={item.icon}
              title={item.title}
              description={item.description}
              selected={pathname?.startsWith(item.path)}
              open={open}
              path={item.path}
              color={item.color}
            />
          ))}
        </div>

        <div className="absolute bottom-20 left-0 right-0 border-t-4 border-[#bd13ec] dark:border-purple-400 px-6 pt-6">
          {/* Theme Toggle */}
          <div className={`mb-4 ${!open && 'flex justify-center'}`}>
            <ThemeToggle />
          </div>
          <Dialog.Root>
            <Dialog.Trigger asChild>
              <button
                className={`text-left text-white mb-2  ${open ? 'w-full' : 'flex w-full justify-center'}`}
              >
                <motion.div
                  className={`flex items-center gap-3 bg-red-500 dark:bg-red-600 border-2 border-black dark:border-white ${open ? 'px-4 py-3' : 'p-3 justify-center'
                    } transition-colors duration-300`}
                  style={{ boxShadow: "4px 4px 0px 0px rgba(0,0,0,1)" }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <div>
                    <LogOut className="h-5 w-5" />
                  </div>
                  {open && (
                    <motion.span
                      layout
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.1 }}
                      className="text-sm font-bold"
                    >
                      Cerrar Sesión
                    </motion.span>
                  )}
                </motion.div>
              </button>

            </Dialog.Trigger>

            <Dialog.Portal>
              <Dialog.Overlay className="fixed inset-0 bg-black/40" />
              <Dialog.Content
                className="fixed left-1/2 top-1/2 w-[90vw] max-w-md -translate-x-1/2 -translate-y-1/2 bg-white dark:bg-gray-800 p-6 border-4 border-[#bd13ec] dark:border-purple-400 transition-colors duration-300"
                style={{ boxShadow: "8px 8px 0px 0px rgba(0,0,0,1)" }}
              >
                <Dialog.Title className="text-xl font-bold text-[#bd13ec] dark:text-purple-400">
                  Confirmar Cierre de Sesión
                </Dialog.Title>

                <Dialog.Description className="mt-3 text-gray-700 dark:text-gray-300">
                  ¿Estás seguro de que deseas cerrar sesión? Necesitarás volver a iniciar sesión para acceder al panel de administración.
                </Dialog.Description>

                <div className="mt-6 flex justify-end gap-4">
                  <Dialog.Close asChild>
                    <button className="px-4 py-2 text-sm font-bold text-gray-700 dark:text-gray-300 border-2 border-black dark:border-white bg-white dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors duration-200 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] dark:shadow-[2px_2px_0px_0px_rgba(255,255,255,0.8)] uppercase tracking-wide">
                      Cancelar
                    </button>
                  </Dialog.Close>
                  <Dialog.Close asChild>
                    <motion.button
                      onClick={handleLogout}
                      className="bg-red-600 dark:bg-red-700 px-4 py-2 text-sm font-bold text-white border-2 border-black dark:border-white transition-colors duration-300 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] dark:shadow-[2px_2px_0px_0px_rgba(255,255,255,0.8)] uppercase tracking-wide"
                      whileHover={{
                        scale: 1.05,
                        transition: {
                          scale: { type: "spring", stiffness: 400 }
                        }
                      }}
                      whileTap={{
                        scale: 0.95,
                        transition: { type: "spring", damping: 10, stiffness: 500 }
                      }}
                    >
                      Sí, cerrar sesión
                    </motion.button>
                  </Dialog.Close>
                </div>
              </Dialog.Content>
            </Dialog.Portal>
          </Dialog.Root>
        </div>

        <ToggleClose open={open} setOpen={setOpen} />
      </motion.nav>
    </>
  );
};

const Option = ({
  Icon,
  title,
  description,
  selected,
  open,
  path,
  color
}: {
  Icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  title: string;
  description: string;
  selected: boolean;
  open: boolean;
  path: string;
  color: string;
}) => {
  const router = useRouter();
  const { theme } = useTheme();

  const handleClick = () => {
    router.push(path);
  };

  // Función para obtener el backgroundColor apropiado basado en el tema
  const getBackgroundColor = () => {
    if (selected) {
      return color;
    }
    // Para elementos no seleccionados, usar colores que se adapten al tema
    return theme === 'dark' ? '#374151' : '#ffffff'; // gray-700 en dark, white en light
  };

  const getHoverBackgroundColor = () => {
    if (selected) {
      return color;
    }
    return `${color}30`; // 30% de opacidad del color para hover
  };

  return (
    <motion.button
      layout
      onClick={handleClick}
      className={`relative text-left flex items-center gap-3 border-2 border-black dark:border-white transition-all duration-300 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,0.8)]
        ${selected ? "text-white" : "text-black dark:text-white"}
        ${open ? "px-4 py-3 w-full" : "p-3 justify-center"}
      `}
      style={{
        backgroundColor: getBackgroundColor()
      }}
      whileHover={{
        backgroundColor: getHoverBackgroundColor(),
        transition: { duration: 0.2 }
      }}
      whileTap={{ scale: 0.98 }}
      transition={{ duration: 0.1, ease: "easeInOut" }}
    >
      <motion.div
        layout
        className="border-2 border-black dark:border-white h-10 w-10 flex items-center justify-center transition-colors duration-300"
        style={{ backgroundColor: selected ? 'black' : color }}
        transition={{ duration: 0.1, ease: "easeInOut" }}
      >
        <Icon className="h-5 w-5" style={{ color: selected ? color : 'white' }} />
      </motion.div>
      {open && (
        <motion.div
          layout
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
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
    <div className="mb-8 border-b-4 border-[#bd13ec] dark:border-purple-400 pb-6 transition-colors duration-300">
      <div className="flex cursor-pointer items-center justify-between">
        <div className="flex items-center gap-3">
          <Image src="/logo_talento-Photoroom.png" alt="TalentoRH" width={70} height={70} />
          {open && (
            <motion.div
              layout
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.1 }}
            >
              <span className="block text-xl font-black tracking-tight text-primary dark:text-purple-400">TalentoRH</span>
              <span className="block text-xs text-gray-700 dark:text-gray-300 mt-1">Panel de Administración</span>
            </motion.div>
          )}
        </div>
      </div>
    </div>
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
    <button
      onClick={() => setOpen((pv) => !pv)}
      className={`absolute bottom-6 ${open ? 'left-0 right-0 px-6' : 'left-1/2 -translate-x-1/2'}`}
    >
      <motion.div
        className={`flex items-center gap-3 bg-white dark:bg-gray-700 border-2 border-black dark:border-white transition-colors duration-300 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,0.8)] ${open ? 'px-4 py-3' : 'p-3 justify-center'
          }`}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <motion.div
          animate={{
            rotate: open ? 180 : 0,
            transition: { type: "spring", damping: 10, stiffness: 300 }
          }}
        >
          <ChevronsRight className="h-5 w-5 text-black dark:text-white" />
        </motion.div>
        {open && (
          <motion.span
            layout
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="text-sm font-bold text-black dark:text-white"
          >
            Ocultar Panel
          </motion.span>
        )}
      </motion.div>
    </button>
  );
};