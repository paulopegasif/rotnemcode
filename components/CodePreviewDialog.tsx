import { Check, Copy } from 'lucide-react';
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

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        hideCloseButton
        className="max-w-4xl max-h-[85vh] flex flex-col p-0 gap-0 overflow-hidden rounded-2xl border-border/50 shadow-2xl"
      >
        {/* Header */}
        <DialogHeader className="px-6 py-4 border-b border-border/50">
          <div className="flex items-center justify-between gap-4">
            <div className="flex-1 min-w-0">
              <DialogTitle className="text-lg font-semibold truncate mb-1">
                {item.title}
              </DialogTitle>
              <DialogDescription className="flex items-center gap-2 text-sm">
                <Badge variant="secondary" className="text-xs">
                  {item.type}
                </Badge>
                <span className="text-muted-foreground">•</span>
                <span className="text-muted-foreground">Atualizado {item.updatedAt}</span>
              </DialogDescription>
            </div>

            {/* Action button */}
            <Button
              variant={copied ? 'default' : 'outline'}
              size="sm"
              onClick={handleCopy}
              className="rounded-xl"
            >
              {copied ? (
                <>
                  <Check className="h-4 w-4" />
                  Copiado
                </>
              ) : (
                <>
                  <Copy className="h-4 w-4" />
                  Copiar código
                </>
              )}
            </Button>
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
            variant="secondary"
            size="sm"
            onClick={() => onOpenChange(false)}
            className="rounded-lg px-6"
          >
            Fechar
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
