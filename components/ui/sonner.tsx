"use client"

import { useTheme } from "next-themes"
import { usePathname } from "next/navigation"
import { Toaster as Sonner, ToasterProps } from "sonner"

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = "system" } = useTheme()
  const pathname = usePathname()

  // Detectar si estamos en rutas de admin
  const isAdminRoute = pathname?.startsWith('/admin') || false

  return (
    <Sonner
      theme={theme as ToasterProps["theme"]}
      className={`toaster group ${isAdminRoute ? 'neubrutalist-toast' : ''}`}
      style={
        isAdminRoute ? {
          "--normal-bg": "#ffffff",
          "--normal-text": "#000000",
          "--normal-border": "#000000",
          "--success-bg": "#22c55e",
          "--success-text": "#ffffff",
          "--error-bg": "#ef4444",
          "--error-text": "#ffffff",
          "--warning-bg": "#f59e0b",
          "--warning-text": "#000000",
          "--border-width": "3px",
          "--shadow": "4px 4px 0px 0px rgba(0,0,0,1)",
        } as React.CSSProperties : {
          "--normal-bg": "var(--popover)",
          "--normal-text": "var(--popover-foreground)",
          "--normal-border": "var(--border)",
        } as React.CSSProperties
      }
      toastOptions={{
        classNames: isAdminRoute ? {
          toast: 'neubrutalist-toast-item border-3 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] bg-white text-black font-bold rounded-none',
          success: 'neubrutalist-success border-3 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] bg-green-500 text-white font-bold rounded-none',
          error: 'neubrutalist-error border-3 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] bg-red-500 text-white font-bold rounded-none',
          warning: 'neubrutalist-warning border-3 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] bg-yellow-500 text-black font-bold rounded-none',
          info: 'neubrutalist-info border-3 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] bg-blue-500 text-white font-bold rounded-none',
          description: 'font-semibold text-sm',
          title: 'font-black uppercase tracking-wide',
          closeButton: 'border-2 border-black bg-white hover:bg-gray-100 text-black font-bold rounded-none shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]'
        } : undefined
      }}
      {...props}
    />
  )
}

export { Toaster }
