import { zodResolver } from '@hookform/resolvers/zod';
import { Code2, FileCode, FileJson, Loader2, Terminal, Upload } from 'lucide-react';
import React, { useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';

import { useCreateAsset } from '../hooks/useCreateAsset';
import { assetSchema, type AssetFormData } from '../src/lib/schemas/assetSchema';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';

export function UploadForm() {
  const [activeTab, setActiveTab] = useState<'template' | 'css' | 'js' | 'html'>('template');
  const [jsonError, setJsonError] = useState<string | null>(null);
  const { createAsset, isCreating } = useCreateAsset();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    watch,
    setValue,
  } = useForm<AssetFormData>({
    resolver: zodResolver(assetSchema),
    defaultValues: {
      title: '',
      description: '',
      type: 'template',
      code: '',
      tags: [],
    },
    mode: 'onChange', // Validação em tempo real
  });

  // Monitorar mudanças no código para validar JSON em tempo real
  const codeValue = watch('code');
  React.useEffect(() => {
    if (activeTab === 'template' && codeValue) {
      try {
        JSON.parse(codeValue);
        setJsonError(null);
      } catch (error) {
        setJsonError(
          error instanceof SyntaxError ? `JSON inválido: ${error.message}` : 'JSON inválido'
        );
      }
    } else {
      setJsonError(null);
    }
  }, [codeValue, activeTab]);

  // Sincroniza tipo com o tab ativo
  React.useEffect(() => {
    setValue('type', activeTab);
  }, [activeTab, setValue]);

  // Drag & Drop para templates JSON
  const onDrop = React.useCallback(
    (acceptedFiles: File[]) => {
      if (acceptedFiles.length === 0) return;

      const file = acceptedFiles[0];

      // Validar tamanho (5 MB)
      if (file.size > 5 * 1024 * 1024) {
        toast.error('Arquivo muito grande', {
          description: 'O arquivo deve ter no máximo 5 MB.',
        });
        return;
      }

      // Ler conteúdo do arquivo
      const reader = new FileReader();
      reader.onload = (e) => {
        const content = e.target?.result as string;
        setValue('code', content);
        toast.success('Arquivo carregado!', {
          description: `${file.name} foi carregado com sucesso.`,
        });
      };
      reader.readAsText(file);
    },
    [setValue]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/json': ['.json'],
    },
    maxFiles: 1,
    disabled: isSubmitting || isCreating || activeTab !== 'template',
  });

  const onSubmit = async (data: AssetFormData) => {
    try {
      await createAsset(data);
      // useCreateAsset já faz redirect, mas podemos resetar form aqui se necessário
      reset();
    } catch (error) {
      // Erro já tratado no hook com toast
      console.error('Error submitting form:', error);
    }
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
              Title <span className="text-red-500">*</span>
            </label>
            <Input
              id="asset-title"
              placeholder={`e.g., My ${activeTab === 'template' ? 'Awesome Landing Page' : 'Custom Script'}`}
              {...register('title')}
              disabled={isSubmitting || isCreating}
              className={errors.title ? 'border-red-500' : ''}
            />
            {errors.title && <p className="text-sm text-red-500 mt-1">{errors.title.message}</p>}
          </div>

          <div>
            <label htmlFor="asset-description" className="block text-sm font-medium mb-1.5">
              Description
            </label>
            <Textarea
              id="asset-description"
              placeholder="Describe what this asset does..."
              {...register('description')}
              disabled={isSubmitting || isCreating}
              className={errors.description ? 'border-red-500' : ''}
            />
            {errors.description && (
              <p className="text-sm text-red-500 mt-1">{errors.description.message}</p>
            )}
          </div>

          <div>
            <label htmlFor="asset-tags" className="block text-sm font-medium mb-1.5">
              Tags
            </label>
            <Input
              id="asset-tags"
              placeholder="e.g., dark-mode, hero, form (comma separated)"
              {...register('tags', {
                setValueAs: (value: string | string[]) => {
                  // Se já for um array, retorna como está
                  if (Array.isArray(value)) return value;
                  // Se for string vazia, retorna array vazio
                  if (!value || typeof value !== 'string') return [];
                  // Converte string separada por vírgulas em array
                  return value
                    .split(',')
                    .map((tag) => tag.trim())
                    .filter((tag) => tag.length > 0);
                },
              })}
              disabled={isSubmitting || isCreating}
              className={errors.tags ? 'border-red-500' : ''}
            />
            {errors.tags && <p className="text-sm text-red-500 mt-1">{errors.tags.message}</p>}
          </div>

          {activeTab === 'template' && (
            <div>
              <label htmlFor="json-code" className="block text-sm font-medium mb-1.5">
                JSON Code <span className="text-red-500">*</span>
              </label>

              {/* Drag & Drop Zone */}
              <div
                {...getRootProps()}
                className={cn(
                  'mb-3 border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors',
                  isDragActive && 'border-primary bg-primary/5',
                  !isDragActive && 'border-muted-foreground/25 hover:border-primary/50',
                  (isSubmitting || isCreating) && 'opacity-50 cursor-not-allowed'
                )}
              >
                <input {...getInputProps()} />
                <Upload className="mx-auto h-8 w-8 mb-2 text-muted-foreground" />
                {isDragActive ? (
                  <p className="text-sm text-primary font-medium">Solte o arquivo JSON aqui...</p>
                ) : (
                  <>
                    <p className="text-sm text-muted-foreground mb-1">
                      Arraste um arquivo JSON ou clique para selecionar
                    </p>
                    <p className="text-xs text-muted-foreground">Máximo 5 MB</p>
                  </>
                )}
              </div>

              <Textarea
                id="json-code"
                className={`min-h-[200px] font-mono bg-slate-950 text-slate-50 ${
                  errors.code || jsonError ? 'border-red-500' : 'border-green-500/50'
                } ${!errors.code && !jsonError && codeValue ? 'border-l-4' : ''}`}
                placeholder='{"version": "2.0", "elements": []}'
                {...register('code')}
                disabled={isSubmitting || isCreating}
              />
              {jsonError && (
                <p className="text-sm text-yellow-600 dark:text-yellow-500 mt-1 flex items-center gap-1">
                  ⚠️ {jsonError}
                </p>
              )}
              {errors.code && <p className="text-sm text-red-500 mt-1">{errors.code.message}</p>}
              {!errors.code && !jsonError && codeValue && (
                <p className="text-sm text-green-600 dark:text-green-500 mt-1">✓ JSON válido</p>
              )}
            </div>
          )}

          {(activeTab === 'css' || activeTab === 'js' || activeTab === 'html') && (
            <div>
              <label htmlFor="code-input" className="block text-sm font-medium mb-1.5">
                Code <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <Textarea
                  id="code-input"
                  className={`min-h-[200px] font-mono bg-slate-950 text-slate-50 ${errors.code ? 'border-red-500' : ''}`}
                  placeholder={
                    activeTab === 'css'
                      ? '.my-class { color: red; }'
                      : activeTab === 'js'
                        ? 'console.log("Hello World");'
                        : '<div>Hello World</div>'
                  }
                  {...register('code')}
                  disabled={isSubmitting || isCreating}
                />
              </div>
              {errors.code && <p className="text-sm text-red-500 mt-1">{errors.code.message}</p>}
            </div>
          )}

          <div className="pt-4 flex gap-2 justify-end">
            <Button
              type="button"
              variant="outline"
              size="md"
              onClick={() => reset()}
              disabled={isSubmitting || isCreating}
            >
              Limpar
            </Button>
            <Button
              size="md"
              className="w-full sm:w-auto gap-2"
              onClick={handleSubmit(onSubmit)}
              disabled={isSubmitting || isCreating}
            >
              {isSubmitting || isCreating ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Salvando...
                </>
              ) : (
                'Salvar na Biblioteca'
              )}
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}
