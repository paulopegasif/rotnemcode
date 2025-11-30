import React from 'react';
import { AssetCard, AssetItem, ComponentCategory } from '../components/AssetCard';

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
};

export function ComponentsView({ 
  items, 
  onAdd, 
  isFavorite, 
  onToggleFavorite, 
  selectedCategory, 
  onCategoryChange 
}: { 
  items: AssetItem[]; 
  onAdd: () => void; 
  isFavorite?: (id: string) => boolean; 
  onToggleFavorite?: (id: string) => void; 
  selectedCategory: ComponentCategory | 'all';
  onCategoryChange: (cat: ComponentCategory | 'all') => void;
}) {
  return (
    <div className="max-w-7xl mx-auto space-y-6 animate-in fade-in duration-500">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Components</h1>
        <Button variant="outline" onClick={onAdd}>Add New</Button>
      </div>
      
      <div className="flex items-center gap-2 overflow-x-auto pb-2">
        <Badge 
          variant={selectedCategory === 'all' ? 'default' : 'secondary'} 
          className={selectedCategory !== 'all' ? 'bg-background border' : ''}
          onClick={() => onCategoryChange('all')}
        >
          {CATEGORY_LABELS.all}
        </Badge>
        {(Object.keys(CATEGORY_LABELS) as Array<ComponentCategory | 'all'>)
          .filter(key => key !== 'all')
          .map((cat) => (
            <Badge 
              key={cat}
              variant={selectedCategory === cat ? 'default' : 'secondary'}
              className={selectedCategory !== cat ? 'bg-background border' : ''}
              onClick={() => onCategoryChange(cat as ComponentCategory)}
            >
              {CATEGORY_LABELS[cat]}
            </Badge>
          ))}
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {items.map((asset) => (
          <AssetCard key={asset.id} item={asset} isFavorite={isFavorite?.(asset.id)} onToggleFavorite={onToggleFavorite} />
        ))}
        {items.length === 0 && (
          <div className="col-span-full py-20 text-center">
            <div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-muted mb-4" />
            <h3 className="text-lg font-medium">Nenhum componente encontrado</h3>
            <p className="text-muted-foreground mt-1">
              {selectedCategory === 'all' 
                ? 'Adicione seus primeiros componentes para começar.' 
                : `Nenhum componente na categoria "${CATEGORY_LABELS[selectedCategory]}".`}
            </p>
            <Button className="mt-4" onClick={onAdd}>Upload Now</Button>
          </div>
        )}
      </div>
    </div>
  );
}
