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

function SidebarItem({
  icon: Icon,
  label,
  to,
}: {
  icon: React.ElementType;
  label: string;
  to: string;
}) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        cn(
          'w-full flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md transition-colors',
          isActive
            ? 'bg-primary/10 text-primary'
            : 'text-muted-foreground hover:bg-muted hover:text-foreground'
        )
      }
    >
      <Icon className="h-4 w-4" />
      {label}
    </NavLink>
  );
}

export function Sidebar({ isOpen, onClose: _onClose }: { isOpen: boolean; onClose: () => void }) {
  return (
    <aside
      className={cn(
        'fixed inset-y-0 left-0 z-30 w-64 transform bg-background border-r transition-transform duration-300 ease-in-out md:translate-x-0 md:static md:flex-shrink-0',
        isOpen ? 'translate-x-0 shadow-xl' : '-translate-x-full'
      )}
    >
      <div className="h-full flex flex-col py-4 overflow-y-auto">
        <div className="px-3 py-2 space-y-1">
          <p className="px-4 text-xs font-semibold text-muted-foreground mb-2 uppercase tracking-wider">
            Navigation
          </p>
          <SidebarItem icon={LayoutDashboard} label="Dashboard" to="/dashboard" />
        </div>
        <div className="my-4 border-t mx-4" />
        <div className="px-3 py-2 space-y-1">
          <p className="px-4 text-xs font-semibold text-muted-foreground mb-2 uppercase tracking-wider">
            Library
          </p>
          <SidebarItem icon={Layout} label="Templates" to="/templates" />
          <SidebarItem icon={FileCode} label="Sections" to="/sections" />
          <SidebarItem icon={Layers} label="Components" to="/components" />
        </div>
        <div className="my-4 border-t mx-4" />
        <div className="px-3 space-y-1">
          <SidebarItem icon={FolderOpen} label="My Assets" to="/my-assets" />
          <SidebarItem icon={UploadCloud} label="Upload Center" to="/upload" />
          <SidebarItem icon={Heart} label="Favorites" to="/favorites" />
        </div>
        <div className="mt-auto px-3 pb-4">
          <SidebarItem icon={Settings} label="Settings" to="/settings" />
        </div>
      </div>
    </aside>
  );
}
