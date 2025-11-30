import React from 'react';
import { AssetCard, AssetItem } from '../components/AssetCard';
import { EmptyState } from '../components/EmptyState';
import { PackageOpen } from 'lucide-react';

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

export function ListView({ title, items, onAdd, emptyMessage, isFavorite, onToggleFavorite, highlight }: { title: string; items: AssetItem[]; onAdd: () => void; emptyMessage: string; isFavorite?: (id: string) => boolean; onToggleFavorite?: (id: string) => void; highlight?: string; }) {
  const [statusFilter, setStatusFilter] = React.useState<'all' | 'Free' | 'Pro' | 'Archived'>('all');
  const filtered = React.useMemo(() => {
    return items.filter((a) => {
      if (statusFilter === 'all') return true;
      if (statusFilter === 'Archived') return false; // placeholder até termos campo archived
      return a.status === statusFilter;
    });
  }, [items, statusFilter]);
  return (
    <div className="max-w-7xl mx-auto space-y-6 animate-in fade-in duration-500">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold capitalize">{title}</h1>
        <Button variant="outline" onClick={onAdd}>Add New</Button>
      </div>
      <div className="flex items-center gap-2 overflow-x-auto pb-2">
        <button onClick={() => setStatusFilter('all')} aria-label="Filtrar todos">
          <Badge variant={statusFilter === 'all' ? 'default' : 'secondary'} className="cursor-pointer">Todos</Badge>
        </button>
        <button onClick={() => setStatusFilter('Pro')} aria-label="Filtrar Pro">
          <Badge variant={statusFilter === 'Pro' ? 'default' : 'secondary'} className="cursor-pointer bg-background border">Pro</Badge>
        </button>
        <button onClick={() => setStatusFilter('Free')} aria-label="Filtrar Free">
          <Badge variant={statusFilter === 'Free' ? 'default' : 'secondary'} className="cursor-pointer bg-background border">Free</Badge>
        </button>
        <button onClick={() => setStatusFilter('Archived')} aria-label="Filtrar Arquivados">
          <Badge variant={statusFilter === 'Archived' ? 'default' : 'secondary'} className="cursor-pointer bg-background border">Arquivados</Badge>
        </button>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map((asset) => (
          <AssetCard key={asset.id} item={asset} isFavorite={isFavorite?.(asset.id)} onToggleFavorite={onToggleFavorite} highlight={highlight} />
        ))}
        {filtered.length === 0 && (
          <EmptyState
            icon={PackageOpen}
            title="Nenhum item encontrado"
            description={emptyMessage}
            actionLabel="Enviar agora"
            onAction={onAdd}
          />
        )}
      </div>
    </div>
  );
}
