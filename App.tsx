import React, { useState } from 'react';
import { useTheme } from './useTheme';
import { Plus, Laptop, ChevronRight } from 'lucide-react';
import { Navbar } from './components/Navbar';
import { Sidebar, View } from './components/Sidebar';
import { AssetCard } from './components/AssetCard';
import { UploadForm } from './components/UploadForm';

// --- TYPES ---

import type { AssetItem } from './components/AssetCard';

// --- MOCK DATA ---

const RECENT_ASSETS: AssetItem[] = [
  { id: '1', title: 'Hero Section - SaaS Dark', type: 'Section', updatedAt: '2 hours ago' },
  { id: '2', title: 'Landing Page V2', type: 'Template', updatedAt: '1 day ago' },
  { id: '3', title: 'Sticky Header Effect', type: 'CSS', updatedAt: '2 days ago' },
  { id: '4', title: 'Dynamic Date Counter', type: 'JS', updatedAt: '3 days ago' },
  { id: '5', title: 'Pricing Table - Clean', type: 'Section', updatedAt: '1 week ago' },
  { id: '6', title: 'Custom Form Layout', type: 'HTML', updatedAt: '1 week ago' },
];

// --- UTILITY COMPONENTS (Simulating shadcn/ui) ---

const cn = (...classes: (string | undefined | null | false)[]) => {
  return classes.filter(Boolean).join(' ');
};

const Button: React.FC<React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: 'default' | 'outline' | 'ghost' | 'secondary', size?: 'sm' | 'md' | 'icon' }> = 
  ({ className, variant = 'default', size = 'md', ...props }) => {
    const variants = {
      default: 'bg-primary text-primary-foreground hover:bg-primary/90',
      outline: 'border border-input bg-background hover:bg-accent hover:text-accent-foreground',
      ghost: 'hover:bg-accent hover:text-accent-foreground',
      secondary: 'bg-secondary text-secondary-foreground hover:bg-secondary/80',
    };
    const sizes = {
      sm: 'h-9 rounded-md px-3',
      md: 'h-10 px-4 py-2',
      icon: 'h-10 w-10',
    };
    return (
      <button 
        className={cn(
          "inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
          variants[variant],
          sizes[size],
          className
        )}
        {...props}
      />
    );
};

const Input: React.FC<React.InputHTMLAttributes<HTMLInputElement>> = ({ className, ...props }) => (
  <input
    className={cn(
      "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
      className
    )}
    {...props}
  />
);

const Card: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className }) => (
  <div className={cn("rounded-lg border bg-card text-card-foreground shadow-sm", className)}>
    {children}
  </div>
);

const Badge: React.FC<{ children: React.ReactNode; variant?: 'default' | 'secondary' | 'outline'; className?: string }> = ({ children, variant = 'default', className }) => {
  const styles = {
    default: "border-transparent bg-primary text-primary-foreground hover:bg-primary/80",
    secondary: "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80",
    outline: "text-foreground",
  };
  return (
    <div className={cn("inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2", styles[variant], className)}>
      {children}
    </div>
  );
};

// --- FEATURE COMPONENTS ---

// extracted components are imported

