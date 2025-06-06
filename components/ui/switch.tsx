"use client"

import * as React from "react"
import * as SwitchPrimitives from "@radix-ui/react-switch"

import { cn } from "@/lib/utils"

const Switch = React.forwardRef<
  React.ElementRef<typeof SwitchPrimitives.Root>,
  React.ComponentPropsWithoutRef<typeof SwitchPrimitives.Root> & {
    variant?: "default" | "brutalist"
  }
>(({ className, variant = "default", ...props }, ref) => (
  <SwitchPrimitives.Root
    className={cn(
      "peer inline-flex h-5 w-9 shrink-0 cursor-pointer items-center border-2 border-transparent transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:cursor-not-allowed disabled:opacity-50",

      // Default variant
      variant === "default" && [
        "rounded-full data-[state=checked]:bg-primary data-[state=unchecked]:bg-input"
      ],

      // Brutalist variant
      variant === "brutalist" && [
        "rounded-none border-black data-[state=checked]:bg-green-400 data-[state=unchecked]:bg-red-400 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] focus-visible:ring-0 focus-visible:shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]"
      ],

      className
    )}
    {...props}
    ref={ref}
  >
    <SwitchPrimitives.Thumb
      className={cn(
        "pointer-events-none block h-4 w-4 shadow-lg ring-0 transition-transform",

        // Default variant
        variant === "default" && [
          "rounded-full bg-background data-[state=checked]:translate-x-4 data-[state=unchecked]:translate-x-0"
        ],

        // Brutalist variant
        variant === "brutalist" && [
          "rounded-none bg-white border-2 border-black data-[state=checked]:translate-x-4 data-[state=unchecked]:translate-x-0 shadow-[1px_1px_0px_0px_rgba(0,0,0,1)]"
        ]
      )}
    />
  </SwitchPrimitives.Root>
))
Switch.displayName = SwitchPrimitives.Root.displayName

export { Switch }
