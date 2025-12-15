import * as React from 'react';

import { cn } from '@/lib/utils';

export type TextareaProps = React.TextareaHTMLAttributes<HTMLTextAreaElement>;

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, ...props }, ref) => {
    return (
      <textarea
        className={cn(
          // Base styles
          'flex min-h-[80px] w-full rounded-md border px-3 py-2 text-sm',
          // Background - use design system colors
          'bg-background dark:bg-card',
          // Text color
          'text-foreground dark:text-foreground',
          // Border
          'border-border dark:border-border',
          // Placeholder
          'placeholder:text-muted-foreground dark:placeholder:text-muted-foreground',
          // Focus state
          'ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30 focus-visible:border-primary dark:focus-visible:ring-primary/30 dark:focus-visible:border-primary',
          // Disabled state
          'disabled:cursor-not-allowed disabled:opacity-50 disabled:bg-muted dark:disabled:bg-muted',
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);
Textarea.displayName = 'Textarea';

export { Textarea };
