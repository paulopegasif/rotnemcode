import * as React from 'react';

import { cn } from '@/lib/utils';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  /** Error state styling */
  error?: boolean;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, error, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          // Base styles
          'flex h-10 w-full rounded-lg border bg-background px-3 py-2 text-sm',
          // Border and ring
          'border-input ring-offset-background',
          // Placeholder
          'placeholder:text-muted-foreground',
          // Focus state with smooth transition
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30 focus-visible:border-primary',
          'transition-all duration-200',
          // File input styling
          'file:border-0 file:bg-transparent file:text-sm file:font-medium',
          // Disabled state
          'disabled:cursor-not-allowed disabled:opacity-50 disabled:bg-muted',
          // Error state
          error &&
            'border-destructive focus-visible:ring-destructive/30 focus-visible:border-destructive',
          // Dark mode improvements
          'dark:bg-zinc-900/50',
          className
        )}
        ref={ref}
        aria-invalid={error ? 'true' : undefined}
        {...props}
      />
    );
  }
);
Input.displayName = 'Input';

export { Input };
