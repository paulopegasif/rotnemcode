import { PackageOpen } from 'lucide-react';
import React from 'react';

import { AssetCard, type AssetItem } from '../components/AssetCard';
import { EmptyState } from '../components/EmptyState';
import { Pagination } from '../components/Pagination';

import { Button } from '@/components/ui/button';

const ITEMS_PER_PAGE = 9;

type ListViewProps = {
  title: string;
  items: AssetItem[];
  onAdd: () => void;
  emptyMessage: string;
  isFavorite: (id: string) => boolean;
  onToggleFavorite: (id: string) => void;
  highlight?: string;
};

export function ListView({
  title,
  items,
  onAdd,
  emptyMessage,
  isFavorite,
  onToggleFavorite,
  highlight,
}: ListViewProps) {
  const [currentPage, setCurrentPage] = React.useState(1);

  React.useEffect(() => {
    setCurrentPage(1);
  }, [items]);

  const totalPages = Math.ceil(items.length / ITEMS_PER_PAGE) || 1;
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const paginatedItems = items.slice(startIndex, endIndex);

  return (
    <div className="max-w-7xl mx-auto space-y-6 animate-in fade-in duration-500">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">{title}</h1>
        <Button variant="outline" onClick={onAdd}>
          Add New
        </Button>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {paginatedItems.map((asset) => (
          <AssetCard
            key={asset.id}
            item={asset}
            isFavorite={isFavorite(asset.id)}
            onToggleFavorite={onToggleFavorite}
            highlight={highlight}
          />
        ))}
        {items.length === 0 && (
          <EmptyState
            icon={PackageOpen}
            title="Nenhum item encontrado"
            description={emptyMessage}
            actionLabel="Adicionar novo"
            onAction={onAdd}
          />
        )}
      </div>
      {items.length > 0 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
          itemsPerPage={ITEMS_PER_PAGE}
          totalItems={items.length}
        />
      )}
    </div>
  );
}
