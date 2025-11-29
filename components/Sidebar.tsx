import React from 'react';
import { Layout, Layers, FileCode, Code2, Terminal, UploadCloud, Heart, Settings } from 'lucide-react';

const cn = (...classes: (string | undefined | null | false)[]) => classes.filter(Boolean).join(' ');

export type View = 
  | 'home' 
  | 'templates' 
  | 'sections' 
  | 'snippets-css' 
  | 'snippets-js' 
  | 'html-blocks' 
  | 'upload' 
  | 'favorites' 
  | 'settings';

function SidebarItem({ icon: Icon, label, view, isActive, onClick }: { icon: React.ElementType; label: string; view: View; isActive: boolean; onClick: (v: View) => void; }) {
  return (
    <button
      onClick={() => onClick(view)}
      className={cn(
        "w-full flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md transition-colors",
        isActive ? "bg-primary/10 text-primary" : "text-muted-foreground hover:bg-muted hover:text-foreground"
      )}
    >
      <Icon className="h-4 w-4" />
      {label}
    </button>
  );
}

export function Sidebar({ currentView, onNavigate, open }: { currentView: View; onNavigate: (v: View) => void; open: boolean; }) {
  return (
    <aside 
      className={cn(
        "fixed inset-y-0 left-0 z-30 w-64 transform bg-background border-r transition-transform duration-300 ease-in-out md:translate-x-0 md:static md:h-[calc(100vh-3.5rem)]",
        open ? "translate-x-0 shadow-xl" : "-translate-x-full"
      )}
    >
      <div className="h-full flex flex-col py-4">
        <div className="px-3 py-2 space-y-1">
          <p className="px-4 text-xs font-semibold text-muted-foreground mb-2 uppercase tracking-wider">Library</p>
          <SidebarItem icon={Layout} label="Templates" view="templates" isActive={currentView === 'templates'} onClick={onNavigate} />
          <SidebarItem icon={Layers} label="Sections" view="sections" isActive={currentView === 'sections'} onClick={onNavigate} />
          <SidebarItem icon={FileCode} label="Snippets CSS" view="snippets-css" isActive={currentView === 'snippets-css'} onClick={onNavigate} />
          <SidebarItem icon={Code2} label="Snippets JS" view="snippets-js" isActive={currentView === 'snippets-js'} onClick={onNavigate} />
          <SidebarItem icon={Terminal} label="HTML Blocks" view="html-blocks" isActive={currentView === 'html-blocks'} onClick={onNavigate} />
        </div>
        <div className="my-4 border-t mx-4" />
        <div className="px-3 space-y-1">
          <SidebarItem icon={UploadCloud} label="Upload Center" view="upload" isActive={currentView === 'upload'} onClick={onNavigate} />
          <SidebarItem icon={Heart} label="Favorites" view="favorites" isActive={currentView === 'favorites'} onClick={onNavigate} />
        </div>
        <div className="mt-auto px-3 pb-4">
          <SidebarItem icon={Settings} label="Settings" view="settings" isActive={currentView === 'settings'} onClick={onNavigate} />
        </div>
      </div>
    </aside>
  );
}
