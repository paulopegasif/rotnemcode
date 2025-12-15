import { cva, type VariantProps } from 'class-variance-authority';
import * as React from 'react';

import { cn } from '@/lib/utils';

const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 rounded-lg text-sm font-medium ring-offset-background transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
  {
    variants: {
      variant: {
        default:
          'bg-primary text-primary-foreground hover:bg-primary/90 dark:hover:bg-primary/80 shadow-sm hover:shadow-md',

        // New gradient variant with glow effect
        gradient: [
          'bg-gradient-to-r from-primary to-primary-600',
          'dark:from-primary/80 dark:to-primary-600/80',
          'text-white',
          'shadow-md',
          'hover:shadow-glow',
          'hover:-translate-y-0.5',
          'active:translate-y-0',
          'transition-all duration-300 ease-spring',
        ].join(' '),

        // Success variant with emerald accent
        success: [
          'bg-accent text-accent-foreground',
          'hover:bg-accent/90 dark:hover:bg-accent/80',
          'shadow-sm hover:shadow-md',
        ].join(' '),

        // Destructive with improved styling
        destructive: [
          'bg-destructive text-destructive-foreground',
          'hover:bg-destructive/90 dark:hover:bg-destructive/80',
          'shadow-sm hover:shadow-md',
        ].join(' '),

        outline: [
          'border border-input bg-background text-foreground',
          'dark:border-border dark:bg-card',
          'hover:bg-accent/10 dark:hover:bg-accent/5 hover:text-accent-foreground dark:hover:text-accent hover:border-accent/50 dark:hover:border-accent/30',
          'transition-colors',
        ].join(' '),

        ghost:
          'text-foreground dark:text-foreground hover:bg-accent/10 dark:hover:bg-accent/5 hover:text-accent-foreground dark:hover:text-accent transition-colors',

        secondary:
          'bg-secondary text-secondary-foreground dark:bg-secondary dark:text-secondary-foreground hover:bg-secondary/80 dark:hover:bg-secondary/70 shadow-sm',

        // Link variant
        link: 'text-primary dark:text-primary underline-offset-4 hover:underline p-0 h-auto dark:hover:text-primary/80',

        // Glass variant for glassmorphism designs
        glass: [
          'bg-white/80 dark:bg-zinc-900/80',
          'text-foreground dark:text-foreground',
          'backdrop-blur-md',
          'border border-white/20 dark:border-white/10',
          'hover:bg-white/90 dark:hover:bg-zinc-900/90',
          'shadow-glass',
        ].join(' '),
      },
      size: {
        default: 'h-10 px-4 py-2',
        sm: 'h-9 rounded-md px-3 text-xs',
        lg: 'h-12 rounded-lg px-8 text-base',
        xl: 'h-14 rounded-xl px-10 text-lg',
        icon: 'h-10 w-10',
        'icon-sm': 'h-8 w-8',
        'icon-lg': 'h-12 w-12',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>, VariantProps<typeof buttonVariants> {
  /** Whether to render as a child element (for composition with Link, etc) */
  asChild?: boolean;
  /** Show loading spinner */
  loading?: boolean;
  /** Icon to show on the left side */
  leftIcon?: React.ReactNode;
  /** Icon to show on the right side */
  rightIcon?: React.ReactNode;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    { className, variant, size, loading, leftIcon, rightIcon, disabled, children, ...props },
    ref
  ) => {
    return (
      <button
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        disabled={disabled || loading}
        {...props}
      >
        {loading && (
          <svg
            className="h-4 w-4 animate-spin"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
            />
          </svg>
        )}
        {!loading && leftIcon}
        {children}
        {!loading && rightIcon}
      </button>
    );
  }
);
Button.displayName = 'Button';

export { Button, buttonVariants };
