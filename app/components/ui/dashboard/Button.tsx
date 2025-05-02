import { ReactNode } from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: 'primary' | 'secondary' | 'outline' | 'minimal';
  color?: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  type?: 'button' | 'submit' | 'reset';
}

export const Button = ({ 
  children, 
  variant = 'primary', 
  color,
  size = 'md',
  className = '', 
  type = 'button',
  ...props
}: ButtonProps) => {
  const getColorStyles = (hexColor?: string) => {
    if (!hexColor) return {};
    
    const isValidHex = /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(hexColor);
    if (!isValidHex) return {};

    return {
      backgroundColor: hexColor,
      color: '#ffffff',
      '--shadow-color': hexColor,
    } as React.CSSProperties;
  };

  const baseStyles = "font-medium w-fit transition-colors duration-200";
  
  const variants = {
    primary: `bg-primary text-white hover:bg-accent`,
    secondary: `bg-secondary text-white hover:bg-tertiary`,
    outline: `border border-primary text-primary hover:bg-primary hover:text-white`,
    minimal: `bg-transparent text-primary hover:text-accent`
  };

  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-6 py-2',
    lg: 'px-8 py-3 text-lg'
  };

  return (
    <button 
      type={type}
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
      style={color ? getColorStyles(color) : {}}
      {...props}
    >
      {children}
    </button>
  );
}; 