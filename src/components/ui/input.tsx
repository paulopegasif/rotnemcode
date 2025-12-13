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
          'flex h-10 w-full rounded-lg border px-3 py-2 text-sm',
          // Background - explicit white for light, dark for dark mode
          '[background-color:#ffffff] dark:bg-zinc-900/50',
          // Text color - dark for light mode, light for dark mode
          'text-zinc-900 dark:text-zinc-100',
          // Border and ring
          'border-zinc-300 dark:border-zinc-700 ring-offset-background',
          // Placeholder
          'placeholder:text-zinc-500 dark:placeholder:text-zinc-400',
          // Focus state with smooth transition
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30 focus-visible:border-primary',
          'transition-all duration-200',
          // File input styling
          'file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground',
          // Disabled state
          'disabled:cursor-not-allowed disabled:opacity-50 disabled:bg-muted',
          // Error state
          error &&
            'border-destructive focus-visible:ring-destructive/30 focus-visible:border-destructive',
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
