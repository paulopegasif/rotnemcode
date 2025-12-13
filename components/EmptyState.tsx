import { LucideIcon, Plus } from 'lucide-react';
import React from 'react';

import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

type EmptyStateVariant = 'default' | 'favorites' | 'assets' | 'search' | 'upload';

interface EmptyStateProps {
  icon?: LucideIcon;
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
  className?: string;
  variant?: EmptyStateVariant;
}

// SVG Illustrations for each variant
const illustrations: Record<EmptyStateVariant, React.ReactNode> = {
  default: (
    <svg className="w-48 h-48" viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="100" cy="100" r="80" className="fill-muted/50" />
      <circle cx="100" cy="100" r="60" className="fill-muted" />
      <rect
        x="70"
        y="60"
        width="60"
        height="80"
        rx="8"
        className="fill-background stroke-border"
        strokeWidth="2"
      />
      <rect x="80" y="75" width="40" height="4" rx="2" className="fill-muted-foreground/30" />
      <rect x="80" y="85" width="30" height="4" rx="2" className="fill-muted-foreground/30" />
      <rect x="80" y="95" width="35" height="4" rx="2" className="fill-muted-foreground/30" />
      <circle cx="100" cy="120" r="12" className="fill-primary/20" />
      <path
        d="M96 120L99 123L104 117"
        className="stroke-primary"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  ),
  favorites: (
    <svg className="w-48 h-48" viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="100" cy="100" r="80" className="fill-pink-500/5" />
      <circle cx="100" cy="100" r="60" className="fill-pink-500/10" />
      <path
        d="M100 150C100 150 140 120 140 90C140 75 128 65 115 65C107 65 100 72 100 72C100 72 93 65 85 65C72 65 60 75 60 90C60 120 100 150 100 150Z"
        className="fill-pink-500/20 stroke-pink-500"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="85" cy="88" r="4" className="fill-pink-400/50" />
    </svg>
  ),
  assets: (
    <svg className="w-48 h-48" viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="100" cy="100" r="80" className="fill-primary/5" />
      <circle cx="100" cy="100" r="60" className="fill-primary/10" />
      {/* Folder */}
      <path
        d="M60 70H85L95 60H140C145.523 60 150 64.4772 150 70V130C150 135.523 145.523 140 140 140H60C54.4772 140 50 135.523 50 130V80C50 74.4772 54.4772 70 60 70Z"
        className="fill-primary/20 stroke-primary"
        strokeWidth="2"
      />
      {/* Plus icon */}
      <circle cx="100" cy="105" r="20" className="fill-background stroke-primary" strokeWidth="2" />
      <path
        d="M100 95V115M90 105H110"
        className="stroke-primary"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  ),
  search: (
    <svg className="w-48 h-48" viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="100" cy="100" r="80" className="fill-accent/5" />
      <circle cx="100" cy="100" r="60" className="fill-accent/10" />
      {/* Magnifying glass */}
      <circle cx="90" cy="90" r="35" className="fill-background stroke-accent" strokeWidth="4" />
      <line
        x1="115"
        y1="115"
        x2="145"
        y2="145"
        className="stroke-accent"
        strokeWidth="6"
        strokeLinecap="round"
      />
      {/* Question mark */}
      <path
        d="M85 80C85 75 88 70 95 70C102 70 105 75 105 80C105 87 95 87 95 95"
        className="stroke-accent/60"
        strokeWidth="3"
        strokeLinecap="round"
      />
      <circle cx="95" cy="102" r="2" className="fill-accent/60" />
    </svg>
  ),
  upload: (
    <svg className="w-48 h-48" viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="100" cy="100" r="80" className="fill-primary/5" />
      <circle cx="100" cy="100" r="60" className="fill-primary/10" />
      {/* Cloud */}
      <path
        d="M145 110C152.18 110 158 104.18 158 97C158 89.82 152.18 84 145 84C145 84 145 84 145 84C144.65 70.19 133.31 59 119.5 59C108.49 59 99.14 66.47 96.14 76.62C93.56 74.33 90.14 73 86.5 73C78.49 73 72 79.49 72 87.5C72 88.02 72.02 88.53 72.06 89.04C63.41 91.04 57 98.71 57 107.5C57 117.72 65.28 126 75.5 126H145C152.18 126 158 120.18 158 113V110H145Z"
        className="fill-background stroke-primary"
        strokeWidth="2"
      />
      {/* Arrow */}
      <path
        d="M100 140V100M100 100L88 112M100 100L112 112"
        className="stroke-primary"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  ),
};

export function EmptyState({
  icon: Icon,
  title,
  description,
  actionLabel,
  onAction,
  className,
  variant = 'default',
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        'col-span-full flex flex-col items-center justify-center py-16 px-4 text-center animate-fade-in',
        className
      )}
    >
      {/* Illustration */}
      <div className="mb-6 opacity-90">{illustrations[variant]}</div>

      {/* Icon badge (optional, if icon provided) */}
      {Icon && (
        <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-muted/50 mb-4">
          <Icon className="h-6 w-6 text-muted-foreground" />
        </div>
      )}

      {/* Title */}
      <h3 className="text-xl font-semibold mb-2">{title}</h3>

      {/* Description */}
      <p className="text-muted-foreground max-w-sm mb-6">{description}</p>

      {/* Action button */}
      {actionLabel && onAction && (
        <Button variant="gradient" onClick={onAction} className="rounded-xl">
          <Plus className="h-4 w-4" />
          {actionLabel}
        </Button>
      )}
    </div>
  );
}

// Preset empty states for common scenarios
export const EmptyFavorites = ({ onAction }: { onAction?: () => void }) => (
  <EmptyState
    variant="favorites"
    title="Nenhum favorito ainda"
    description="Adicione assets aos favoritos clicando no ícone de coração para acessá-los rapidamente."
    actionLabel="Explorar biblioteca"
    onAction={onAction}
  />
);

export const EmptyAssets = ({ onAction }: { onAction?: () => void }) => (
  <EmptyState
    variant="assets"
    title="Nenhum asset encontrado"
    description="Comece a fazer upload dos seus templates e components para organizar sua biblioteca."
    actionLabel="Fazer upload"
    onAction={onAction}
  />
);

export const EmptySearch = ({ query }: { query?: string }) => (
  <EmptyState
    variant="search"
    title="Nenhum resultado encontrado"
    description={
      query
        ? `Não encontramos resultados para "${query}". Tente buscar por outros termos.`
        : 'Tente ajustar os filtros ou buscar por outros termos.'
    }
  />
);

export const EmptyUpload = ({ onAction }: { onAction?: () => void }) => (
  <EmptyState
    variant="upload"
    title="Arraste seus arquivos aqui"
    description="Suportamos JSON (Elementor), HTML, CSS e JavaScript. Máximo de 10MB por arquivo."
    actionLabel="Selecionar arquivos"
    onAction={onAction}
  />
);
