/**
 * Input Component
 */

import { InputHTMLAttributes, forwardRef } from 'react';
import clsx from 'clsx';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, helperText, className, ...props }, ref) => {
    return (
      <div className="w-full">
        {label && (
          <label className="label" htmlFor={props.id}>
            {label}
            {props.required && <span className="text-error-red ml-1">*</span>}
          </label>
        )}
        <input
          ref={ref}
          className={clsx(
            'input w-full',
            error && 'input-error',
            className
          )}
          {...props}
        />
        {error && <p className="error-message">{error}</p>}
        {helperText && !error && (
          <p className="text-body-sm text-slate-gray mt-1">{helperText}</p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';
