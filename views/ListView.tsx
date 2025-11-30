import React from 'react';
import { AssetCard, AssetItem } from '../components/AssetCard';

const cn = (...classes: (string | undefined | null | false)[]) => classes.filter(Boolean).join(' ');
const Button: React.FC<React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: 'default' | 'outline' | 'ghost' | 'secondary'; size?: 'sm' | 'md' | 'icon' }> = ({ className, variant = 'default', size = 'md', ...props }) => {
  const variants = { default: 'bg-primary text-primary-foreground hover:bg-primary/90', outline: 'border border-input bg-background hover:bg-accent hover:text-accent-foreground', ghost: 'hover:bg-accent hover:text-accent-foreground', secondary: 'bg-secondary text-secondary-foreground hover:bg-secondary/80' } as const;
  const sizes = { sm: 'h-9 rounded-md px-3', md: 'h-10 px-4 py-2', icon: 'h-10 w-10' } as const;
  return <button className={cn('inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50', variants[variant], sizes[size], className)} {...props} />;
};

const Badge: React.FC<{ children: React.ReactNode; variant?: 'default' | 'secondary' | 'outline'; className?: string }> = ({ children, variant = 'default', className }) => {
  const styles = { default: 'border-transparent bg-primary text-primary-foreground hover:bg-primary/80', secondary: 'border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80', outline: 'text-foreground' } as const;
  return <div className={cn('inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors', styles[variant], className)}>{children}</div>;
};

export function ListView({ title, items, onAdd, emptyMessage, isFavorite, onToggleFavorite }: { title: string; items: AssetItem[]; onAdd: () => void; emptyMessage: string; isFavorite?: (id: string) => boolean; onToggleFavorite?: (id: string) => void; }) {
  return (
    <div className="max-w-7xl mx-auto space-y-6 animate-in fade-in duration-500">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold capitalize">{title}</h1>
        <Button variant="outline" onClick={onAdd}>Add New</Button>
      </div>
      <div className="flex items-center gap-2 overflow-x-auto pb-2">
        <Badge variant="default" className="cursor-pointer">All</Badge>
        <Badge variant="secondary" className="cursor-pointer bg-background border">Pro</Badge>
        <Badge variant="secondary" className="cursor-pointer bg-background border">Free</Badge>
        <Badge variant="secondary" className="cursor-pointer bg-background border">Archived</Badge>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {items.map((asset) => (
          <AssetCard key={asset.id} item={asset} isFavorite={isFavorite?.(asset.id)} onToggleFavorite={onToggleFavorite} />
        ))}
        {items.length === 0 && (
          <div className="col-span-full py-20 text-center">
            <div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-muted mb-4" />
            <h3 className="text-lg font-medium">No assets found</h3>
            <p className="text-muted-foreground mt-1">{emptyMessage}</p>
            <Button className="mt-4" onClick={onAdd}>Upload Now</Button>
          </div>
        )}
      </div>
    </div>
  );
}
