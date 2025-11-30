import React from 'react';
import { LucideIcon } from 'lucide-react';

const cn = (...classes: (string | undefined | null | false)[]) => classes.filter(Boolean).join(' ');

const Button: React.FC<React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: 'default' | 'outline' | 'ghost' | 'secondary'; size?: 'sm' | 'md' | 'icon' }> = ({ className, variant = 'default', size = 'md', ...props }) => {
  const variants = { default: 'bg-primary text-primary-foreground hover:bg-primary/90', outline: 'border border-input bg-background hover:bg-accent hover:text-accent-foreground', ghost: 'hover:bg-accent hover:text-accent-foreground', secondary: 'bg-secondary text-secondary-foreground hover:bg-secondary/80' } as const;
  const sizes = { sm: 'h-9 rounded-md px-3', md: 'h-10 px-4 py-2', icon: 'h-10 w-10' } as const;
  return <button className={cn('inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50', variants[variant], sizes[size], className)} {...props} />;
};

export function EmptyState({
  icon: Icon,
  title,
  description,
  actionLabel,
  onAction,
  className
}: {
  icon: LucideIcon;
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
  className?: string;
}) {
  return (
    <div className={cn("col-span-full py-20 text-center", className)}>
      <div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-muted mb-4">
        <Icon className="h-8 w-8 text-muted-foreground" />
      </div>
      <h3 className="text-lg font-medium">{title}</h3>
      <p className="text-muted-foreground mt-1 max-w-md mx-auto">{description}</p>
      {actionLabel && onAction && (
        <Button className="mt-4" onClick={onAction}>{actionLabel}</Button>
      )}
    </div>
  );
}
