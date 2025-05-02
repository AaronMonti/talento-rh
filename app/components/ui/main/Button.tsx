import { ReactNode } from 'react';

interface ButtonProps {
  children: ReactNode;
  className?: string;
  variant?: 'primary' | 'secondary' | 'outline';
  onClick?: () => void;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  className = '',
  variant = 'primary',
  onClick,
}) => {
  const baseStyles = 'rounded-lg px-4 py-2 font-semibold transition-all duration-300';

  const variantStyles = {
    primary: 'bg-blue-500 text-white border border-transparent hover:bg-blue-600',
    secondary: 'bg-gray-500 text-white border border-transparent hover:bg-gray-600',
    outline: 'bg-transparent text-blue-500 border border-blue-500 hover:bg-blue-100',
  };

  return (
    <button
      onClick={onClick}
      className={`${baseStyles} ${variantStyles[variant]} ${className}`}
    >
      {children}
    </button>
  );
};
