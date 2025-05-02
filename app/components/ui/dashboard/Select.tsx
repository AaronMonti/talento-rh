import * as SelectPrimitive from '@radix-ui/react-select';
import { Check, ChevronDown } from 'lucide-react';

interface SelectProps {
  options: { label: string; value: string }[];
  placeholder?: string;
  value?: string;
  onChange?: (value: string) => void;
  label?: string;
}

export const Select = ({ 
  options, 
  placeholder = 'Seleccionar...', 
  value,
  onChange,
  label 
}: SelectProps) => {
  return (
    <div className="space-y-2">
      {label && (
        <label className="text-sm font-medium text-primary">
          {label}
        </label>
      )}
      <SelectPrimitive.Root value={value} onValueChange={onChange}>
        <SelectPrimitive.Trigger className={`
          w-full px-4 py-2
          border border-primary
          shadow-[2px_2px_0px_#e44f9c]
          transition-colors
          flex items-center justify-between
          bg-white
          hover:border-accent
        `}>
          <SelectPrimitive.Value placeholder={placeholder} />
          <SelectPrimitive.Icon>
            <ChevronDown className="h-4 w-4 text-primary" />
          </SelectPrimitive.Icon>
        </SelectPrimitive.Trigger>

        <SelectPrimitive.Portal>
          <SelectPrimitive.Content className={`
            bg-white 
            border border-primary
            shadow-[2px_2px_0px_#e44f9c]
            min-w-[220px]
            z-50
          `}>
            <SelectPrimitive.Viewport>
              {options.map((option) => (
                <SelectPrimitive.Item
                  key={option.value}
                  value={option.value}
                  className={`
                    px-4 py-2
                    flex items-center
                    cursor-default
                    hover:bg-tertiary/10
                    focus:outline-none
                    select-none
                    relative
                    text-primary
                  `}
                >
                  <SelectPrimitive.ItemText>{option.label}</SelectPrimitive.ItemText>
                  <SelectPrimitive.ItemIndicator className="absolute right-4">
                    <Check className="h-4 w-4 text-accent" />
                  </SelectPrimitive.ItemIndicator>
                </SelectPrimitive.Item>
              ))}
            </SelectPrimitive.Viewport>
          </SelectPrimitive.Content>
        </SelectPrimitive.Portal>
      </SelectPrimitive.Root>
    </div>
  );
}; 