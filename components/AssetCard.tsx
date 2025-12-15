import {
  Layout,
  Layers,
  FileCode,
  Code2,
  Terminal,
  FileJson,
  Eye,
  MoreVertical,
  Copy,
  Heart,
} from 'lucide-react';
import React, { useState } from 'react';
import { toast } from 'sonner';

import { CodePreviewDialog } from './CodePreviewDialog';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export type AssetType = 'Template' | 'Section' | 'CSS' | 'JS' | 'HTML';

export type ComponentCategory =
  | 'codes'
  | 'buttons'
  | 'forms'
  | 'animations'
  | 'advanced-animations'
  | 'carousels'
  | 'hovers'
  | 'customizations'
  | 'compositions'
  | 'tools'
  | 'hero'
  | 'footer'
  | 'pricing'
  | 'faq';

export interface AssetItem {
  id: string;
  title: string;
  type: AssetType;
  category?: ComponentCategory;
  status?: 'Free' | 'Pro';
  updatedAt: string;
  thumbnail?: string;
  code?: string; // raw code snippet or template JSON preview
}

// Type-specific styling
const typeStyles: Record<AssetType, { gradient: string; iconColor: string; bgColor: string }> = {
  Template: {
    gradient: 'from-blue-500 to-indigo-600',
    iconColor: 'text-blue-500',
    bgColor: 'bg-blue-500/10',
  },
  Section: {
    gradient: 'from-purple-500 to-pink-600',
    iconColor: 'text-purple-500',
    bgColor: 'bg-purple-500/10',
  },
  CSS: {
    gradient: 'from-sky-400 to-cyan-500',
    iconColor: 'text-sky-400',
    bgColor: 'bg-sky-400/10',
  },
  JS: {
    gradient: 'from-yellow-400 to-orange-500',
    iconColor: 'text-yellow-500',
    bgColor: 'bg-yellow-400/10',
  },
  HTML: {
    gradient: 'from-orange-500 to-red-500',
    iconColor: 'text-orange-500',
    bgColor: 'bg-orange-500/10',
  },
};

