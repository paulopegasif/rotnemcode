import React, { useState } from 'react';
import { FileJson, FileCode, Code2, Terminal, UploadCloud } from 'lucide-react';

const cn = (...classes: (string | undefined | null | false)[]) => classes.filter(Boolean).join(' ');

const Button: React.FC<React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: 'default' | 'outline' | 'ghost' | 'secondary', size?: 'sm' | 'md' | 'icon' }> = 
  ({ className, variant = 'default', size = 'md', ...props }) => {
    const variants = {
      default: 'bg-primary text-primary-foreground hover:bg-primary/90',
      outline: 'border border-input bg-background hover:bg-accent hover:text-accent-foreground',
      ghost: 'hover:bg-accent hover:text-accent-foreground',
      secondary: 'bg-secondary text-secondary-foreground hover:bg-secondary/80',
    } as const;
    const sizes = {
      sm: 'h-9 rounded-md px-3',
      md: 'h-10 px-4 py-2',
      icon: 'h-10 w-10',
    } as const;
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
  } as const;
  return (
    <div className={cn("inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2", styles[variant], className)}>
      {children}
    </div>
  );
};

export function UploadForm() {
  const [activeTab, setActiveTab] = useState<'template' | 'css' | 'js' | 'html'>('template');
  return (
    <div className="w-full max-w-4xl mx-auto">
      <div className="mb-8">
        <h2 className="text-2xl font-bold tracking-tight">Upload Center</h2>
        <p className="text-muted-foreground">Add new assets to your RotnemCode library.</p>
      </div>

      <Card className="p-6">
        <div className="flex space-x-2 border-b pb-4 mb-6 overflow-x-auto">
          <Button variant={activeTab === 'template' ? 'default' : 'ghost'} onClick={() => setActiveTab('template')} className="gap-2">
            <FileJson className="h-4 w-4" /> Elementor JSON
          </Button>
          <Button variant={activeTab === 'css' ? 'default' : 'ghost'} onClick={() => setActiveTab('css')} className="gap-2">
            <FileCode className="h-4 w-4" /> CSS Snippet
          </Button>
          <Button variant={activeTab === 'js' ? 'default' : 'ghost'} onClick={() => setActiveTab('js')} className="gap-2">
            <Code2 className="h-4 w-4" /> JS Snippet
          </Button>
          <Button variant={activeTab === 'html' ? 'default' : 'ghost'} onClick={() => setActiveTab('html')} className="gap-2">
            <Terminal className="h-4 w-4" /> HTML Block
          </Button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1.5">Title</label>
            <Input placeholder={`e.g., My ${activeTab === 'template' ? 'Awesome Landing Page' : 'Custom Script'}`} />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1.5">Description</label>
            <textarea 
              className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              placeholder="Describe what this asset does..."
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1.5">Tags</label>
            <Input placeholder="e.g., dark-mode, hero, form (comma separated)" />
          </div>

          {activeTab === 'template' && (
            <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-8 text-center hover:bg-muted/50 transition-colors cursor-pointer">
              <UploadCloud className="h-10 w-10 mx-auto text-muted-foreground mb-2" />
              <p className="text-sm font-medium">Click to upload .json file</p>
              <p className="text-xs text-muted-foreground">or drag and drop Elementor template file</p>
            </div>
          )}

          {(activeTab === 'css' || activeTab === 'js' || activeTab === 'html') && (
            <div>
              <label className="block text-sm font-medium mb-1.5">Code</label>
              <div className="relative">
                <textarea 
                  className="flex min-h-[200px] font-mono w-full rounded-md border border-input bg-slate-950 text-slate-50 px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  placeholder={activeTab === 'css' ? '.my-class { color: red; }' : activeTab === 'js' ? 'console.log("Hello World");' : '<div>Hello World</div>'}
                />
              </div>
            </div>
          )}

          <div className="pt-4 flex justify-end">
            <Button size="md" className="w-full sm:w-auto">Save to Library</Button>
          </div>
        </div>
      </Card>
    </div>
  );
}
