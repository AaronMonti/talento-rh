import * as React from "react"
import { cn } from "@/lib/utils"

type InputProps = React.ComponentProps<"input"> & {
  variant?: "default" | "brutalist"
}

function Input({ className, type, variant = "default", ...props }: InputProps) {
  const baseClasses =
    "flex h-9 w-full min-w-0 px-3 py-1 text-base transition-all outline-none disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50"

  const variants = {
    default:
      "file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input/30 border-input rounded-md border bg-transparent shadow-xs text-sm focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
    brutalist:
      "bg-white text-black placeholder:text-gray-700 selection:bg-black selection:text-yellow-300 border-[3px] border-black rounded-none px-4 py-2 font-semibold shadow-[4px_4px_0px_black] focus:translate-x-[2px] focus:translate-y-[2px] focus:shadow-none focus:outline-none file:text-black file:font-semibold aria-invalid:border-red-600 aria-invalid:ring-red-600 dark:bg-yellow-400 dark:text-black dark:placeholder:text-gray-800 dark:border-black",
  }

  return (
    <input
      type={type}
      data-slot="input"
      className={cn(baseClasses, variants[variant], className)}
      {...props}
    />
  )
}

export { Input }
