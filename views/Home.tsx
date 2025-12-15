import {
  ArrowRight,
  ChevronRight,
  Code2,
  Heart,
  Layout,
  Layers,
  Plus,
  Sparkles,
  Zap,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

import { RECENT_ASSETS } from '../App';
import { AssetCard } from '../components/AssetCard';
import { useAppStore } from '../store/useAppStore';

import { Button } from '@/components/ui/button';
import { GlassCard, GlassCardContent } from '@/components/ui/glass-card';

// Stats cards data
const STAT_CARDS = [
  {
    label: 'Templates',
    icon: Layout,
    to: '/templates',
    gradient: 'from-primary to-primary-600',
    count: '24',
  },
  {
    label: 'Sections',
    icon: Code2,
    to: '/sections',
    gradient: 'from-accent to-accent-600',
    count: '156',
  },
  {
    label: 'Components',
    icon: Layers,
    to: '/components',
    gradient: 'from-pink-500 to-pink-600',
    count: '89',
  },
  {
    label: 'Favoritos',
    icon: Heart,
    to: '/favorites',
    gradient: 'from-orange-500 to-orange-600',
    count: '12',
  },
];

// Feature highlights for hero
const FEATURES = [
  { icon: Zap, text: 'Importação instantânea' },
  { icon: Layers, text: 'Organização inteligente' },
  { icon: Sparkles, text: 'Preview em tempo real' },
];

export function Home() {
  const navigate = useNavigate();
  const isFavorite = useAppStore((state) => state.isFavorite);
  const toggleFavorite = useAppStore((state) => state.toggleFavorite);

  return (
    <div className="space-y-10 max-w-7xl mx-auto">
      {/* Hero Section */}
      <section className="relative overflow-hidden rounded-3xl">
        {/* Background gradient mesh */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-primary-600/5 to-accent/5" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-primary/10 via-transparent to-transparent" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,_var(--tw-gradient-stops))] from-accent/10 via-transparent to-transparent" />

        {/* Decorative elements */}
        <div className="absolute top-10 right-10 w-72 h-72 bg-primary/10 rounded-full blur-3xl animate-pulse" />
        <div
          className="absolute bottom-10 left-10 w-64 h-64 bg-accent/10 rounded-full blur-3xl animate-pulse"
          style={{ animationDelay: '1s' }}
        />

        {/* Content */}
        <div className="relative px-6 py-16 md:px-12 md:py-20">
          <div className="max-w-3xl">
            {/* Headline */}
            <h1
              className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-6 animate-fade-in"
              style={{ animationDelay: '100ms' }}
            >
              Sua biblioteca de <span className="gradient-text">assets Elementor</span> em um só
              lugar
            </h1>

            {/* Subheadline */}
            <p
              className="text-lg md:text-xl text-muted-foreground mb-8 max-w-2xl animate-fade-in"
              style={{ animationDelay: '200ms' }}
            >
              Organize, visualize e gerencie seus templates, sections e components. Importe direto
              para o Elementor com um clique.
            </p>

            {/* Features pills */}
            <div
              className="flex flex-wrap gap-3 mb-8 animate-fade-in"
              style={{ animationDelay: '300ms' }}
            >
              {FEATURES.map((feature, index) => (
                <div
                  key={index}
                  className="flex items-center gap-2 px-4 py-2 rounded-full bg-background/60 backdrop-blur-sm border border-border/50"
                >
                  <feature.icon className="h-4 w-4 text-primary" />
                  <span className="text-sm font-medium">{feature.text}</span>
                </div>
              ))}
            </div>

            {/* CTAs */}
            <div
              className="flex flex-wrap gap-4 animate-fade-in"
              style={{ animationDelay: '400ms' }}
            >
              <Button
                variant="gradient"
                size="lg"
                onClick={() => navigate('/upload')}
                className="rounded-xl"
              >
                <Plus className="h-5 w-5" />
                Novo Upload
                <ArrowRight className="h-4 w-4 ml-1" />
              </Button>
              <Button
                variant="outline"
                size="lg"
                onClick={() => navigate('/templates')}
                className="rounded-xl"
              >
                Explorar Biblioteca
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Cards */}
      <section className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {STAT_CARDS.map((stat, index) => (
          <GlassCard
            key={stat.label}
            hoverable
            glowOnHover
            className="cursor-pointer animate-fade-in"
            style={{ animationDelay: `${index * 100}ms` }}
            onClick={() => navigate(stat.to)}
          >
            <GlassCardContent className="p-5">
              <div className="flex items-center justify-between mb-4">
                <div className={`p-2.5 rounded-xl bg-gradient-to-br ${stat.gradient}`}>
                  <stat.icon className="h-5 w-5 text-white" />
                </div>
                <ChevronRight className="h-5 w-5 text-muted-foreground group-hover:translate-x-1 transition-transform" />
              </div>
              <div className="space-y-1">
                <p className="text-2xl font-bold">{stat.count}</p>
                <p className="text-sm text-muted-foreground">{stat.label}</p>
              </div>
            </GlassCardContent>
          </GlassCard>
        ))}
      </section>

      {/* Recent Additions */}
      <section className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">Adições Recentes</h2>
            <p className="text-muted-foreground mt-1">Últimos assets adicionados à biblioteca</p>
          </div>
          <Button
            variant="ghost"
            className="text-primary hover:text-primary"
            onClick={() => navigate('/templates')}
          >
            Ver Todos
            <ChevronRight className="h-4 w-4 ml-1" />
          </Button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {RECENT_ASSETS.slice(0, 6).map((asset, index) => (
            <div
              key={asset.id}
              className="animate-fade-in"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <AssetCard
                item={asset}
                isFavorite={isFavorite(asset.id)}
                onToggleFavorite={toggleFavorite}
              />
            </div>
          ))}
        </div>
      </section>

      {/* CTA Banner */}
      <section className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-primary to-primary-600 p-8 md:p-12">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0zNiAxOGMtOS45NCAwLTE4IDguMDYtMTggMThzOC4wNiAxOCAxOCAxOCAxOC04LjA2IDE4LTE4LTguMDYtMTgtMTgtMTh6bTAgMzJjLTcuNzMyIDAtMTQtNi4yNjgtMTQtMTRzNi4yNjgtMTQgMTQtMTQgMTQgNi4yNjggMTQgMTQtNi4yNjggMTQtMTQgMTR6IiBzdHJva2U9InJnYmEoMjU1LDI1NSwyNTUsMC4xKSIgc3Ryb2tlLXdpZHRoPSIyIi8+PC9nPjwvc3ZnPg==')] opacity-30" />

        <div className="relative flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="text-center md:text-left">
            <h3 className="text-2xl md:text-3xl font-bold text-foreground dark:text-foreground mb-2">
              Pronto para organizar seus assets?
            </h3>
            <p className="text-muted-foreground dark:text-muted-foreground">
              Comece a fazer upload dos seus templates e components agora mesmo.
            </p>
          </div>
          <Button
            variant="secondary"
            size="lg"
            onClick={() => navigate('/upload')}
            className="rounded-xl bg-card dark:bg-card text-foreground dark:text-foreground hover:bg-muted dark:hover:bg-muted shadow-lg"
          >
            <Plus className="h-5 w-5" />
            Começar Upload
          </Button>
        </div>
      </section>
    </div>
  );
}
