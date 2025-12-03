import type { AssetItem } from './AssetCard';
import { CodeBlock } from './CodeBlock';

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

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[80vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>{item.title}</DialogTitle>
          <DialogDescription>
            {item.type} • {item.status} • Atualizado {item.updatedAt}
          </DialogDescription>
        </DialogHeader>

        <div className="flex-1 overflow-auto">
          <CodeBlock code={item.code || ''} language={language} showLineNumbers />
        </div>
      </DialogContent>
    </Dialog>
  );
}