export const AssetCard: React.FC<{
  item: AssetItem;
  isFavorite?: boolean;
  onToggleFavorite?: (id: string) => void;
  highlight?: string;
}> = ({ item, isFavorite = false, onToggleFavorite, highlight }) => {
  const [copied, setCopied] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [isLocalFavorite, setIsLocalFavorite] = useState(isFavorite);
  const [isHovered, setIsHovered] = useState(false);

  const styles = typeStyles[item.type] || typeStyles.Template;

  // Sync local state with prop
  React.useEffect(() => {
    setIsLocalFavorite(isFavorite);
  }, [isFavorite]);

  const getIcon = (type: AssetType) => {
    const iconClass = cn('h-10 w-10 transition-transform duration-500', styles.iconColor);
    switch (type) {
      case 'Template':
        return <Layout className={iconClass} />;
      case 'Section':
        return <Layers className={iconClass} />;
      case 'CSS':
        return <FileCode className={iconClass} />;
      case 'JS':
        return <Code2 className={iconClass} />;
      case 'HTML':
        return <Terminal className={iconClass} />;
      default:
        return <FileJson className={iconClass} />;
    }
  };

  const handleCopy = () => {
    if (!item.code) return;
    navigator.clipboard.writeText(item.code).then(() => {
      setCopied(true);
      toast.success('Código copiado!', {
        description: 'O código foi copiado para a área de transferência.',
      });
      setTimeout(() => setCopied(false), 1800);
    });
  };

  const handleToggleFavorite = () => {
    if (!onToggleFavorite) return;
    setIsLocalFavorite(!isLocalFavorite);
    onToggleFavorite(item.id);
  };

  const renderTitle = () => {
    if (!highlight) return item.title;
    const idx = item.title.toLowerCase().indexOf(highlight.toLowerCase());
    if (idx === -1) return item.title;
    const before = item.title.slice(0, idx);
    const match = item.title.slice(idx, idx + highlight.length);
    const after = item.title.slice(idx + highlight.length);
    return (
      <>
        {before}
        <mark
          className="bg-primary/20 dark:bg-primary/30 rounded px-0.5"
          aria-label={`Termo buscado: ${match}`}
        >
          {match}
        </mark>
        {after}
      </>
    );
  };

  return (
    <div
      className={cn(
        'group relative rounded-xl overflow-hidden',
        'bg-card border border-border/50',
        'transition-all duration-300 ease-spring',
        'hover:-translate-y-1 hover:shadow-xl hover:shadow-primary/5',
        'hover:border-primary/20'
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Thumbnail/Icon Area */}
      <div className="relative h-44 w-full overflow-hidden">
        {/* Background gradient */}
        <div
          className={cn(
            'absolute inset-0 bg-gradient-to-br opacity-10 transition-opacity duration-300',
            styles.gradient,
            isHovered && 'opacity-20'
          )}
        />

        {/* Pattern overlay */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,_rgba(255,255,255,0.1)_1px,_transparent_1px)] bg-[length:20px_20px]" />

        {/* Centered icon */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div
            className={cn(
              'p-5 rounded-2xl transition-all duration-500',
              styles.bgColor,
              isHovered && 'scale-110 shadow-lg'
            )}
          >
            {getIcon(item.type)}
          </div>
        </div>

        {/* Top badges */}
        <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
          <Badge
            className={cn(
              'bg-background/90 backdrop-blur-sm border-0 shadow-sm',
              'text-xs font-medium'
            )}
          >
            {item.type}
          </Badge>
        </div>

        {/* Quick actions overlay */}
        <div
          className={cn(
            'absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent',
            'flex items-end justify-center pb-4 gap-2',
            'opacity-0 transition-opacity duration-300',
            isHovered && 'opacity-100'
          )}
        >
          <Button
            variant="secondary"
            size="sm"
            className="bg-card dark:bg-card text-foreground dark:text-foreground hover:bg-muted dark:hover:bg-muted shadow-lg rounded-lg"
            onClick={() => setShowPreview(true)}
          >
            <Eye className="h-4 w-4 mr-1.5" />
            Preview
          </Button>
          {item.code && (
            <Button
              variant="secondary"
              size="icon"
              className="bg-card dark:bg-card text-foreground dark:text-foreground hover:bg-muted dark:hover:bg-muted shadow-lg rounded-lg h-9 w-9"
              onClick={handleCopy}
              aria-label="Copiar código"
            >
              <Copy className={cn('h-4 w-4', copied && 'text-accent')} />
            </Button>
          )}
        </div>

        {/* Favorite button (always visible) */}
        <button
          onClick={handleToggleFavorite}
          className={cn(
            'absolute top-3 right-3 p-2 rounded-full transition-all duration-200',
            'bg-background/80 backdrop-blur-sm shadow-sm',
            'hover:bg-background hover:scale-110',
            isLocalFavorite && 'text-red-500'
          )}
          aria-label={isLocalFavorite ? 'Remover dos favoritos' : 'Adicionar aos favoritos'}
        >
          <Heart className={cn('h-4 w-4', isLocalFavorite && 'fill-current')} />
        </button>
      </div>

      {/* Content */}
      <div className="p-4">
        <h3
          className="font-semibold text-base leading-tight mb-1.5 truncate group-hover:text-primary transition-colors"
          title={item.title}
        >
          {renderTitle()}
        </h3>

        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span>Atualizado {item.updatedAt}</span>
          {item.category && <span className="capitalize">{item.category.replace('-', ' ')}</span>}
        </div>

        {/* Action buttons */}
        <div className="flex items-center gap-2 mt-4 pt-3 border-t border-border/50">
          <Button
            variant="outline"
            size="sm"
            className="flex-1 rounded-lg text-xs h-9"
            onClick={() => setShowPreview(true)}
          >
            <Eye className="h-3.5 w-3.5 mr-1.5" />
            Ver Código
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-9 w-9 rounded-lg"
            aria-label="Mais opções"
          >
            <MoreVertical className="h-4 w-4 text-muted-foreground" />
          </Button>
        </div>
      </div>

      <CodePreviewDialog item={item} open={showPreview} onOpenChange={setShowPreview} />
    </div>
  );
};
