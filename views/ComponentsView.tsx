import { PackageOpen } from 'lucide-react';
import React from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

import { RECENT_ASSETS } from '../App';
import { AssetCard, ComponentCategory } from '../components/AssetCard';
import { EmptyState } from '../components/EmptyState';
import { Pagination } from '../components/Pagination';
import { useAppStore } from '../store/useAppStore';

import { Button } from '@/components/ui/button';

const ITEMS_PER_PAGE = 9;

const CATEGORY_LABELS: Record<ComponentCategory | 'all', string> = {
  all: 'Todos',
  codes: 'Códigos',
  buttons: 'Botões',
  forms: 'Formulários',
  animations: 'Animações',
  'advanced-animations': 'Animações Avançadas',
  carousels: 'Carrosséis',
  hovers: 'Hovers',
  customizations: 'Personalizações',
  compositions: 'Composições',
  tools: 'Ferramentas',
  hero: 'Hero',
  footer: 'Footer',
  pricing: 'Pricing',
  faq: 'FAQ',
};

export function ComponentsView() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const isFavorite = useAppStore((state) => state.isFavorite);
  const toggleFavorite = useAppStore((state) => state.toggleFavorite);

  const highlight = searchParams.get('highlight') || undefined;

  // Filtrar apenas components (baseado em categorias de componente)
  const items = React.useMemo(() => {
    const componentCategories: ComponentCategory[] = [
      'codes',
      'buttons',
      'forms',
      'animations',
      'advanced-animations',
      'carousels',
      'hovers',
      'customizations',
      'tools',
    ];
    return RECENT_ASSETS.filter(
      (a) => a.category && componentCategories.includes(a.category as ComponentCategory)
    );
  }, []);
  const [selectedCategories, setSelectedCategories] = React.useState<Set<ComponentCategory>>(() => {
    try {
      const stored = localStorage.getItem('rotnemcode-selected-categories');
      return stored ? new Set(JSON.parse(stored)) : new Set();
    } catch {
      return new Set();
    }
  });

  React.useEffect(() => {
    localStorage.setItem(
      'rotnemcode-selected-categories',
      JSON.stringify(Array.from(selectedCategories))
    );
  }, [selectedCategories]);

  const toggleCategory = (cat: ComponentCategory) => {
    const newSet = new Set(selectedCategories);
    if (newSet.has(cat)) {
      newSet.delete(cat);
    } else {
      newSet.add(cat);
    }
    setSelectedCategories(newSet);
  };

  const clearCategories = () => {
    setSelectedCategories(new Set());
  };

  const [currentPage, setCurrentPage] = React.useState(1);

  const filteredItems = React.useMemo(() => {
    if (selectedCategories.size === 0) return items;
    return items.filter(
      (item) => item.category && selectedCategories.has(item.category as ComponentCategory)
    );
  }, [items, selectedCategories]);

  // Reset page when filters change
  React.useEffect(() => {
    setCurrentPage(1);
  }, [selectedCategories]);

  const totalPages = Math.ceil(filteredItems.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const paginatedItems = filteredItems.slice(startIndex, endIndex);

  return (
    <div className="max-w-7xl mx-auto space-y-6 animate-in fade-in duration-500">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Components</h1>
        <Button variant="outline" onClick={() => navigate('/upload')}>
          Add New
        </Button>
      </div>

      <div className="flex items-center gap-2 flex-wrap">
        <button
          onClick={clearCategories}
          aria-label="Limpar filtros"
          className={`px-4 py-2 rounded-full border text-sm font-semibold transition-colors ${
            selectedCategories.size === 0
              ? 'bg-primary text-primary-foreground border-transparent'
              : 'bg-background text-foreground hover:bg-accent'
          }`}
        >
          {CATEGORY_LABELS.all} {selectedCategories.size > 0 && `(${selectedCategories.size})`}
        </button>
        {(Object.keys(CATEGORY_LABELS) as Array<ComponentCategory | 'all'>)
          .filter((key) => key !== 'all')
          .map((cat) => (
            <button
              key={cat}
              onClick={() => toggleCategory(cat as ComponentCategory)}
              aria-label={`Filtrar por ${CATEGORY_LABELS[cat]}`}
              aria-pressed={selectedCategories.has(cat as ComponentCategory)}
              className={`px-4 py-2 rounded-full border text-sm font-semibold transition-colors ${
                selectedCategories.has(cat as ComponentCategory)
                  ? 'bg-primary text-primary-foreground border-transparent'
                  : 'bg-background text-foreground hover:bg-accent'
              }`}
            >
              {CATEGORY_LABELS[cat]}
            </button>
          ))}
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
        {filteredItems.length === 0 && (
          <EmptyState
            icon={PackageOpen}
            title="Nenhum componente encontrado"
            description={
              selectedCategories.size === 0
                ? 'Adicione seus primeiros componentes para começar.'
                : 'Nenhum componente nas categorias selecionadas.'
            }
            actionLabel="Enviar agora"
            onAction={() => navigate('/upload')}
          />
        )}
      </div>
      {filteredItems.length > 0 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
          itemsPerPage={ITEMS_PER_PAGE}
          totalItems={filteredItems.length}
        />
      )}
    </div>
  );
}
