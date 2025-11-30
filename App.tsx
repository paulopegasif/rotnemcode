import React, { useState, useMemo } from 'react';

import type { AssetItem, ComponentCategory } from './components/AssetCard';
import { Navbar } from './components/Navbar';
import { Sidebar, View } from './components/Sidebar';
import { useFavorites } from './useFavorites';
import { useTheme } from './useTheme';
import { ComponentsView } from './views/ComponentsView';
import { Home } from './views/Home';
import { ListView } from './views/ListView';
import { UploadView } from './views/Upload';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';

// --- TYPES ---

// --- MOCK DATA ---

export const RECENT_ASSETS: AssetItem[] = [
  {
    id: '1',
    title: 'Hero Section - SaaS Dark',
    type: 'Section',
    category: 'hero',
    status: 'Free',
    updatedAt: '2 hours ago',
    code: '<section class="hero">...</section>',
  },
  {
    id: '2',
    title: 'Landing Page V2',
    type: 'Template',
    category: 'compositions',
    status: 'Pro',
    updatedAt: '1 day ago',
    code: '{"version": "2.0", "elements": []}',
  },
  {
    id: '3',
    title: 'Sticky Header Effect',
    type: 'CSS',
    category: 'animations',
    updatedAt: '2 days ago',
    code: 'header.sticky { position: fixed; top:0; }',
  },
  {
    id: '4',
    title: 'Dynamic Date Counter',
    type: 'JS',
    category: 'codes',
    updatedAt: '3 days ago',
    code: 'const days = Math.floor((Date.now()-START)/86400000);',
  },
  {
    id: '5',
    title: 'Pricing Table - Clean',
    type: 'Section',
    category: 'pricing',
    status: 'Pro',
    updatedAt: '1 week ago',
    code: '<section class="pricing">...</section>',
  },
  {
    id: '6',
    title: 'Custom Form Layout',
    type: 'HTML',
    category: 'forms',
    updatedAt: '1 week ago',
    code: '<form class="custom-form">...</form>',
  },
  {
    id: '7',
    title: 'Animated Button Hover',
    type: 'CSS',
    category: 'buttons',
    status: 'Free',
    updatedAt: '2 weeks ago',
    code: '.btn:hover { transform: translateY(-2px); }',
  },
  {
    id: '8',
    title: 'Image Carousel Auto',
    type: 'JS',
    category: 'carousels',
    updatedAt: '3 weeks ago',
    code: 'initCarousel({ autoplay: true });',
  },
  {
    id: '9',
    title: 'Smooth Scroll Animation',
    type: 'JS',
    category: 'advanced-animations',
    status: 'Pro',
    updatedAt: '1 month ago',
    code: 'document.querySelectorAll("a[href^=#]").forEach(...)',
  },
  {
    id: '10',
    title: 'Card Hover Effect',
    type: 'CSS',
    category: 'hovers',
    updatedAt: '1 month ago',
    code: '.card:hover { box-shadow: 0 0 0 2px var(--primary); }',
  },
  {
    id: '11',
    title: 'Custom Color Picker',
    type: 'JS',
    category: 'tools',
    updatedAt: '2 months ago',
    code: 'function initColorPicker() { /* ... */ }',
  },
  {
    id: '12',
    title: 'Dark Mode Toggle',
    type: 'JS',
    category: 'customizations',
    updatedAt: '2 months ago',
    code: 'document.documentElement.classList.toggle("dark")',
  },
  {
    id: '13',
    title: 'FAQ Accordion Clean',
    type: 'Section',
    category: 'faq',
    status: 'Free',
    updatedAt: '3 months ago',
    code: '<section class="faq">...</section>',
  },
  {
    id: '14',
    title: 'Footer Minimal',
    type: 'Section',
    category: 'footer',
    status: 'Free',
    updatedAt: '3 months ago',
    code: '<footer class="site-footer">...</footer>',
  },
];

