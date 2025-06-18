import * as React from "react"
import { cn } from "@/lib/utils"

export interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  variant?: "default" | "brutalist"
}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, variant = "default", ...props }, ref) => {
    return (
      <textarea
        className={cn(
          // Base styles
          "flex min-h-[60px] w-full px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50",

          // Default variant
          variant === "default" && [
            "border border-input bg-background rounded-md focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          ],

          // Brutalist variant
          variant === "brutalist" && [
            "border-[3px] border-black dark:border-white bg-white dark:bg-gray-800 rounded-none focus:ring-0 focus:border-black dark:focus:border-white focus:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:focus:shadow-[4px_4px_0px_0px_rgba(255,255,255,0.8)] font-bold placeholder:text-gray-500 dark:placeholder:text-gray-400 text-black dark:text-white transition-colors duration-300"
          ],

          className
        )}
        ref={ref}
        {...props}
      />
    )
  }
)
Textarea.displayName = "Textarea"

export { Textarea }
