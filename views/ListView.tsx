import { PackageOpen } from 'lucide-react';
import React from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

import { RECENT_ASSETS } from '../App';
import { AssetCard } from '../components/AssetCard';
import { EmptyState } from '../components/EmptyState';
import { Pagination } from '../components/Pagination';
import { useAppStore } from '../store/useAppStore';

import { Button } from '@/components/ui/button';

type ViewType = 'template' | 'section' | 'favorites';

const ITEMS_PER_PAGE = 9;

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
  const [currentPage, setCurrentPage] = React.useState(1);

  const filtered = React.useMemo(() => {
    return items.filter((a) => {
      if (statusFilter === 'all') return true;
      if (statusFilter === 'Archived') return false; // placeholder até termos campo archived
      return a.status === statusFilter;
    });
  }, [items, statusFilter]);

  // Reset page when filters change
  React.useEffect(() => {
    setCurrentPage(1);
  }, [statusFilter, type]);

  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const paginatedItems = filtered.slice(startIndex, endIndex);

  return (
    <div className="max-w-7xl mx-auto space-y-6 animate-in fade-in duration-500">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold capitalize">{title}</h1>
        <Button variant="outline" onClick={() => navigate('/upload')}>
          Add New
        </Button>
      </div>
      <div className="flex items-center gap-2 flex-wrap">
        <button
          onClick={() => setStatusFilter('all')}
          aria-label="Filtrar todos"
          className={`px-4 py-2 rounded-full border text-sm font-semibold transition-colors ${
            statusFilter === 'all'
              ? 'bg-primary text-primary-foreground border-transparent'
              : 'bg-background text-foreground hover:bg-accent'
          }`}
        >
          Todos
        </button>
        <button
          onClick={() => setStatusFilter('Pro')}
          aria-label="Filtrar Pro"
          className={`px-4 py-2 rounded-full border text-sm font-semibold transition-colors ${
            statusFilter === 'Pro'
              ? 'bg-primary text-primary-foreground border-transparent'
              : 'bg-background text-foreground hover:bg-accent'
          }`}
        >
          Pro
        </button>
        <button
          onClick={() => setStatusFilter('Free')}
          aria-label="Filtrar Free"
          className={`px-4 py-2 rounded-full border text-sm font-semibold transition-colors ${
            statusFilter === 'Free'
              ? 'bg-primary text-primary-foreground border-transparent'
              : 'bg-background text-foreground hover:bg-accent'
          }`}
        >
          Free
        </button>
        <button
          onClick={() => setStatusFilter('Archived')}
          aria-label="Filtrar Arquivados"
          className={`px-4 py-2 rounded-full border text-sm font-semibold transition-colors ${
            statusFilter === 'Archived'
              ? 'bg-primary text-primary-foreground border-transparent'
              : 'bg-background text-foreground hover:bg-accent'
          }`}
        >
          Arquivados
        </button>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {paginatedItems.map((asset) => (
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
      {filtered.length > 0 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
          itemsPerPage={ITEMS_PER_PAGE}
          totalItems={filtered.length}
        />
      )}
    </div>
  );
}
