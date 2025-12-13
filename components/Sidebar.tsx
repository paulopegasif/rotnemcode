import {
  FileCode,
  FolderOpen,
  Heart,
  Layers,
  Layout,
  Settings,
  UploadCloud,
  LayoutDashboard,
} from 'lucide-react';
import React from 'react';
import { NavLink } from 'react-router-dom';

import { cn } from '@/lib/utils';

export type View =
  | 'home'
  | 'templates'
  | 'sections'
  | 'components'
  | 'upload'
  | 'favorites'
  | 'settings';

interface SidebarItemProps {
  icon: React.ElementType;
  label: string;
  to: string;
  badge?: string;
  accentColor?: 'primary' | 'accent' | 'pink' | 'orange';
}

const accentColorClasses = {
  primary: {
    active: 'bg-primary/10 text-primary border-l-primary',
    iconBg: 'bg-primary/10',
    iconColor: 'text-primary',
  },
  accent: {
    active: 'bg-accent/10 text-accent border-l-accent',
    iconBg: 'bg-accent/10',
    iconColor: 'text-accent',
  },
  pink: {
    active: 'bg-pink-500/10 text-pink-500 border-l-pink-500',
    iconBg: 'bg-pink-500/10',
    iconColor: 'text-pink-500',
  },
  orange: {
    active: 'bg-orange-500/10 text-orange-500 border-l-orange-500',
    iconBg: 'bg-orange-500/10',
    iconColor: 'text-orange-500',
  },
};

function SidebarItem({ icon: Icon, label, to, badge, accentColor = 'primary' }: SidebarItemProps) {
  const colors = accentColorClasses[accentColor];

  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        cn(
          'w-full flex items-center gap-3 px-3 py-2.5 text-sm font-medium rounded-xl transition-all duration-200',
          'border-l-2 border-transparent',
          'hover:bg-muted/50',
          isActive ? cn(colors.active, 'shadow-sm') : 'text-muted-foreground hover:text-foreground'
        )
      }
    >
      {({ isActive }) => (
        <>
          <div
            className={cn(
              'flex items-center justify-center h-8 w-8 rounded-lg transition-colors duration-200',
              isActive ? colors.iconBg : 'bg-transparent'
            )}
          >
            <Icon
              className={cn(
                'h-4 w-4 transition-colors duration-200',
                isActive ? colors.iconColor : ''
              )}
            />
          </div>
          <span className="flex-1">{label}</span>
          {badge && (
            <span className="px-2 py-0.5 text-xs font-medium rounded-full bg-primary/10 text-primary">
              {badge}
            </span>
          )}
        </>
      )}
    </NavLink>
  );
}

function SidebarSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="px-3 py-2 space-y-1">
      <p className="px-3 text-xs font-semibold text-muted-foreground mb-3 uppercase tracking-wider flex items-center gap-2">
        {title}
      </p>
      {children}
    </div>
  );
}

export function Sidebar({ isOpen, onClose: _onClose }: { isOpen: boolean; onClose: () => void }) {
  return (
    <aside
      className={cn(
        'fixed inset-y-0 left-0 z-30 w-64 transform border-r border-border/50 transition-all duration-300 ease-spring',
        'bg-background/80 backdrop-blur-xl',
        'md:translate-x-0 md:static md:flex-shrink-0',
        isOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full'
      )}
    >
      <div className="h-full flex flex-col pt-20 md:pt-4 overflow-y-auto">
        {/* Navigation Section */}
        <SidebarSection title="Navegação">
          <SidebarItem
            icon={LayoutDashboard}
            label="Dashboard"
            to="/dashboard"
            accentColor="primary"
          />
        </SidebarSection>

        <div className="my-2 mx-4">
          <div className="h-px bg-gradient-to-r from-transparent via-border to-transparent" />
        </div>

        {/* Library Section */}
        <SidebarSection title="Biblioteca">
          <SidebarItem icon={Layout} label="Templates" to="/templates" accentColor="primary" />
          <SidebarItem icon={FileCode} label="Sections" to="/sections" accentColor="accent" />
          <SidebarItem icon={Layers} label="Components" to="/components" accentColor="pink" />
        </SidebarSection>

        <div className="my-2 mx-4">
          <div className="h-px bg-gradient-to-r from-transparent via-border to-transparent" />
        </div>

        {/* Personal Section */}
        <SidebarSection title="Pessoal">
          <SidebarItem icon={FolderOpen} label="Meus Assets" to="/my-assets" accentColor="orange" />
          <SidebarItem icon={UploadCloud} label="Upload Center" to="/upload" accentColor="accent" />
          <SidebarItem icon={Heart} label="Favoritos" to="/favorites" accentColor="pink" />
        </SidebarSection>

        {/* Settings at bottom */}
        <div className="mt-auto px-3 pb-4">
          <div className="h-px bg-gradient-to-r from-transparent via-border to-transparent mb-4" />
          <SidebarItem icon={Settings} label="Configurações" to="/settings" accentColor="primary" />
        </div>
      </div>
    </aside>
  );
}
