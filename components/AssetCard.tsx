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
} from 'lucide-react';
import React, { useState } from 'react';
import { toast } from 'sonner';

import { CodePreviewDialog } from './CodePreviewDialog';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
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

export const AssetCard: React.FC<{
  item: AssetItem;
  isFavorite?: boolean;
  onToggleFavorite?: (id: string) => void;
  highlight?: string;
}> = ({ item, isFavorite = false, onToggleFavorite, highlight }) => {
  const [copied, setCopied] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [isLocalFavorite, setIsLocalFavorite] = useState(isFavorite);

  // Sincronizar estado local com prop
  React.useEffect(() => {
    setIsLocalFavorite(isFavorite);
  }, [isFavorite]);
  const getIcon = (type: AssetType) => {
    switch (type) {
      case 'Template':
        return <Layout className="h-8 w-8 text-blue-500" />;
      case 'Section':
        return <Layers className="h-8 w-8 text-purple-500" />;
      case 'CSS':
        return <FileCode className="h-8 w-8 text-sky-400" />;
      case 'JS':
        return <Code2 className="h-8 w-8 text-yellow-400" />;
      case 'HTML':
        return <Terminal className="h-8 w-8 text-orange-500" />;
      default:
        return <FileJson className="h-8 w-8" />;
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
    // Atualizar estado local imediatamente para feedback visual instantâneo
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
          className="bg-yellow-300/60 dark:bg-yellow-400/30 rounded px-0.5"
          aria-label={`Termo buscado: ${match}`}
        >
          {match}
        </mark>
        {after}
      </>
    );
  };

  return (
    <Card className="group overflow-hidden flex flex-col hover:shadow-md transition-all duration-200">
      <div className="h-40 bg-muted w-full flex items-center justify-center relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-tr from-muted/50 to-muted/10" />
        <div className="scale-100 group-hover:scale-110 transition-transform duration-500">
          {getIcon(item.type)}
        </div>
        <div className="absolute top-2 right-2">
          <Badge variant="secondary" className="bg-background/80 backdrop-blur-sm shadow-sm">
            {item.type}
          </Badge>
        </div>
      </div>
      <div className="p-4 flex flex-col flex-grow">
        <h3 className="font-semibold text-lg leading-tight mb-1 truncate" title={item.title}>
          {renderTitle()}
        </h3>
        <p className="text-xs text-muted-foreground mb-4">Updated {item.updatedAt}</p>
        <div className="mt-auto flex items-center justify-between">
          <Button
            variant="outline"
            size="sm"
            className="w-full mr-2 group-hover:border-primary/50 transition-colors"
            aria-label="Visualizar"
            onClick={() => setShowPreview(!showPreview)}
          >
            <Eye className="h-4 w-4 mr-2" />
            {showPreview ? 'Fechar' : 'Preview'}
          </Button>
          <div className="flex gap-1">
            {item.code && (
              <Button
                variant="ghost"
                size="icon"
                className="h-9 w-9"
                onClick={handleCopy}
                aria-label={copied ? 'Código copiado' : 'Copiar código'}
              >
                <Copy className={cn('h-4 w-4', copied && 'text-green-500')} />
              </Button>
            )}
            <Button
              variant="ghost"
              size="icon"
              className={cn(
                'h-9 w-9 transition-colors',
                isLocalFavorite && 'text-red-500 hover:text-red-600'
              )}
              onClick={handleToggleFavorite}
              aria-label={isLocalFavorite ? 'Remover dos favoritos' : 'Adicionar aos favoritos'}
            >
              <svg
                className="h-4 w-4"
                viewBox="0 0 24 24"
                fill={isLocalFavorite ? 'currentColor' : 'none'}
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
              </svg>
            </Button>
            <Button variant="ghost" size="icon" className="h-9 w-9">
              <MoreVertical className="h-4 w-4 text-muted-foreground" />
            </Button>
          </div>
        </div>
      </div>

      <CodePreviewDialog item={item} open={showPreview} onOpenChange={setShowPreview} />
    </Card>
  );
};
