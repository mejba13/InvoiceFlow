/**
 * Card Component
 */

import { ReactNode } from 'react';
import clsx from 'clsx';

interface CardProps {
  children: ReactNode;
  className?: string;
  padding?: 'none' | 'sm' | 'md' | 'lg';
  hover?: boolean;
}

export const Card = ({
  children,
  className,
  padding = 'md',
  hover = false
}: CardProps) => {
  const paddingClasses = {
    none: 'p-0',
    sm: 'p-4',
    md: 'p-8',
    lg: 'p-12',
  };

  return (
    <div
      className={clsx(
        'card',
        paddingClasses[padding],
        hover && 'cursor-pointer',
        className
      )}
    >
      {children}
    </div>
  );
};
