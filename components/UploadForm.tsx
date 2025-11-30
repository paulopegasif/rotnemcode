import { Code2, FileCode, FileJson, Terminal } from 'lucide-react';
import React, { useState } from 'react';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

export function UploadForm() {
  const [activeTab, setActiveTab] = useState<'template' | 'css' | 'js' | 'html'>('template');
  const [code, setCode] = useState('');

  const validateCode = () => {
    if (!code.trim()) {
      toast.error('Código vazio', {
        description: 'Por favor, adicione o código antes de salvar.',
      });
      return false;
    }

    if (activeTab === 'template') {
      try {
        const parsed = JSON.parse(code);
        if (!parsed.version && !parsed.content && !parsed.elements) {
          toast.error('Estrutura JSON inválida', {
            description:
              'JSON deve conter "version", "content" ou "elements" (estrutura Elementor).',
          });
          return false;
        }
      } catch {
        toast.error('JSON inválido', {
          description: 'Verifique a sintaxe do JSON.',
        });
        return false;
      }
    }

    if (activeTab === 'css') {
      if (!code.includes('{') || !code.includes('}')) {
        toast.error('CSS inválido', {
          description: 'CSS deve conter pelo menos um bloco { }.',
        });
        return false;
      }
    }

    if (activeTab === 'js') {
      if (code.includes('eval(') || code.includes('Function(')) {
        toast.error('Código inseguro detectado', {
          description: 'Código JS contém funções potencialmente inseguras (eval, Function).',
        });
        return false;
      }
    }

    toast.success('Código validado!', {
      description: 'O código passou em todas as validações.',
    });
    return true;
  };

  return (
    <div className="w-full max-w-4xl mx-auto">
      <div className="mb-8">
        <h2 className="text-2xl font-bold tracking-tight">Upload Center</h2>
        <p className="text-muted-foreground">Add new assets to your RotnemCode library.</p>
      </div>

      <Card className="p-6">
        <div className="flex space-x-2 border-b pb-4 mb-6 overflow-x-auto">
          <Button
            variant={activeTab === 'template' ? 'default' : 'ghost'}
            onClick={() => setActiveTab('template')}
            className="gap-2"
          >
            <FileJson className="h-4 w-4" /> Elementor JSON
          </Button>
          <Button
            variant={activeTab === 'css' ? 'default' : 'ghost'}
            onClick={() => setActiveTab('css')}
            className="gap-2"
          >
            <FileCode className="h-4 w-4" /> CSS Snippet
          </Button>
          <Button
            variant={activeTab === 'js' ? 'default' : 'ghost'}
            onClick={() => setActiveTab('js')}
            className="gap-2"
          >
            <Code2 className="h-4 w-4" /> JS Snippet
          </Button>
          <Button
            variant={activeTab === 'html' ? 'default' : 'ghost'}
            onClick={() => setActiveTab('html')}
            className="gap-2"
          >
            <Terminal className="h-4 w-4" /> HTML Block
          </Button>
        </div>

        <div className="space-y-4">
          <div>
            <label htmlFor="asset-title" className="block text-sm font-medium mb-1.5">
              Title
            </label>
            <Input
              id="asset-title"
              placeholder={`e.g., My ${activeTab === 'template' ? 'Awesome Landing Page' : 'Custom Script'}`}
            />
          </div>
          <div>
            <label htmlFor="asset-description" className="block text-sm font-medium mb-1.5">
              Description
            </label>
            <Textarea id="asset-description" placeholder="Describe what this asset does..." />
          </div>
          <div>
            <label htmlFor="asset-tags" className="block text-sm font-medium mb-1.5">
              Tags
            </label>
            <Input id="asset-tags" placeholder="e.g., dark-mode, hero, form (comma separated)" />
          </div>

          {activeTab === 'template' && (
            <div>
              <label htmlFor="json-code" className="block text-sm font-medium mb-1.5">
                JSON Code
              </label>
              <Textarea
                id="json-code"
                className="min-h-[200px] font-mono bg-slate-950 text-slate-50"
                placeholder='{"version": "2.0", "elements": []}'
                value={code}
                onChange={(e) => setCode(e.target.value)}
              />
            </div>
          )}

          {(activeTab === 'css' || activeTab === 'js' || activeTab === 'html') && (
            <div>
              <label htmlFor="code-input" className="block text-sm font-medium mb-1.5">
                Code
              </label>
              <div className="relative">
                <Textarea
                  id="code-input"
                  className="min-h-[200px] font-mono bg-slate-950 text-slate-50"
                  placeholder={
                    activeTab === 'css'
                      ? '.my-class { color: red; }'
                      : activeTab === 'js'
                        ? 'console.log("Hello World");'
                        : '<div>Hello World</div>'
                  }
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                />
              </div>
            </div>
          )}

          <div className="pt-4 flex gap-2 justify-end">
            <Button type="button" variant="outline" size="md" onClick={validateCode}>
              Validar
            </Button>
            <Button
              size="md"
              className="w-full sm:w-auto"
              onClick={() => {
                if (validateCode()) {
                  toast.success('Salvo com sucesso!', {
                    description: 'O asset foi adicionado à sua biblioteca.',
                  });
                }
              }}
            >
              Salvar na Biblioteca
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}