// --- MAIN APP ---

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<View>('home');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<ComponentCategory | 'all'>('all');
  const { isDark: isDarkMode, toggle: toggleTheme } = useTheme();
  const { toggleFavorite, isFavorite } = useFavorites();

  const navigate = (view: View) => {
    setCurrentView(view);
    setSidebarOpen(false);
  };

  const filteredAssets = useMemo(() => {
    return RECENT_ASSETS.filter((a) => {
      const matchesSearch = a.title.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = selectedCategory === 'all' || a.category === selectedCategory;

      if (currentView === 'favorites') return matchesSearch && isFavorite(a.id);
      if (currentView === 'components') return matchesSearch && matchesCategory;
      return matchesSearch;
    });
  }, [currentView, searchQuery, selectedCategory, isFavorite]);

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <Navbar
        onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
        sidebarOpen={sidebarOpen}
        onLogoClick={() => navigate('home')}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
      />

      <div className="flex-1 flex relative overflow-hidden">
        <Sidebar currentView={currentView} open={sidebarOpen} onNavigate={(v) => navigate(v)} />

        {/* OVERLAY FOR MOBILE */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 bg-black/50 z-20 md:hidden backdrop-blur-sm"
            onClick={() => setSidebarOpen(false)}
            onKeyDown={(e) => e.key === 'Escape' && setSidebarOpen(false)}
            role="button"
            tabIndex={0}
            aria-label="Fechar sidebar"
          />
        )}

        {/* MAIN CONTENT AREA */}
        <main className="flex-1 overflow-y-auto p-4 md:p-8 bg-muted/10 scroll-smooth">
          {/* HOME VIEW */}
          {currentView === 'home' && (
            <Home
              recent={RECENT_ASSETS}
              onNavigate={(v) => navigate(v)}
              isFavorite={isFavorite}
              onToggleFavorite={toggleFavorite}
            />
          )}

          {/* TEMPLATES VIEW */}
          {currentView === 'templates' && (
            <ListView
              title="Templates"
              items={filteredAssets.filter((asset) => asset.type === 'Template')}
              onAdd={() => navigate('upload')}
              emptyMessage={
                searchQuery
                  ? 'Nenhum template encontrado.'
                  : 'Nenhum template disponível no momento.'
              }
              isFavorite={isFavorite}
              onToggleFavorite={toggleFavorite}
              highlight={searchQuery}
            />
          )}

          {/* SECTIONS VIEW */}
          {currentView === 'sections' && (
            <ListView
              title="Sections"
              items={filteredAssets.filter((asset) => asset.type === 'Section')}
              onAdd={() => navigate('upload')}
              emptyMessage={
                searchQuery
                  ? 'Nenhuma section encontrada.'
                  : 'Nenhuma section disponível no momento.'
              }
              isFavorite={isFavorite}
              onToggleFavorite={toggleFavorite}
              highlight={searchQuery}
            />
          )}

          {/* UPLOAD CENTER VIEW */}
          {currentView === 'upload' && <UploadView />}

          {/* COMPONENTS VIEW */}
          {currentView === 'components' && (
            <ComponentsView
              items={filteredAssets}
              onAdd={() => navigate('upload')}
              isFavorite={isFavorite}
              onToggleFavorite={toggleFavorite}
              selectedCategory={selectedCategory}
              onCategoryChange={setSelectedCategory}
              highlight={searchQuery}
            />
          )}

          {/* FAVORITES VIEW */}
          {currentView === 'favorites' && (
            <ListView
              title="Favoritos"
              items={filteredAssets}
              onAdd={() => navigate('upload')}
              emptyMessage={
                searchQuery
                  ? 'Nenhum favorito encontrado.'
                  : 'Adicione seus componentes favoritos para acesso rápido.'
              }
              isFavorite={isFavorite}
              onToggleFavorite={toggleFavorite}
              highlight={searchQuery}
            />
          )}

          {/* SETTINGS VIEW (Placeholder) */}
          {currentView === 'settings' && (
            <div className="max-w-2xl mx-auto space-y-6 animate-in fade-in duration-500">
              <h1 className="text-2xl font-bold">Settings</h1>
              <Card className="p-6 space-y-6">
                <div>
                  <h3 className="font-medium mb-2">Profile Settings</h3>
                  <div className="grid gap-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                      <label htmlFor="username" className="text-right text-sm">
                        Username
                      </label>
                      <Input id="username" defaultValue="RotnemUser" className="col-span-3" />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <label htmlFor="email" className="text-right text-sm">
                        Email
                      </label>
                      <Input id="email" defaultValue="user@rotnemcode.com" className="col-span-3" />
                    </div>
                  </div>
                </div>
                <div className="border-t pt-6">
                  <h3 className="font-medium mb-2">Preferences</h3>
                  <div className="flex items-center justify-between py-2">
                    <span className="text-sm">Dark Mode</span>
                    <Button variant="outline" size="sm" onClick={toggleTheme}>
                      {isDarkMode ? 'Enabled' : 'Disabled'}
                    </Button>
                  </div>
                </div>
              </Card>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default App;
