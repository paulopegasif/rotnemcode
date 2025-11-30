import React, { useState } from 'react';
import { FileJson, FileCode, Code2, Terminal, UploadCloud } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export function UploadForm() {
  const [activeTab, setActiveTab] = useState<'template' | 'css' | 'js' | 'html'>('template');
  const [code, setCode] = useState('');
  const [validationError, setValidationError] = useState<string | null>(null);
  const [validationSuccess, setValidationSuccess] = useState(false);

  const validateCode = () => {
    setValidationError(null);
    setValidationSuccess(false);

    if (!code.trim()) {
      setValidationError('Por favor, adicione o código antes de salvar.');
      return false;
    }

    if (activeTab === 'template') {
      try {
        const parsed = JSON.parse(code);
        if (!parsed.version && !parsed.content && !parsed.elements) {
          setValidationError('JSON deve conter "version", "content" ou "elements" (estrutura Elementor).');
          return false;
        }
      } catch (e) {
        setValidationError('JSON inválido. Verifique a sintaxe.');
        return false;
      }
    }

    if (activeTab === 'css') {
      if (!code.includes('{') || !code.includes('}')) {
        setValidationError('CSS deve conter pelo menos um bloco { }.');
        return false;
      }
    }

    if (activeTab === 'js') {
      if (code.includes('eval(') || code.includes('Function(')) {
        setValidationError('Código JS contém funções potencialmente inseguras (eval, Function).');
        return false;
      }
    }

    setValidationSuccess(true);
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
            <Textarea 
              placeholder="Describe what this asset does..."
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1.5">Tags</label>
            <Input placeholder="e.g., dark-mode, hero, form (comma separated)" />
          </div>



          {activeTab === 'template' && (
            <div>
              <label className="block text-sm font-medium mb-1.5">JSON Code</label>
              <Textarea 
                className="min-h-[200px] font-mono bg-slate-950 text-slate-50"
                placeholder='{"version": "2.0", "elements": []}'
                value={code}
                onChange={(e) => setCode(e.target.value)}
              />
            </div>
          )}

          {(activeTab === 'css' || activeTab === 'js' || activeTab === 'html') && (
            <div>
              <label className="block text-sm font-medium mb-1.5">Code</label>
              <div className="relative">
                <Textarea 
                  className="min-h-[200px] font-mono bg-slate-950 text-slate-50"
                  placeholder={activeTab === 'css' ? '.my-class { color: red; }' : activeTab === 'js' ? 'console.log("Hello World");' : '<div>Hello World</div>'}
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                />
              </div>
            </div>
          )}

          {validationError && (
            <div className="p-3 rounded-md bg-red-500/10 border border-red-500/50 text-red-600 dark:text-red-400 text-sm" role="alert">
              {validationError}
            </div>
          )}

          {validationSuccess && (
            <div className="p-3 rounded-md bg-green-500/10 border border-green-500/50 text-green-600 dark:text-green-400 text-sm" role="status">
              ✓ Validação bem-sucedida! Pronto para salvar.
            </div>
          )}

          <div className="pt-4 flex gap-2 justify-end">
            <Button type="button" variant="outline" size="md" onClick={validateCode}>Validar</Button>
            <Button size="md" className="w-full sm:w-auto" onClick={() => validateCode() && alert('Salvando...')}>Salvar na Biblioteca</Button>
          </div>
        </div>
      </Card>
    </div>
  );
}
