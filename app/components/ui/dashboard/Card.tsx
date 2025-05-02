import { ReactNode } from 'react';

interface CardProps {
  children: ReactNode;
  className?: string;
}

export const Card = ({ children, className = '' }: CardProps) => {
  return (
    <div className={`
      bg-white p-6 
      shadow-[2px_2px_0px_#e44f9c] 
      border border-primary
      ${className}
    `}>
      {children}
    </div>
  );
}; 