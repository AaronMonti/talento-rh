import * as DialogPrimitive from '@radix-ui/react-dialog';
import { X } from 'lucide-react';

interface DialogProps {
  trigger: React.ReactNode;
  children: React.ReactNode;
  title: string;
  description?: string;
}

export const Dialog = ({ trigger, children, title, description }: DialogProps) => {
  return (
    <DialogPrimitive.Root>
      <DialogPrimitive.Trigger asChild>
        {trigger}
      </DialogPrimitive.Trigger>

      <DialogPrimitive.Portal>
        <DialogPrimitive.Overlay className="fixed inset-0 bg-black/40 backdrop-blur-sm" />
        <DialogPrimitive.Content className={`
          fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 
          bg-white p-6 
          shadow-[2px_2px_0px_#e44f9c] 
          border border-primary
          min-w-[90vw] max-w-md
          duration-200
          data-[state=open]:animate-in
          data-[state=closed]:animate-out
          data-[state=closed]:fade-out-0
          data-[state=open]:fade-in-0
          data-[state=closed]:zoom-out-95
          data-[state=open]:zoom-in-95
        `}>
          <DialogPrimitive.Title className="text-xl font-bold text-primary">
            {title}
          </DialogPrimitive.Title>

          {description && (
            <DialogPrimitive.Description className="mt-3 text-gray-600">
              {description}
            </DialogPrimitive.Description>
          )}

          <div className="mt-4">
            {children}
          </div>

          <DialogPrimitive.Close className={`
            absolute right-4 top-4 
            p-1 hover:bg-tertiary/10
            text-primary
            transition-colors
          `}>
            <X className="h-4 w-4" />
          </DialogPrimitive.Close>
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  );
}; 