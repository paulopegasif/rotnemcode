import {
  Bell,
  ChevronDown,
  Layers,
  LogIn,
  LogOut,
  Menu,
  Moon,
  Search,
  Settings,
  Sun,
  User,
  X,
} from 'lucide-react';
import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import { useAuth } from '../contexts/AuthContext';
import { useGetQuota } from '../hooks/useGetQuota';
import { useAppStore } from '../store/useAppStore';

import { Avatar } from '@/components/ui/avatar';
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

  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSignOut = async () => {
    setDropdownOpen(false);
    await signOut();
    navigate('/');
  };

  // Get user initials for avatar
  const userInitials = user?.email ? user.email.split('@')[0].slice(0, 2).toUpperCase() : 'U';

  return (
    <header className="fixed top-0 left-0 right-0 z-40 h-16 border-b border-border/50 glass">
      <div className="flex h-full items-center px-4 md:px-6 gap-4">
        {/* Mobile menu toggle */}
        <button
          className="md:hidden p-2 -ml-2 text-muted-foreground hover:text-foreground transition-colors rounded-lg hover:bg-accent/10"
          onClick={onToggleSidebar}
          onKeyDown={(e) => e.key === 'Enter' && onToggleSidebar()}
          aria-label={sidebarOpen ? 'Fechar menu' : 'Abrir menu'}
        >
          {sidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>

        {/* Logo */}
        <button
          className="flex items-center gap-2.5 font-bold text-xl cursor-pointer bg-transparent border-none p-0 group"
          onClick={() => navigate('/')}
          onKeyDown={(e) => e.key === 'Enter' && navigate('/')}
          aria-label="Ir para home"
        >
          <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-primary to-primary-600 flex items-center justify-center text-white shadow-md group-hover:shadow-glow transition-shadow duration-300">
            <Layers className="h-5 w-5" />
          </div>
          <span className="hidden sm:inline-block gradient-text font-semibold">RotnemCode</span>
        </button>

        {/* Search */}
        <div className="flex-1 flex justify-center max-w-md mx-auto">
          <div className="relative w-full group">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground dark:text-muted-foreground group-focus-within:text-primary transition-colors" />
            <Input
              type="search"
              placeholder="Buscar templates, snippets..."
              className="w-full pl-10 pr-4 h-10 rounded-xl"
              aria-label="Buscar na biblioteca"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        {/* Right side actions */}
        <div className="flex items-center gap-1.5">
          {/* Theme toggle */}
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleTheme}
            title={isDark ? 'Modo claro' : 'Modo escuro'}
            aria-label="Alternar tema"
            className="rounded-xl hover:bg-accent/10"
          >
            {isDark ? (
              <Sun className="h-5 w-5 text-yellow-500" />
            ) : (
              <Moon className="h-5 w-5 text-primary" />
            )}
          </Button>

          {/* Notifications */}
          <Button
            variant="ghost"
            size="icon"
            className="relative rounded-xl hover:bg-accent/10"
            aria-label="Notificações"
          >
            <Bell className="h-5 w-5" />
            <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-destructive ring-2 ring-background animate-pulse" />
          </Button>

          {user ? (
            <>
              {/* Plan badge */}
              {quota && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="hidden md:flex items-center gap-2 rounded-xl hover:bg-accent/10"
                  onClick={() => navigate('/pricing')}
                  title={`${quota.current_public_count}/${quota.max_allowed} assets públicos`}
                >
                  <Badge
                    variant={quota.tier === 'pro' ? 'default' : 'secondary'}
                    className={`text-xs font-medium ${
                      quota.tier === 'pro'
                        ? 'bg-gradient-to-r from-primary to-primary-600 text-white border-0'
                        : ''
                    }`}
                  >
                    {quota.tier.toUpperCase()}
                  </Badge>
                </Button>
              )}

              {/* User dropdown */}
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="flex items-center gap-2 p-1.5 rounded-xl hover:bg-accent/10 transition-colors"
                  aria-label="Menu do usuário"
                  aria-expanded={dropdownOpen}
                >
                  <Avatar fallback={userInitials} size="sm" status="online" />
                  <ChevronDown
                    className={`hidden sm:block h-4 w-4 text-muted-foreground transition-transform duration-200 ${
                      dropdownOpen ? 'rotate-180' : ''
                    }`}
                  />
                </button>

                {/* Dropdown menu */}
                {dropdownOpen && (
                  <div className="absolute right-0 mt-2 w-64 rounded-xl glass border border-border/50 shadow-lg animate-scale-in origin-top-right">
                    <div className="p-3 border-b border-border/50">
                      <div className="flex items-center gap-3">
                        <Avatar fallback={userInitials} size="md" />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium truncate">
                            {user.email?.split('@')[0]}
                          </p>
                          <p className="text-xs text-muted-foreground truncate">{user.email}</p>
                        </div>
                      </div>
                    </div>
                    <div className="p-1.5">
                      <button
                        onClick={() => {
                          setDropdownOpen(false);
                          navigate('/my-assets');
                        }}
                        className="w-full flex items-center gap-3 px-3 py-2 text-sm rounded-lg hover:bg-accent/10 transition-colors"
                      >
                        <User className="h-4 w-4 text-muted-foreground" />
                        Meus Assets
                      </button>
                      <button
                        onClick={() => {
                          setDropdownOpen(false);
                          navigate('/settings');
                        }}
                        className="w-full flex items-center gap-3 px-3 py-2 text-sm rounded-lg hover:bg-accent/10 transition-colors"
                      >
                        <Settings className="h-4 w-4 text-muted-foreground" />
                        Configurações
                      </button>
                      <div className="my-1.5 border-t border-border/50" />
                      <button
                        onClick={handleSignOut}
                        className="w-full flex items-center gap-3 px-3 py-2 text-sm rounded-lg hover:bg-destructive/10 text-destructive transition-colors"
                      >
                        <LogOut className="h-4 w-4" />
                        Sair
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </>
          ) : (
            <Button
              variant="gradient"
              size="sm"
              onClick={() => navigate('/login')}
              className="rounded-xl"
            >
              <LogIn className="h-4 w-4" />
              Entrar
            </Button>
          )}
        </div>
      </div>
    </header>
  );
}
