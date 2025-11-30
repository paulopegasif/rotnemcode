import React from 'react';
import { AssetCard, AssetItem, ComponentCategory } from '../components/AssetCard';
import { EmptyState } from '../components/EmptyState';
import { PackageOpen } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

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

export function ComponentsView ({ 
  items, 
  onAdd, 
  isFavorite, 
  onToggleFavorite, 
  selectedCategory, 
  onCategoryChange, 
  highlight 
}: { 
  items: AssetItem[]; 
  onAdd: () => void; 
  isFavorite?: (id: string) => boolean; 
  onToggleFavorite?: (id: string) => void; 
  selectedCategory: ComponentCategory | 'all';
  onCategoryChange: (cat: ComponentCategory | 'all') => void;
  highlight?: string;
}) {
  const [selectedCategories, setSelectedCategories] = React.useState<Set<ComponentCategory>>(() => {
    try {
      const stored = localStorage.getItem('rotnemcode-selected-categories');
      return stored ? new Set(JSON.parse(stored)) : new Set();
    } catch {
      return new Set();
    }
  });

  React.useEffect(() => {
    localStorage.setItem('rotnemcode-selected-categories', JSON.stringify(Array.from(selectedCategories)));
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

  const filteredItems = React.useMemo(() => {
    if (selectedCategories.size === 0) return items;
    return items.filter(item => item.category && selectedCategories.has(item.category));
  }, [items, selectedCategories]);

  return (
    <div className="max-w-7xl mx-auto space-y-6 animate-in fade-in duration-500">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Components</h1>
        <Button variant="outline" onClick={onAdd}>Add New</Button>
      </div>
      
      <div className="flex items-center gap-2 overflow-x-auto pb-2">
        <button onClick={clearCategories} aria-label="Limpar filtros">
          <Badge 
            variant={selectedCategories.size === 0 ? 'default' : 'secondary'} 
            className={selectedCategories.size > 0 ? 'bg-background border' : ''}
          >
            {CATEGORY_LABELS.all} {selectedCategories.size > 0 && `(${selectedCategories.size})`}
          </Badge>
        </button>
        {(Object.keys(CATEGORY_LABELS) as Array<ComponentCategory | 'all'>)
          .filter(key => key !== 'all')
          .map((cat) => (
            <button 
              key={cat}
              onClick={() => toggleCategory(cat as ComponentCategory)}
              aria-label={`Filtrar por ${CATEGORY_LABELS[cat]}`}
              aria-pressed={selectedCategories.has(cat as ComponentCategory)}
            >
              <Badge 
                variant={selectedCategories.has(cat as ComponentCategory) ? 'default' : 'secondary'}
                className={!selectedCategories.has(cat as ComponentCategory) ? 'bg-background border' : ''}
              >
                {CATEGORY_LABELS[cat]}
              </Badge>
            </button>
          ))}
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredItems.map((asset) => (
          <AssetCard key={asset.id} item={asset} isFavorite={isFavorite?.(asset.id)} onToggleFavorite={onToggleFavorite} highlight={highlight} />
        ))}
        {filteredItems.length === 0 && (
          <EmptyState
            icon={PackageOpen}
            title="Nenhum componente encontrado"
            description={selectedCategories.size === 0 
              ? 'Adicione seus primeiros componentes para começar.' 
              : 'Nenhum componente nas categorias selecionadas.'}
            actionLabel="Enviar agora"
            onAction={onAdd}
          />
        )}
      </div>
    </div>
  );
}
