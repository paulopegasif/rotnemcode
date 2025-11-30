import { Plus, ChevronRight } from 'lucide-react';
import React from 'react';

import { AssetCard, AssetItem } from '../components/AssetCard';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

export function Home({
  recent,
  onNavigate,
  isFavorite,
  onToggleFavorite,
}: {
  recent: AssetItem[];
  onNavigate: (view: 'upload' | 'templates') => void;
  isFavorite?: (id: string) => boolean;
  onToggleFavorite?: (id: string) => void;
}) {
  return (
    <div className="space-y-8 max-w-7xl mx-auto animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">RotnemCode Library</h1>
          <p className="text-muted-foreground mt-1">
            Organize, visualize and manage your Elementor assets in one place.
          </p>
        </div>
        <Button onClick={() => onNavigate('upload')} className="shadow-lg shadow-primary/20">
          <Plus className="h-4 w-4 mr-2" />
          New Upload
        </Button>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {['Templates', 'Sections', 'Snippets', 'Favorites'].map((stat) => (
          <Card
            key={stat}
            className="p-4 hover:border-primary/50 cursor-pointer transition-colors flex items-center justify-between group"
          >
            <span className="font-medium">{stat}</span>
            <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:translate-x-1 transition-transform" />
          </Card>
        ))}
      </div>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold tracking-tight">Recent Additions</h2>
          <Button
            variant="ghost"
            size="sm"
            className="text-primary"
            onClick={() => onNavigate('templates')}
          >
            View All
          </Button>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {recent.map((asset) => (
            <AssetCard
              key={asset.id}
              item={asset}
              isFavorite={isFavorite?.(asset.id)}
              onToggleFavorite={onToggleFavorite}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
