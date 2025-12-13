import { Bell, Layers, LogIn, LogOut, Menu, Moon, Search, Sun, User, X } from 'lucide-react';
import React from 'react';
import { useNavigate } from 'react-router-dom';

import { useAuth } from '../contexts/AuthContext';
import { useGetQuota } from '../hooks/useGetQuota';
import { useAppStore } from '../store/useAppStore';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export function Navbar({
  onToggleSidebar,
  sidebarOpen,
}: {
  onToggleSidebar: () => void;
  sidebarOpen: boolean;
}) {
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  const { quota } = useGetQuota();
  const isDark = useAppStore((state) => state.isDark);
  const toggleTheme = useAppStore((state) => state.toggleTheme);
  const searchQuery = useAppStore((state) => state.searchQuery);
  const setSearchQuery = useAppStore((state) => state.setSearchQuery);

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex h-14 items-center px-4 md:px-6 gap-4">
        <button
          className="md:hidden p-2 -ml-2 text-muted-foreground"
          onClick={onToggleSidebar}
          onKeyDown={(e) => e.key === 'Enter' && onToggleSidebar()}
          aria-label={sidebarOpen ? 'Fechar menu' : 'Abrir menu'}
        >
          {sidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>

        <button
          className="flex items-center gap-2 font-bold text-xl cursor-pointer bg-transparent border-none p-0"
          onClick={() => navigate('/')}
          onKeyDown={(e) => e.key === 'Enter' && navigate('/')}
          aria-label="Ir para home"
        >
          <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center text-primary-foreground">
            <Layers className="h-5 w-5" />
          </div>
          <span className="hidden sm:inline-block">RotnemCode</span>
        </button>

        <div className="flex-1 flex justify-center max-w-md mx-auto">
          <div className="relative w-full">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search templates, snippets..."
              className="w-full pl-9 bg-muted/50 border-transparent focus:bg-background focus:border-input transition-all"
              aria-label="Buscar na biblioteca"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleTheme}
            title="Toggle Theme"
            aria-label="Alternar tema"
          >
            {isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          </Button>
          <Button variant="ghost" size="icon" className="relative" aria-label="Notificações">
            <Bell className="h-5 w-5" />
            <span className="absolute top-2 right-2 h-2 w-2 rounded-full bg-red-500 ring-2 ring-background"></span>
          </Button>
          {user ? (
            <>
              {quota && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="hidden sm:flex items-center gap-2"
                  onClick={() => navigate('/pricing')}
                  title={`Plano: ${quota.tier} (${quota.current_public_count}/${quota.max_allowed} assets públicos)`}
                >
                  <Badge
                    variant={quota.tier === 'pro' ? 'default' : 'secondary'}
                    className={`text-xs ${
                      quota.tier === 'pro'
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-400 text-white dark:bg-gray-600'
                    }`}
                  >
                    {quota.tier.toUpperCase()}
                  </Badge>
                </Button>
              )}
              <div className="hidden sm:flex items-center gap-2 text-sm">
                <User className="h-4 w-4 text-muted-foreground" />
                <span className="text-muted-foreground">{user.email}</span>
              </div>
              <Button variant="ghost" size="icon" onClick={handleSignOut} aria-label="Sair">
                <LogOut className="h-5 w-5" />
              </Button>
            </>
          ) : (
            <Button variant="ghost" size="sm" onClick={() => navigate('/login')}>
              <LogIn className="h-4 w-4 mr-2" />
              Login
            </Button>
          )}
        </div>
      </div>
    </header>
  );
}
