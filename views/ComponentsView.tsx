import React from 'react';
import { AssetCard, AssetItem, ComponentCategory } from '../components/AssetCard';
import { EmptyState } from '../components/EmptyState';
import { PackageOpen } from 'lucide-react';

const cn = (...classes: (string | undefined | null | false)[]) => classes.filter(Boolean).join(' ');

const Button: React.FC<React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: 'default' | 'outline' | 'ghost' | 'secondary'; size?: 'sm' | 'md' | 'icon' }> = ({ className, variant = 'default', size = 'md', ...props }) => {
  const variants = { default: 'bg-primary text-primary-foreground hover:bg-primary/90', outline: 'border border-input bg-background hover:bg-accent hover:text-accent-foreground', ghost: 'hover:bg-accent hover:text-accent-foreground', secondary: 'bg-secondary text-secondary-foreground hover:bg-secondary/80' } as const;
  const sizes = { sm: 'h-9 rounded-md px-3', md: 'h-10 px-4 py-2', icon: 'h-10 w-10' } as const;
  return <button className={cn('inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50', variants[variant], sizes[size], className)} {...props} />;
};

const Badge: React.FC<{ children: React.ReactNode; variant?: 'default' | 'secondary' | 'outline'; className?: string; onClick?: () => void }> = ({ children, variant = 'default', className, onClick }) => {
  const styles = { default: 'border-transparent bg-primary text-primary-foreground hover:bg-primary/80', secondary: 'border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80', outline: 'text-foreground' } as const;
  return <div onClick={onClick} className={cn('inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors cursor-pointer', styles[variant], className)}>{children}</div>;
};

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
