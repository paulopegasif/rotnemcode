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
          // Background - explicit white for light, dark for dark mode
          '[background-color:#ffffff] dark:bg-zinc-900/50',
          // Text color
          'text-zinc-900 dark:text-zinc-100',
          // Border
          'border-zinc-300 dark:border-zinc-700',
          // Placeholder
          'placeholder:text-zinc-500 dark:placeholder:text-zinc-400',
          // Focus state
          'ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30 focus-visible:border-primary',
          // Disabled state
          'disabled:cursor-not-allowed disabled:opacity-50',
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
