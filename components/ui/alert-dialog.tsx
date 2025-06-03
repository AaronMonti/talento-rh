"use client"

import * as React from "react"
import * as AlertDialogPrimitive from "@radix-ui/react-alert-dialog"

import { cn } from "@/lib/utils"
import { buttonVariants } from "@/components/ui/button"

function AlertDialog({
  ...props
}: React.ComponentProps<typeof AlertDialogPrimitive.Root>) {
  return <AlertDialogPrimitive.Root data-slot="alert-dialog" {...props} />
}

function AlertDialogTrigger({
  ...props
}: React.ComponentProps<typeof AlertDialogPrimitive.Trigger>) {
  return (
    <AlertDialogPrimitive.Trigger data-slot="alert-dialog-trigger" {...props} />
  )
}

function AlertDialogPortal({
  ...props
}: React.ComponentProps<typeof AlertDialogPrimitive.Portal>) {
  return (
    <AlertDialogPrimitive.Portal data-slot="alert-dialog-portal" {...props} />
  )
}

function AlertDialogOverlay({
  className,
  variant = "default",
  ...props
}: React.ComponentProps<typeof AlertDialogPrimitive.Overlay> & {
  variant?: "default" | "neubrutalist"
}) {
  return (
    <AlertDialogPrimitive.Overlay
      data-slot="alert-dialog-overlay"
      data-variant={variant}
      className={cn(
        "fixed inset-0 z-50",
        
        // Default variant
        variant === "default" && [
          "data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 bg-black/50"
        ],
        
        // Neubrutalist variant
        variant === "neubrutalist" && [
          "data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 bg-black/70"
        ],
        
        className
      )}
      {...props}
    />
  )
}

function AlertDialogContent({
  className,
  variant = "default",
  ...props
}: React.ComponentProps<typeof AlertDialogPrimitive.Content> & {
  variant?: "default" | "neubrutalist"
}) {
  return (
    <AlertDialogPortal>
      <AlertDialogOverlay variant={variant} />
      <AlertDialogPrimitive.Content
        data-slot="alert-dialog-content"
        data-variant={variant}
        className={cn(
          "fixed top-[50%] left-[50%] z-50 grid w-full max-w-[calc(100%-2rem)] translate-x-[-50%] translate-y-[-50%] gap-4 duration-200 sm:max-w-lg",
          
          // Default variant
          variant === "default" && [
            "bg-background data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 rounded-lg border p-6 shadow-lg"
          ],
          
          // Neubrutalist variant
          variant === "neubrutalist" && [
            "bg-white border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] p-6 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:scale-95 data-[state=open]:scale-100"
          ],
          
          className
        )}
        {...props}
      />
    </AlertDialogPortal>
  )
}

function AlertDialogHeader({
  className,
  variant = "default",
  ...props
}: React.ComponentProps<"div"> & {
  variant?: "default" | "neubrutalist"
}) {
  return (
    <div
      data-slot="alert-dialog-header"
      data-variant={variant}
      className={cn(
        "flex flex-col gap-2",
        variant === "default" && "text-center sm:text-left",
        variant === "neubrutalist" && "text-center border-b-2 border-black pb-3 mb-3",
        className
      )}
      {...props}
    />
  )
}

function AlertDialogFooter({
  className,
  variant = "default",
  ...props
}: React.ComponentProps<"div"> & {
  variant?: "default" | "neubrutalist"
}) {
  return (
    <div
      data-slot="alert-dialog-footer"
      data-variant={variant}
      className={cn(
        "flex gap-2",
        variant === "default" && "flex-col-reverse sm:flex-row sm:justify-end",
        variant === "neubrutalist" && "flex-row justify-center border-t-2 border-black pt-3 mt-3",
        className
      )}
      {...props}
    />
  )
}

function AlertDialogTitle({
  className,
  variant = "default",
  ...props
}: React.ComponentProps<typeof AlertDialogPrimitive.Title> & {
  variant?: "default" | "neubrutalist"
}) {
  return (
    <AlertDialogPrimitive.Title
      data-slot="alert-dialog-title"
      data-variant={variant}
      className={cn(
        variant === "default" && "text-lg font-semibold",
        variant === "neubrutalist" && "text-xl font-black uppercase tracking-wide text-black",
        className
      )}
      {...props}
    />
  )
}

function AlertDialogDescription({
  className,
  variant = "default",
  ...props
}: React.ComponentProps<typeof AlertDialogPrimitive.Description> & {
  variant?: "default" | "neubrutalist"
}) {
  return (
    <AlertDialogPrimitive.Description
      data-slot="alert-dialog-description"
      data-variant={variant}
      className={cn(
        variant === "default" && "text-muted-foreground text-sm",
        variant === "neubrutalist" && "text-black text-base font-bold leading-relaxed",
        className
      )}
      {...props}
    />
  )
}

function AlertDialogAction({
  className,
  variant = "default",
  ...props
}: React.ComponentProps<typeof AlertDialogPrimitive.Action> & {
  variant?: "default" | "neubrutalist"
}) {
  return (
    <AlertDialogPrimitive.Action
      data-variant={variant}
      className={cn(
        variant === "default" && buttonVariants(),
        variant === "neubrutalist" && [
          "bg-red-500 hover:bg-red-600 text-white font-bold uppercase border-2 border-black px-4 py-2 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] active:translate-x-[1px] active:translate-y-[1px] transition-all duration-100"
        ],
        className
      )}
      {...props}
    />
  )
}

function AlertDialogCancel({
  className,
  variant = "default",
  ...props
}: React.ComponentProps<typeof AlertDialogPrimitive.Cancel> & {
  variant?: "default" | "neubrutalist"
}) {
  return (
    <AlertDialogPrimitive.Cancel
      data-variant={variant}
      className={cn(
        variant === "default" && buttonVariants({ variant: "outline" }),
        variant === "neubrutalist" && [
          "bg-gray-200 hover:bg-gray-300 text-black font-bold uppercase border-2 border-black px-4 py-2 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] active:translate-x-[1px] active:translate-y-[1px] transition-all duration-100"
        ],
        className
      )}
      {...props}
    />
  )
}

export {
  AlertDialog,
  AlertDialogPortal,
  AlertDialogOverlay,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogFooter,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogAction,
  AlertDialogCancel,
}