// --- MAIN APP ---

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<View>('home');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { isDark: isDarkMode, toggle: toggleTheme } = useTheme();

  // Navigation Helper
  const navigate = (view: View) => {
    setCurrentView(view);
    setSidebarOpen(false); // Close sidebar on mobile navigation
  };

  const SidebarItem = ({ 
    icon: Icon, 
    label, 
    view, 
    isActive 
  }: { 
    icon: React.ElementType; 
    label: string; 
    view: View; 
    isActive: boolean;
  }) => (
    <button
      onClick={() => navigate(view)}
      className={cn(
        "w-full flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md transition-colors",
        isActive 
          ? "bg-primary/10 text-primary" 
          : "text-muted-foreground hover:bg-muted hover:text-foreground"
      )}
    >
      <Icon className="h-4 w-4" />
      {label}
    </button>
  );

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      
      <Navbar onToggleSidebar={() => setSidebarOpen(!sidebarOpen)} sidebarOpen={sidebarOpen} onLogoClick={() => navigate('home')} />

      <div className="flex-1 flex relative overflow-hidden">
        
        <Sidebar currentView={currentView} open={sidebarOpen} onNavigate={(v) => navigate(v)} />

        {/* OVERLAY FOR MOBILE */}
        {sidebarOpen && (
          <div 
            className="fixed inset-0 bg-black/50 z-20 md:hidden backdrop-blur-sm"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* MAIN CONTENT AREA */}
        <main className="flex-1 overflow-y-auto p-4 md:p-8 bg-muted/10 scroll-smooth">
          
          {/* HOME VIEW */}
          {currentView === 'home' && (
            <div className="space-y-8 max-w-7xl mx-auto animate-in fade-in duration-500">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                  <h1 className="text-3xl font-bold tracking-tight text-foreground">RotnemCode Library</h1>
                  <p className="text-muted-foreground mt-1">Organize, visualize and manage your Elementor assets in one place.</p>
                </div>
                <Button onClick={() => navigate('upload')} className="shadow-lg shadow-primary/20">
                  <Plus className="h-4 w-4 mr-2" />
                  New Upload
                </Button>
              </div>

              {/* Quick Stats / Filter Placeholder (Visual only) */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {['Templates', 'Sections', 'Snippets', 'Favorites'].map((stat) => (
                  <Card key={stat} className="p-4 hover:border-primary/50 cursor-pointer transition-colors flex items-center justify-between group">
                    <span className="font-medium">{stat}</span>
                    <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:translate-x-1 transition-transform" />
                  </Card>
                ))}
              </div>

              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-semibold tracking-tight">Recent Additions</h2>
                  <Button variant="ghost" size="sm" className="text-primary" onClick={() => navigate('templates')}>View All</Button>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {RECENT_ASSETS.map((asset) => (
                    <AssetCard key={asset.id} item={asset} />
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* UPLOAD CENTER VIEW */}
          {currentView === 'upload' && (
            <div className="animate-in slide-in-from-bottom-4 duration-500">
              <UploadForm />
            </div>
          )}

          {/* GENERIC CATEGORY VIEWS (Placeholder Logic) */}
          {['templates', 'sections', 'snippets-css', 'snippets-js', 'html-blocks', 'favorites'].includes(currentView) && (
            <div className="max-w-7xl mx-auto space-y-6 animate-in fade-in duration-500">
              <div className="flex items-center justify-between">
                 <h1 className="text-2xl font-bold capitalize">{currentView.replace('-', ' ')}</h1>
                 <Button variant="outline" onClick={() => navigate('upload')}>
                    <Plus className="h-4 w-4 mr-2" /> Add New
                 </Button>
              </div>
              
              {/* Filter Placeholder */}
              <div className="flex items-center gap-2 overflow-x-auto pb-2">
                 <Badge variant="default" className="cursor-pointer">All</Badge>
                 <Badge variant="secondary" className="cursor-pointer bg-background border">Pro</Badge>
                 <Badge variant="secondary" className="cursor-pointer bg-background border">Free</Badge>
                 <Badge variant="secondary" className="cursor-pointer bg-background border">Archived</Badge>
              </div>

              {/* Grid of filtered items */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {RECENT_ASSETS
                  .filter(a => {
                     if (currentView === 'favorites') return true; // Mock favorites
                     if (currentView === 'templates') return a.type === 'Template';
                     if (currentView === 'sections') return a.type === 'Section';
                     if (currentView === 'snippets-css') return a.type === 'CSS';
                     if (currentView === 'snippets-js') return a.type === 'JS';
                     if (currentView === 'html-blocks') return a.type === 'HTML';
                     return true;
                  })
                  .map((asset) => (
                    <AssetCard key={asset.id} item={asset} />
                  ))}
                  
                  {/* Empty State Mock */}
                  {RECENT_ASSETS.filter(a => {
                     if (currentView === 'favorites') return true;
                     if (currentView === 'templates') return a.type === 'Template';
                     if (currentView === 'sections') return a.type === 'Section';
                     if (currentView === 'snippets-css') return a.type === 'CSS';
                     if (currentView === 'snippets-js') return a.type === 'JS';
                     if (currentView === 'html-blocks') return a.type === 'HTML';
                     return true;
                  }).length === 0 && (
                    <div className="col-span-full py-20 text-center">
                      <div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-muted mb-4">
                        <Laptop className="h-8 w-8 text-muted-foreground" />
                      </div>
                      <h3 className="text-lg font-medium">No assets found</h3>
                      <p className="text-muted-foreground mt-1">Upload your first {currentView.replace('-', ' ')} to get started.</p>
                      <Button className="mt-4" onClick={() => navigate('upload')}>Upload Now</Button>
                    </div>
                  )}
              </div>
            </div>
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
                        <label className="text-right text-sm">Username</label>
                        <Input defaultValue="RotnemUser" className="col-span-3" />
                      </div>
                      <div className="grid grid-cols-4 items-center gap-4">
                        <label className="text-right text-sm">Email</label>
                        <Input defaultValue="user@rotnemcode.com" className="col-span-3" />
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
