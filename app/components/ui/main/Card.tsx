import { ReactNode } from 'react';

interface CardProps {
  children: ReactNode;
  className?: string;
}

export const Card: React.FC<CardProps> = ({ children, className = '' }) => {
  return (
    <div className={`bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden transition-all duration-300 ${className}`}>
      {children}
    </div>
  );
};