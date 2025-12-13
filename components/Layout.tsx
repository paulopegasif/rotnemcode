import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Toaster } from 'sonner';

import { useAppStore } from '../store/useAppStore';

import { Breadcrumbs } from './Breadcrumbs';
import { Navbar } from './Navbar';
import { Sidebar } from './Sidebar';

export function Layout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const isDark = useAppStore((state) => state.isDark);

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <Toaster theme={isDark ? 'dark' : 'light'} richColors position="top-right" />
      <Navbar onToggleSidebar={() => setSidebarOpen(!sidebarOpen)} sidebarOpen={sidebarOpen} />
      <div className="flex flex-1 min-h-[calc(100vh-3.5rem)]">
        <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        <main className="flex-1 overflow-y-auto p-6">
          <Breadcrumbs />
          <Outlet />
        </main>
      </div>
    </div>
  );
}
