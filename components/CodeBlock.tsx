import { Copy } from 'lucide-react';
import { useState } from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneDark, oneLight } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { toast } from 'sonner';

import { useAppStore } from '../store/useAppStore';

import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface CodeBlockProps {
  code: string;
  language?: 'javascript' | 'typescript' | 'css' | 'html' | 'json' | 'jsx' | 'tsx';
  showLineNumbers?: boolean;
  className?: string;
}

export function CodeBlock({
  code,
  language = 'javascript',
  showLineNumbers = true,
  className,
}: CodeBlockProps) {
  const [copied, setCopied] = useState(false);
  const isDark = useAppStore((state) => state.isDark);

  const handleCopy = () => {
    navigator.clipboard.writeText(code).then(() => {
      setCopied(true);
      toast.success('Código copiado!', {
        description: 'O código foi copiado para a área de transferência.',
      });
      setTimeout(() => setCopied(false), 1800);
    });
  };

  return (
    <div className={cn('relative group', className)}>
      <Button
        size="sm"
        variant="outline"
        className="absolute top-2 right-2 z-10 opacity-0 group-hover:opacity-100 transition-opacity"
        onClick={handleCopy}
      >
        {copied ? (
          <>
            <span className="text-green-500 mr-2">✓</span>
            Copiado
          </>
        ) : (
          <>
            <Copy className="h-3 w-3 mr-2" />
            Copiar
          </>
        )}
      </Button>
      <SyntaxHighlighter
        language={language}
        style={isDark ? oneDark : oneLight}
        showLineNumbers={showLineNumbers}
        customStyle={{
          margin: 0,
          borderRadius: '0.5rem',
          fontSize: '0.875rem',
        }}
        codeTagProps={{
          style: {
            fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace',
          },
        }}
      >
        {code}
      </SyntaxHighlighter>
    </div>
  );
}
