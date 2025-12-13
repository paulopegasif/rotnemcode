import { Check, Copy, Download } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

import type { AssetItem } from './AssetCard';
import { CodeBlock } from './CodeBlock';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { cn } from '@/lib/utils';

interface CodePreviewDialogProps {
  item: AssetItem;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const languageMap: Record<AssetItem['type'], 'javascript' | 'css' | 'html' | 'json'> = {
  JS: 'javascript',
  CSS: 'css',
  HTML: 'html',
  Template: 'json',
  Section: 'html',
};

const typeColors: Record<AssetItem['type'], string> = {
  Template: 'from-blue-500 to-indigo-600',
  Section: 'from-purple-500 to-pink-600',
  CSS: 'from-sky-400 to-cyan-500',
  JS: 'from-yellow-400 to-orange-500',
  HTML: 'from-orange-500 to-red-500',
};

export function CodePreviewDialog({ item, open, onOpenChange }: CodePreviewDialogProps) {
  const language = languageMap[item.type];
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    if (!item.code) return;
    navigator.clipboard.writeText(item.code).then(() => {
      setCopied(true);
      toast.success('Código copiado!');
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const handleDownload = () => {
    if (!item.code) return;
    const extensions: Record<string, string> = {
      javascript: 'js',
      css: 'css',
      html: 'html',
      json: 'json',
    };
    const ext = extensions[language] || 'txt';
    const blob = new Blob([item.code], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${item.title.toLowerCase().replace(/\s+/g, '-')}.${ext}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast.success('Download iniciado!');
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[85vh] flex flex-col p-0 gap-0 overflow-hidden glass border-border/50">
        {/* Header */}
        <DialogHeader className="px-6 py-4 border-b border-border/50 bg-background/50">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-3 mb-2">
                <div
                  className={cn(
                    'h-8 w-8 rounded-lg flex items-center justify-center bg-gradient-to-br text-white text-xs font-bold',
                    typeColors[item.type]
                  )}
                >
                  {item.type.charAt(0)}
                </div>
                <DialogTitle className="text-lg font-semibold truncate">{item.title}</DialogTitle>
              </div>
              <DialogDescription className="flex items-center gap-2 text-sm">
                <Badge variant="secondary" className="text-xs">
                  {item.type}
                </Badge>
                {item.status && (
                  <Badge
                    variant={item.status === 'Pro' ? 'default' : 'secondary'}
                    className={cn(
                      'text-xs',
                      item.status === 'Pro' &&
                        'bg-gradient-to-r from-primary to-primary-600 text-white border-0'
                    )}
                  >
                    {item.status}
                  </Badge>
                )}
                <span className="text-muted-foreground">•</span>
                <span className="text-muted-foreground">Atualizado {item.updatedAt}</span>
              </DialogDescription>
            </div>

            {/* Action buttons */}
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={handleCopy} className="rounded-lg">
                {copied ? (
                  <>
                    <Check className="h-4 w-4 text-accent" />
                    Copiado
                  </>
                ) : (
                  <>
                    <Copy className="h-4 w-4" />
                    Copiar
                  </>
                )}
              </Button>
              <Button variant="outline" size="sm" onClick={handleDownload} className="rounded-lg">
                <Download className="h-4 w-4" />
                Download
              </Button>
            </div>
          </div>
        </DialogHeader>

        {/* Code content */}
        <div className="flex-1 overflow-auto p-4 bg-muted/30">
          <div className="rounded-xl overflow-hidden border border-border/50 shadow-sm">
            <CodeBlock
              code={item.code || '// Nenhum código disponível'}
              language={language}
              showLineNumbers
              className="[&_pre]:!rounded-none [&_pre]:!m-0"
            />
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-border/50 bg-background/50 flex items-center justify-between">
          <div className="text-xs text-muted-foreground">
            {item.code?.split('\n').length || 0} linhas • {language.toUpperCase()}
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onOpenChange(false)}
            className="rounded-lg"
          >
            Fechar
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
