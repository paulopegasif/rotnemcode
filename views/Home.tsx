import React from 'react';
import { Plus, ChevronRight } from 'lucide-react';
import { AssetCard, AssetItem } from '../components/AssetCard';

const cn = (...classes: (string | undefined | null | false)[]) => classes.filter(Boolean).join(' ');
const Card: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className }) => (
  <div className={cn('rounded-lg border bg-card text-card-foreground shadow-sm', className)}>{children}</div>
);
const Button: React.FC<React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: 'default' | 'outline' | 'ghost' | 'secondary'; size?: 'sm' | 'md' | 'icon' }> = ({ className, variant = 'default', size = 'md', ...props }) => {
  const variants = { default: 'bg-primary text-primary-foreground hover:bg-primary/90', outline: 'border border-input bg-background hover:bg-accent hover:text-accent-foreground', ghost: 'hover:bg-accent hover:text-accent-foreground', secondary: 'bg-secondary text-secondary-foreground hover:bg-secondary/80' } as const;
  const sizes = { sm: 'h-9 rounded-md px-3', md: 'h-10 px-4 py-2', icon: 'h-10 w-10' } as const;
  return <button className={cn('inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50', variants[variant], sizes[size], className)} {...props} />;
};

export function Home({ recent, onNavigate, isFavorite, onToggleFavorite }: { recent: AssetItem[]; onNavigate: (view: 'upload' | 'templates') => void; isFavorite?: (id: string) => boolean; onToggleFavorite?: (id: string) => void; }) {
  return (
    <div className="space-y-8 max-w-7xl mx-auto animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">RotnemCode Library</h1>
          <p className="text-muted-foreground mt-1">Organize, visualize and manage your Elementor assets in one place.</p>
        </div>
        <Button onClick={() => onNavigate('upload')} className="shadow-lg shadow-primary/20">
          <Plus className="h-4 w-4 mr-2" />
          New Upload
        </Button>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {['Templates', 'Sections', 'Snippets', 'Favorites'].map((stat) => (
          <Card key={stat} className="p-4 hover:border-primary/50 cursor-pointer transition-colors flex items-center justify-between group">
            <span className="font-medium">{stat}</span>
            <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:translate-x-1 transition-transform" />
          </Card>
        ))}
      </div>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold tracking-tight">Recent Additions</h2>
          <Button variant="ghost" size="sm" className="text-primary" onClick={() => onNavigate('templates')}>View All</Button>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {recent.map((asset) => (
            <AssetCard key={asset.id} item={asset} isFavorite={isFavorite?.(asset.id)} onToggleFavorite={onToggleFavorite} />
          ))}
        </div>
      </div>
    </div>
  );
}
