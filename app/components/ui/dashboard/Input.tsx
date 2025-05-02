import { forwardRef } from 'react';

interface InputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement | HTMLTextAreaElement>, 'className'> {
  label?: string;
  error?: string;
  className?: string;
  as?: 'input' | 'textarea';
}

export const Input = forwardRef<HTMLInputElement | HTMLTextAreaElement, InputProps>(
  ({ label, error, className = '', as = 'input', ...props }, ref) => {
    const Component = as;
    
    return (
      <div className="space-y-2">
        {label && (
          <label className="text-sm font-medium text-primary">
            {label}
          </label>
        )}
        <Component
          ref={ref as any}
          className={`
            w-full px-4 py-2
            border border-primary
            shadow-[2px_2px_0px_#e44f9c]
            focus:shadow-none
            focus:border-accent
            transition-colors
            outline-none
            ${error ? 'border-red-500 shadow-[2px_2px_0px_#ef4444]' : ''}
            ${className}
          `}
          {...props}
        />
        {error && (
          <p className="text-red-500 text-sm">{error}</p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input'; 