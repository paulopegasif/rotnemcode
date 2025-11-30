import { PackageOpen } from 'lucide-react';
import React from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

import { RECENT_ASSETS } from '../App';
import { AssetCard } from '../components/AssetCard';
import { EmptyState } from '../components/EmptyState';
import { useAppStore } from '../store/useAppStore';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

type ViewType = 'template' | 'section' | 'favorites';

export function ListView({ type }: { type: ViewType }) {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const isFavorite = useAppStore((state) => state.isFavorite);
  const toggleFavorite = useAppStore((state) => state.toggleFavorite);
  const favorites = useAppStore((state) => state.favorites);

  const highlight = searchParams.get('highlight') || undefined;

  // Filtrar items baseado no tipo
  const items = React.useMemo(() => {
    if (type === 'favorites') {
      return RECENT_ASSETS.filter((a) => favorites.includes(a.id));
    }
    const category = type === 'template' ? 'template' : 'section';
    return RECENT_ASSETS.filter((a) => a.category === category);
  }, [type, favorites]);

  const title = type === 'favorites' ? 'Favorites' : `${type}s`;
  const emptyMessage =
    type === 'favorites'
      ? 'No favorites yet. Star some assets to see them here!'
      : `No ${type}s available. Upload your first ${type}!`;
  const [statusFilter, setStatusFilter] = React.useState<'all' | 'Free' | 'Pro' | 'Archived'>(
    'all'
  );
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
        <Button variant="outline" onClick={() => navigate('/upload')}>
          Add New
        </Button>
      </div>
      <div className="flex items-center gap-2 overflow-x-auto pb-2">
        <button onClick={() => setStatusFilter('all')} aria-label="Filtrar todos">
          <Badge
            variant={statusFilter === 'all' ? 'default' : 'secondary'}
            className="cursor-pointer"
          >
            Todos
          </Badge>
        </button>
        <button onClick={() => setStatusFilter('Pro')} aria-label="Filtrar Pro">
          <Badge
            variant={statusFilter === 'Pro' ? 'default' : 'secondary'}
            className="cursor-pointer bg-background border"
          >
            Pro
          </Badge>
        </button>
        <button onClick={() => setStatusFilter('Free')} aria-label="Filtrar Free">
          <Badge
            variant={statusFilter === 'Free' ? 'default' : 'secondary'}
            className="cursor-pointer bg-background border"
          >
            Free
          </Badge>
        </button>
        <button onClick={() => setStatusFilter('Archived')} aria-label="Filtrar Arquivados">
          <Badge
            variant={statusFilter === 'Archived' ? 'default' : 'secondary'}
            className="cursor-pointer bg-background border"
          >
            Arquivados
          </Badge>
        </button>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map((asset) => (
          <AssetCard
            key={asset.id}
            item={asset}
            isFavorite={isFavorite(asset.id)}
            onToggleFavorite={toggleFavorite}
            highlight={highlight}
          />
        ))}
        {filtered.length === 0 && (
          <EmptyState
            icon={PackageOpen}
            title="Nenhum item encontrado"
            description={emptyMessage}
            actionLabel="Adicionar novo"
            onAction={() => navigate('/upload')}
          />
        )}
      </div>
    </div>
  );
}
