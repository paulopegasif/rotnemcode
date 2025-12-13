import * as React from 'react';

import { cn } from '@/lib/utils';

export interface GlassCardProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * Whether to apply hover effects (lift + enhanced glow)
   * @default false
   */
  hoverable?: boolean;
  /**
   * Blur intensity for the glass effect
   * @default 'md'
   */
  blur?: 'sm' | 'md' | 'lg' | 'xl';
  /**
   * Whether to show a subtle border glow on hover
   * @default false
   */
  glowOnHover?: boolean;
  /**
   * Custom gradient for the glass background
   */
  gradient?: 'none' | 'primary' | 'accent';
}

const blurClasses = {
  sm: 'backdrop-blur-sm',
  md: 'backdrop-blur-md',
  lg: 'backdrop-blur-lg',
  xl: 'backdrop-blur-xl',
};

const gradientClasses = {
  none: '',
  primary:
    'bg-gradient-to-br from-primary-500/10 to-primary-600/5 dark:from-primary-400/10 dark:to-primary-500/5',
  accent:
    'bg-gradient-to-br from-accent-500/10 to-accent-600/5 dark:from-accent-400/10 dark:to-accent-500/5',
};

/**
 * GlassCard - A card component with glassmorphism effect
 *
 * Features:
 * - Frosted glass background with customizable blur
 * - Translucent border
 * - Optional hover effects with lift and glow
 * - Dark mode support
 * - Optional gradient overlays
 *
 * @example
 * ```tsx
 * <GlassCard hoverable glowOnHover>
 *   <h3>Card Title</h3>
 *   <p>Card content here...</p>
 * </GlassCard>
 * ```
 */
const GlassCard = React.forwardRef<HTMLDivElement, GlassCardProps>(
  (
    {
      className,
      children,
      hoverable = false,
      blur = 'md',
      glowOnHover = false,
      gradient = 'none',
      ...props
    },
    ref
  ) => {
    return (
      <div
        ref={ref}
        className={cn(
          // Base glass styles
          'rounded-xl border',
          'bg-white/90 dark:bg-zinc-900/80',
          'border-zinc-200/50 dark:border-white/10',
          'shadow-glass',
          blurClasses[blur],
          gradientClasses[gradient],
          // Hover effects
          hoverable && [
            'transition-all duration-300 ease-spring',
            'hover:-translate-y-1',
            'hover:shadow-glass-lg',
          ],
          // Glow on hover
          glowOnHover && [
            'hover:border-primary-500/30 dark:hover:border-primary-400/30',
            'hover:shadow-glow',
          ],
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);

GlassCard.displayName = 'GlassCard';

/**
 * GlassCardHeader - Header section for GlassCard
 */
const GlassCardHeader = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn('flex flex-col space-y-1.5 p-6', className)} {...props} />
  )
);
GlassCardHeader.displayName = 'GlassCardHeader';

/**
 * GlassCardTitle - Title for GlassCard
 */
const GlassCardTitle = React.forwardRef<
  HTMLHeadingElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, children, ...props }, ref) => (
  <h3
    ref={ref}
    className={cn('text-lg font-semibold leading-none tracking-tight', className)}
    {...props}
  >
    {children}
  </h3>
));
GlassCardTitle.displayName = 'GlassCardTitle';

/**
 * GlassCardDescription - Description text for GlassCard
 */
const GlassCardDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p ref={ref} className={cn('text-sm text-muted-foreground', className)} {...props} />
));
GlassCardDescription.displayName = 'GlassCardDescription';

/**
 * GlassCardContent - Main content area for GlassCard
 */
const GlassCardContent = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn('p-6 pt-0', className)} {...props} />
  )
);
GlassCardContent.displayName = 'GlassCardContent';

/**
 * GlassCardFooter - Footer section for GlassCard
 */
const GlassCardFooter = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn('flex items-center p-6 pt-0', className)} {...props} />
  )
);
GlassCardFooter.displayName = 'GlassCardFooter';

export {
  GlassCard,
  GlassCardHeader,
  GlassCardTitle,
  GlassCardDescription,
  GlassCardContent,
  GlassCardFooter,
};
