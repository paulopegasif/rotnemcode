import React from 'react';
import { AssetCard, AssetItem } from '../components/AssetCard';
import { EmptyState } from '../components/EmptyState';
import { PackageOpen } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

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
