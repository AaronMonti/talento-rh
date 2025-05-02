import { ReactNode } from 'react';

interface ButtonProps {
  children: ReactNode;
  variant?: 'primary' | 'secondary' | 'outline' | 'minimal';
  color?: string; // Para códigos hex
  className?: string;
  onClick?: () => void;
}

export const Button = ({ 
  children, 
  variant = 'primary', 
  color,
  className = '', 
  onClick 
}: ButtonProps) => {
  // Función para validar y procesar el código hex
  const getColorStyles = (hexColor?: string) => {
    if (!hexColor) return {};
    
    // Validar si es un código hex válido
    const isValidHex = /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(hexColor);
    if (!isValidHex) return {};

    return {
      backgroundColor: hexColor,
      color: '#ffffff', // Texto blanco por defecto
      '--shadow-color': hexColor, // Variable CSS para la sombra
    } as React.CSSProperties;
  };

  const baseStyles = "px-6 py-2 font-medium w-fit transition-all duration-200";
  
  const variants = {
    // Variante principal con efecto de sombra 3D
    primary: `bg-indigo-500 text-white shadow-[3px_3px_0px_black] 
              hover:shadow-none hover:translate-x-[3px] hover:translate-y-[3px]`,
    
    // Variante secundaria con efecto de elevación
    secondary: `bg-gray-200 text-gray-800 shadow-md 
                hover:shadow-lg hover:-translate-y-1 hover:bg-gray-100`,
    
    // Variante outline con efecto de relleno
    outline: `border-2 border-gray-800 text-gray-800 
              hover:bg-gray-800 hover:text-white transition-colors`,
    
    // Variante minimal con efecto sutil
    minimal: `bg-transparent text-gray-800 hover:bg-gray-100 
             hover:scale-105 transition-transform`
  };

  return (
    <button 
      className={`${baseStyles} ${variants[variant]} ${className}`}
      onClick={onClick}
      style={color ? getColorStyles(color) : {}}
    >
      {children}
    </button>
  );
}; 