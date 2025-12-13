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
      tags: '', // String vazia em vez de array para compatibilidade com input
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
      <div className="mb-8 space-y-2">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg">
            <Upload className="h-6 w-6 text-white" />
          </div>
          <h2 className="text-3xl font-bold tracking-tight">Upload Center</h2>
        </div>
        <p className="text-muted-foreground text-lg">
          Adicione novos assets à sua biblioteca RotnemCode. Templates, componentes e snippets de
          código.
        </p>
      </div>

      <Card className="p-6 shadow-xl">
        <div className="flex space-x-2 border-b pb-4 mb-6 overflow-x-auto">
          <Button
            variant={activeTab === 'template' ? 'default' : 'ghost'}
            onClick={() => setActiveTab('template')}
            className="gap-2 transition-all"
          >
            <FileJson className="h-4 w-4" /> Elementor JSON
          </Button>
          <Button
            variant={activeTab === 'css' ? 'default' : 'ghost'}
            onClick={() => setActiveTab('css')}
            className="gap-2 transition-all"
          >
            <FileCode className="h-4 w-4" /> CSS Snippet
          </Button>
          <Button
            variant={activeTab === 'js' ? 'default' : 'ghost'}
            onClick={() => setActiveTab('js')}
            className="gap-2 transition-all"
          >
            <Code2 className="h-4 w-4" /> JS Snippet
          </Button>
          <Button
            variant={activeTab === 'html' ? 'default' : 'ghost'}
            onClick={() => setActiveTab('html')}
            className="gap-2 transition-all"
          >
            <Terminal className="h-4 w-4" /> HTML Block
          </Button>
        </div>

        <div className="space-y-6">
          <div>
            <label
              htmlFor="asset-title"
              className="flex items-center gap-2 text-sm font-semibold mb-2"
            >
              <FileCode className="h-4 w-4 text-blue-500" />
              Título <span className="text-red-500">*</span>
            </label>
            <Input
              id="asset-title"
              placeholder={`Ex: ${activeTab === 'template' ? 'Landing Page Moderna' : activeTab === 'css' ? 'Animação de Botão' : activeTab === 'js' ? 'Validação de Form' : 'Header Responsivo'}`}
              {...register('title')}
              disabled={isSubmitting || isCreating}
              className={cn(
                'h-11 text-base transition-all',
                errors.title ? 'border-red-500 focus:ring-red-500' : 'focus:ring-blue-500'
              )}
            />
            {errors.title && (
              <p className="text-sm text-red-500 mt-1.5 flex items-center gap-1">
                <span>⚠️</span> {errors.title.message}
              </p>
            )}
          </div>

          <div>
            <label
              htmlFor="asset-description"
              className="flex items-center justify-between text-sm font-semibold mb-2"
            >
              <span className="flex items-center gap-2">
                <FileCode className="h-4 w-4 text-purple-500" />
                Descrição
              </span>
              <span className="text-xs text-muted-foreground font-normal">
                {watch('description')?.length || 0}/500 caracteres
              </span>
            </label>
            <Textarea
              id="asset-description"
              placeholder="Descreva o que este asset faz e quando deve ser usado..."
              {...register('description')}
              disabled={isSubmitting || isCreating}
              className={cn(
                'min-h-[100px] transition-all',
                errors.description ? 'border-red-500 focus:ring-red-500' : 'focus:ring-purple-500'
              )}
            />
            {errors.description && (
              <p className="text-sm text-red-500 mt-1.5 flex items-center gap-1">
                <span>⚠️</span> {errors.description.message}
              </p>
            )}
          </div>

          <div>
            <label
              htmlFor="asset-tags"
              className="flex items-center gap-2 text-sm font-semibold mb-2"
            >
              <span className="text-orange-500">#</span>
              Tags
              <span className="text-xs text-muted-foreground font-normal">
                (separadas por vírgula)
              </span>
            </label>
            <Input
              id="asset-tags"
              placeholder="Ex: dark-mode, hero, landing-page, responsivo"
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
              className={cn(
                'h-11 transition-all font-mono text-sm',
                errors.tags ? 'border-red-500 focus:ring-red-500' : 'focus:ring-orange-500'
              )}
            />
            {errors.tags && (
              <p className="text-sm text-red-500 mt-1.5 flex items-center gap-1">
                <span>⚠️</span> {errors.tags.message}
              </p>
            )}
            <p className="text-xs text-muted-foreground mt-1.5">
              💡 Dica: Use tags descritivas para facilitar a busca. Máximo de 10 tags.
            </p>
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
                  'mb-4 border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all duration-200',
                  'hover:scale-[1.02] hover:shadow-lg',
                  isDragActive &&
                    'border-blue-500 bg-blue-50 dark:bg-blue-950/30 scale-[1.02] shadow-lg',
                  !isDragActive &&
                    'border-muted-foreground/30 hover:border-blue-400 hover:bg-muted/30',
                  (isSubmitting || isCreating) && 'opacity-50 cursor-not-allowed hover:scale-100'
                )}
              >
                <input {...getInputProps()} />
                <div className="space-y-3">
                  <div
                    className={cn(
                      'mx-auto w-16 h-16 rounded-full flex items-center justify-center transition-colors',
                      isDragActive ? 'bg-blue-500' : 'bg-gradient-to-br from-blue-500 to-purple-600'
                    )}
                  >
                    <Upload className="h-8 w-8 text-white" />
                  </div>
                  {isDragActive ? (
                    <p className="text-base text-blue-600 dark:text-blue-400 font-semibold animate-pulse">
                      ⬇️ Solte o arquivo JSON aqui...
                    </p>
                  ) : (
                    <>
                      <p className="text-base text-foreground font-medium">
                        Arraste um arquivo JSON ou clique para selecionar
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Formatos aceitos:{' '}
                        <span className="font-mono bg-muted px-2 py-0.5 rounded">.json</span>{' '}
                        (máximo 5 MB)
                      </p>
                    </>
                  )}
                </div>
              </div>

              <Textarea
                id="json-code"
                className={cn(
                  'min-h-[250px] font-mono text-sm',
                  'bg-slate-950 dark:bg-slate-900 text-slate-50',
                  'focus:ring-2 focus:ring-blue-500 transition-all',
                  errors.code || jsonError ? 'border-red-500 border-2' : '',
                  !errors.code && !jsonError && codeValue ? 'border-l-4 border-green-500' : ''
                )}
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
                  className={cn(
                    'min-h-[250px] font-mono text-sm',
                    'bg-slate-950 dark:bg-slate-900 text-slate-50',
                    'focus:ring-2 focus:ring-blue-500 transition-all',
                    errors.code ? 'border-red-500 border-2' : ''
                  )}
                  placeholder={
                    activeTab === 'css'
                      ? '.my-class {\n  color: #3b82f6;\n  padding: 1rem;\n}'
                      : activeTab === 'js'
                        ? 'const greeting = "Hello World";\nconsole.log(greeting);'
                        : '<div class="container">\n  <h1>Hello World</h1>\n</div>'
                  }
                  {...register('code')}
                  disabled={isSubmitting || isCreating}
                />
              </div>
              {errors.code && <p className="text-sm text-red-500 mt-1">{errors.code.message}</p>}
            </div>
          )}

          <div className="pt-6 flex flex-col-reverse sm:flex-row gap-3 justify-end border-t mt-6">
            <Button
              type="button"
              variant="outline"
              size="lg"
              onClick={() => {
                reset();
                toast.info('Formulário limpo', {
                  description: 'Todos os campos foram resetados.',
                });
              }}
              disabled={isSubmitting || isCreating}
              className="w-full sm:w-auto"
            >
              <span className="mr-2">↺</span>
              Limpar Formulário
            </Button>
            <Button
              type="submit"
              size="lg"
              className="w-full sm:w-auto gap-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold shadow-lg hover:shadow-xl transition-all"
              onClick={handleSubmit(onSubmit)}
              disabled={isSubmitting || isCreating || !!jsonError}
            >
              {isSubmitting || isCreating ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Salvando na Biblioteca...</span>
                </>
              ) : (
                <>
                  <Upload className="h-4 w-4" />
                  <span>Salvar na Biblioteca</span>
                </>
              )}
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}
