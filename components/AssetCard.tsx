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
    onToggleFavorite(item.id);
    if (isFavorite) {
      toast('Removido dos favoritos', {
        description: `${item.title} foi removido da lista de favoritos.`,
      });
    } else {
      toast.success('Adicionado aos favoritos!', {
        description: `${item.title} foi adicionado aos favoritos.`,
      });
    }
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
        <div className="absolute top-2 right-2 flex gap-2">
          {item.status && (
            <Badge
              variant={item.status === 'Pro' ? 'default' : 'secondary'}
              className="bg-background/80 backdrop-blur-sm shadow-sm"
            >
              {item.status}
            </Badge>
          )}
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
              className="h-9 w-9"
              onClick={handleToggleFavorite}
              aria-label={isFavorite ? 'Remover dos favoritos' : 'Adicionar aos favoritos'}
            >
              {isFavorite ? (
                <svg className="h-4 w-4 text-red-500" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 6 4 4 6.5 4c1.74 0 3.41.81 4.5 2.09C12.09 4.81 13.76 4 15.5 4 18 4 20 6 20 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                </svg>
              ) : (
                <svg
                  className="h-4 w-4"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M20.8 8.5c0 3.6-3.2 6.6-8.8 11.3-5.6-4.7-8.8-7.7-8.8-11.3C3.2 6 5.2 4 7.7 4c1.8 0 3.5.9 4.3 2.3C12.8 4.9 14.5 4 16.3 4c2.5 0 4.5 2 4.5 4.5z" />
                </svg>
              )}
            </Button>
            <Button variant="ghost" size="icon" className="h-9 w-9">
              <MoreVertical className="h-4 w-4 text-muted-foreground" />
            </Button>
          </div>
        </div>
        {showPreview && item.code && (
          <pre
            className="mt-4 p-3 rounded-md bg-slate-900 text-slate-100 text-xs overflow-auto max-h-48"
            aria-label="Pré-visualização do código"
          >
            <code>{item.code}</code>
          </pre>
        )}
      </div>
    </Card>
  );
};
