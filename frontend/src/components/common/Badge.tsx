/**
 * Badge Component
 */

import { ReactNode } from 'react';
import clsx from 'clsx';

interface BadgeProps {
  children: ReactNode;
  variant?: 'success' | 'warning' | 'error' | 'info' | 'default';
  className?: string;
}

export const Badge = ({ children, variant = 'default', className }: BadgeProps) => {
  const variantClasses = {
    success: 'badge-success',
    warning: 'badge-warning',
    error: 'badge-error',
    info: 'badge-info',
    default: 'badge-default',
  };

  return (
    <span className={clsx('badge', variantClasses[variant], className)}>
      {children}
    </span>
  );
};

// Helper function to get badge variant based on invoice status
export const getInvoiceStatusVariant = (status: string): BadgeProps['variant'] => {
  const statusMap: Record<string, BadgeProps['variant']> = {
    PAID: 'success',
    SENT: 'info',
    DRAFT: 'default',
    OVERDUE: 'error',
    CANCELLED: 'default',
  };
  return statusMap[status] || 'default';
};
