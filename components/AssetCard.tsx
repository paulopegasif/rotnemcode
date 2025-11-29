import React from 'react';
import { Layout, Layers, FileCode, Code2, Terminal, FileJson, Eye, MoreVertical } from 'lucide-react';

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

export type AssetType = 'Template' | 'Section' | 'CSS' | 'JS' | 'HTML';
export interface AssetItem {
  id: string;
  title: string;
  type: AssetType;
  updatedAt: string;
  thumbnail?: string;
}

export const AssetCard: React.FC<{ item: AssetItem }> = ({ item }) => {
  const getIcon = (type: AssetType) => {
    switch(type) {
      case 'Template': return <Layout className="h-8 w-8 text-blue-500" />;
      case 'Section': return <Layers className="h-8 w-8 text-purple-500" />;
      case 'CSS': return <FileCode className="h-8 w-8 text-sky-400" />;
      case 'JS': return <Code2 className="h-8 w-8 text-yellow-400" />;
      case 'HTML': return <Terminal className="h-8 w-8 text-orange-500" />;
      default: return <FileJson className="h-8 w-8" />;
    }
  };

  return (
    <Card className="group overflow-hidden flex flex-col hover:shadow-md transition-all duration-200">
      <div className="h-40 bg-muted w-full flex items-center justify-center relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-tr from-muted/50 to-muted/10" />
        <div className="scale-100 group-hover:scale-110 transition-transform duration-500">
          {getIcon(item.type)}
        </div>
        <div className="absolute top-2 right-2">
          <Badge variant="secondary" className="bg-background/80 backdrop-blur-sm shadow-sm">{item.type}</Badge>
        </div>
      </div>
      <div className="p-4 flex flex-col flex-grow">
        <h3 className="font-semibold text-lg leading-tight mb-1 truncate" title={item.title}>{item.title}</h3>
        <p className="text-xs text-muted-foreground mb-4">Updated {item.updatedAt}</p>
        <div className="mt-auto flex items-center justify-between">
          <Button variant="outline" size="sm" className="w-full mr-2 group-hover:border-primary/50 transition-colors">
            <Eye className="h-4 w-4 mr-2" />
            View Code
          </Button>
          <Button variant="ghost" size="icon" className="h-9 w-9">
            <MoreVertical className="h-4 w-4 text-muted-foreground" />
          </Button>
        </div>
      </div>
    </Card>
  );
};
