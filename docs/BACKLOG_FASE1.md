# 📋 Backlog - Fase 1: Fundação

**Status Geral:** 🔜 Em Preparação  
**Início Previsto:** A definir  
**Duração Estimada:** 1-2 dias  
**Milestone:** v0.2.0

---

## 🎯 Objetivo da Fase

Estabelecer base técnica sólida com ferramentas profissionais e componentes reutilizáveis, seguindo padrões de mercado (shadcn/ui, Tailwind Labs, Vercel).

---

## 📊 Visão Geral

| # | Tarefa | Prioridade | Status | Responsável | Tempo Est. |
|---|--------|-----------|--------|-------------|------------|
| 1.1 | Migração Tailwind: CDN → PostCSS | 🔴 CRÍTICA | 📝 TODO | - | 2-3h |
| 1.2 | Componentização Avançada (CVA) | 🔴 CRÍTICA | 📝 TODO | - | 3-4h |
| 1.3 | ESLint + Prettier Setup | 🟡 ALTA | 📝 TODO | - | 1-2h |
| 1.4 | TypeScript Strict Mode | 🟡 ALTA | 📝 TODO | - | 1-2h |

**Total Estimado:** 7-11 horas

---

## 🔴 Tarefa 1.1: Migração Tailwind CDN → PostCSS

### Informações
- **ID:** PHASE1-001
- **Prioridade:** 🔴 CRÍTICA
- **Tipo:** Refactoring
- **Tempo Estimado:** 2-3 horas
- **Dependências:** Nenhuma
- **Bloqueadores:** Nenhum

### Descrição
Migrar do Tailwind CSS via CDN para compilação local com PostCSS, habilitando JIT mode, purge automático e IntelliSense completo.

### Checklist de Implementação

#### Setup Inicial
- [ ] Instalar dependências:
  ```bash
  npm install -D tailwindcss@latest postcss@latest autoprefixer@latest
  ```
- [ ] Remover script CDN do `index.html` (linha com `<script src="https://cdn.tailwindcss.com"`)
- [ ] Remover `<script>` inline com `tailwind.config` do `index.html`

#### Configuração Tailwind
- [ ] Gerar configs:
  ```bash
  npx tailwindcss init -p --ts
  ```
- [ ] Configurar `tailwind.config.ts`:
  ```typescript
  import type { Config } from 'tailwindcss';

  export default {
    content: [
      './index.html',
      './src/**/*.{js,ts,jsx,tsx}',
    ],
    darkMode: 'class',
    theme: {
      extend: {
        colors: {
          border: 'hsl(var(--border))',
          input: 'hsl(var(--input))',
          ring: 'hsl(var(--ring))',
          background: 'hsl(var(--background))',
          foreground: 'hsl(var(--foreground))',
          primary: {
            DEFAULT: 'hsl(var(--primary))',
            foreground: 'hsl(var(--primary-foreground))',
          },
          secondary: {
            DEFAULT: 'hsl(var(--secondary))',
            foreground: 'hsl(var(--secondary-foreground))',
          },
          // ... adicionar todos os tokens do index.css
        },
        borderRadius: {
          lg: 'var(--radius)',
          md: 'calc(var(--radius) - 2px)',
          sm: 'calc(var(--radius) - 4px)',
        },
      },
    },
    plugins: [],
  } satisfies Config;
  ```
- [ ] Verificar `postcss.config.js` criado automaticamente

#### Importar Tailwind
- [ ] Atualizar `index.css` no topo:
  ```css
  @tailwind base;
  @tailwind components;
  @tailwind utilities;

  /* Manter design tokens existentes abaixo */
  @layer base {
    :root {
      --background: 0 0% 100%;
      /* ... resto dos tokens */
    }
  }
  ```

#### Validação
- [ ] Rodar `npm run dev` e verificar:
  - [ ] Estilos carregando corretamente
  - [ ] Tema dark/light funcionando
  - [ ] Sem erros no console
  - [ ] Hot reload funcionando
- [ ] Verificar IntelliSense do Tailwind no VSCode:
  - [ ] Autocomplete de classes
  - [ ] Preview de cores ao hover
- [ ] Inspecionar bundle gerado:
  - [ ] Sem classes não utilizadas
  - [ ] Tamanho < 50KB (gzipped)

#### Limpeza
- [ ] Remover comentários antigos relacionados ao CDN
- [ ] Atualizar README com novo setup

### Critérios de Aceitação
✅ Aplicação renderizando corretamente  
✅ Tema dark/light funcionando  
✅ IntelliSense ativo  
✅ Bundle otimizado (< 50KB)  
✅ Nenhum erro no console  
✅ Hot reload < 100ms  

### Riscos e Mitigações
| Risco | Probabilidade | Impacto | Mitigação |
|-------|--------------|---------|-----------|
| Classes custom não funcionando | Baixa | Alto | Verificar `content` paths no config |
| Tokens CSS não sincronizados | Média | Médio | Mapear manualmente todos os tokens |
| Build quebrado | Baixa | Alto | Testar antes de commitar |

### Recursos
- [Tailwind PostCSS Docs](https://tailwindcss.com/docs/installation/using-postcss)
- [Vite + Tailwind Guide](https://tailwindcss.com/docs/guides/vite)

---

## 🔴 Tarefa 1.2: Componentização Avançada (CVA)

### Informações
- **ID:** PHASE1-002
- **Prioridade:** 🔴 CRÍTICA
- **Tipo:** Refactoring
- **Tempo Estimado:** 3-4 horas
- **Dependências:** 1.1 (Tailwind PostCSS)
- **Bloqueadores:** Nenhum

### Descrição
Extrair componentes UI inline para arquivos separados usando CVA (class-variance-authority) para variants type-safe, seguindo padrão shadcn/ui.

### Checklist de Implementação

#### Setup Inicial
- [ ] Instalar dependências:
  ```bash
  npm install class-variance-authority clsx tailwind-merge
  ```
- [ ] Criar estrutura de pastas:
  ```
  src/
  ├── components/
  │   └── ui/           # Componentes base reutilizáveis
  │       ├── button.tsx
  │       ├── input.tsx
  │       ├── card.tsx
  │       ├── badge.tsx
  │       ├── textarea.tsx
  │       └── index.ts
  ├── lib/
  │   └── utils.ts      # Função cn() e helpers
  ```

#### Criar Utils
- [ ] Criar `lib/utils.ts`:
  ```typescript
  import { clsx, type ClassValue } from 'clsx';
  import { twMerge } from 'tailwind-merge';

  export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
  }
  ```

#### Extrair Button
- [ ] Criar `components/ui/button.tsx`:
  ```typescript
  import * as React from 'react';
  import { cva, type VariantProps } from 'class-variance-authority';
  import { cn } from '@/lib/utils';

  const buttonVariants = cva(
    'inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
    {
      variants: {
        variant: {
          default: 'bg-primary text-primary-foreground hover:bg-primary/90',
          outline: 'border border-input bg-background hover:bg-accent hover:text-accent-foreground',
          ghost: 'hover:bg-accent hover:text-accent-foreground',
          secondary: 'bg-secondary text-secondary-foreground hover:bg-secondary/80',
        },
        size: {
          default: 'h-10 px-4 py-2',
          sm: 'h-9 rounded-md px-3',
          lg: 'h-11 rounded-md px-8',
          icon: 'h-10 w-10',
        },
      },
      defaultVariants: {
        variant: 'default',
        size: 'default',
      },
    }
  );

  export interface ButtonProps
    extends React.ButtonHTMLAttributes<HTMLButtonElement>,
      VariantProps<typeof buttonVariants> {}

  const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
    ({ className, variant, size, ...props }, ref) => {
      return (
        <button
          className={cn(buttonVariants({ variant, size, className }))}
          ref={ref}
          {...props}
        />
      );
    }
  );
  Button.displayName = 'Button';

  export { Button, buttonVariants };
  ```

#### Extrair Input
- [ ] Criar `components/ui/input.tsx`:
  ```typescript
  import * as React from 'react';
  import { cn } from '@/lib/utils';

  export interface InputProps
    extends React.InputHTMLAttributes<HTMLInputElement> {}

  const Input = React.forwardRef<HTMLInputElement, InputProps>(
    ({ className, type, ...props }, ref) => {
      return (
        <input
          type={type}
          className={cn(
            'flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
            className
          )}
          ref={ref}
          {...props}
        />
      );
    }
  );
  Input.displayName = 'Input';

  export { Input };
  ```

#### Extrair Card
- [ ] Criar `components/ui/card.tsx`:
  ```typescript
  import * as React from 'react';
  import { cn } from '@/lib/utils';

  const Card = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
    ({ className, ...props }, ref) => (
      <div
        ref={ref}
        className={cn('rounded-lg border bg-card text-card-foreground shadow-sm', className)}
        {...props}
      />
    )
  );
  Card.displayName = 'Card';

  const CardHeader = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
    ({ className, ...props }, ref) => (
      <div ref={ref} className={cn('flex flex-col space-y-1.5 p-6', className)} {...props} />
    )
  );
  CardHeader.displayName = 'CardHeader';

  const CardTitle = React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLHeadingElement>>(
    ({ className, ...props }, ref) => (
      <h3 ref={ref} className={cn('text-2xl font-semibold leading-none tracking-tight', className)} {...props} />
    )
  );
  CardTitle.displayName = 'CardTitle';

  const CardContent = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
    ({ className, ...props }, ref) => (
      <div ref={ref} className={cn('p-6 pt-0', className)} {...props} />
    )
  );
  CardContent.displayName = 'CardContent';

  export { Card, CardHeader, CardTitle, CardContent };
  ```

#### Extrair Badge
- [ ] Criar `components/ui/badge.tsx` com CVA variants (default, secondary, outline, destructive)

#### Extrair Textarea
- [ ] Criar `components/ui/textarea.tsx` similar ao Input

#### Barrel Exports
- [ ] Criar `components/ui/index.ts`:
  ```typescript
  export * from './button';
  export * from './input';
  export * from './card';
  export * from './badge';
  export * from './textarea';
  ```

#### Refatorar Arquivos Existentes
- [ ] Atualizar `App.tsx`:
  - [ ] Remover componentes inline
  - [ ] Importar de `@/components/ui`
- [ ] Atualizar `views/Home.tsx`
- [ ] Atualizar `views/ListView.tsx`
- [ ] Atualizar `views/ComponentsView.tsx`
- [ ] Atualizar `views/Upload.tsx`
- [ ] Atualizar `components/Navbar.tsx`
- [ ] Atualizar `components/Sidebar.tsx`
- [ ] Atualizar `components/AssetCard.tsx`
- [ ] Atualizar `components/UploadForm.tsx`
- [ ] Atualizar `components/EmptyState.tsx`

#### Configurar Imports Absolutos
- [ ] Atualizar `tsconfig.json`:
  ```json
  {
    "compilerOptions": {
      "baseUrl": ".",
      "paths": {
        "@/*": ["./src/*"]
      }
    }
  }
  ```
- [ ] Atualizar `vite.config.ts`:
  ```typescript
  import path from 'path';
  
  export default defineConfig({
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
      },
    },
  });
  ```

#### Validação
- [ ] Rodar aplicação e testar:
  - [ ] Todos os componentes renderizando
  - [ ] Variants funcionando (hover, active, disabled)
  - [ ] TypeScript sem erros
  - [ ] Props tipadas corretamente
- [ ] Verificar autocomplete de variants no VSCode

### Critérios de Aceitação
✅ 5+ componentes extraídos (Button, Input, Card, Badge, Textarea)  
✅ CVA configurado e type-safe  
✅ Imports absolutos funcionando  
✅ Sem componentes inline no código  
✅ TypeScript 0 errors  
✅ Props com IntelliSense  

### Recursos
- [CVA Docs](https://cva.style/docs)
- [shadcn/ui Components](https://ui.shadcn.com/docs/components)

---

## 🟡 Tarefa 1.3: ESLint + Prettier Setup

### Informações
- **ID:** PHASE1-003
- **Prioridade:** 🟡 ALTA
- **Tipo:** Tooling
- **Tempo Estimado:** 1-2 horas
- **Dependências:** Nenhuma
- **Bloqueadores:** Nenhum

### Descrição
Configurar ESLint e Prettier para code quality automático, com pre-commit hooks e regras para React, TypeScript e acessibilidade.

### Checklist de Implementação

#### Instalar Dependências
- [ ] Instalar ESLint:
  ```bash
  npm install -D eslint @typescript-eslint/parser @typescript-eslint/eslint-plugin
  npm install -D eslint-plugin-react eslint-plugin-react-hooks
  npm install -D eslint-plugin-jsx-a11y eslint-plugin-import
  ```
- [ ] Instalar Prettier:
  ```bash
  npm install -D prettier eslint-config-prettier eslint-plugin-prettier
  ```
- [ ] Instalar Husky + lint-staged:
  ```bash
  npm install -D husky lint-staged
  ```

#### Configurar ESLint
- [ ] Criar `.eslintrc.json`:
  ```json
  {
    "env": {
      "browser": true,
      "es2021": true
    },
    "extends": [
      "eslint:recommended",
      "plugin:@typescript-eslint/recommended",
      "plugin:react/recommended",
      "plugin:react-hooks/recommended",
      "plugin:jsx-a11y/recommended",
      "plugin:import/typescript",
      "prettier"
    ],
    "parser": "@typescript-eslint/parser",
    "parserOptions": {
      "ecmaFeatures": { "jsx": true },
      "ecmaVersion": "latest",
      "sourceType": "module",
      "project": "./tsconfig.json"
    },
    "plugins": ["@typescript-eslint", "react", "react-hooks", "jsx-a11y", "import"],
    "rules": {
      "react/react-in-jsx-scope": "off",
      "react/prop-types": "off",
      "@typescript-eslint/no-unused-vars": ["warn", { "argsIgnorePattern": "^_" }],
      "@typescript-eslint/explicit-function-return-type": "off",
      "import/order": ["warn", {
        "groups": ["builtin", "external", "internal", "parent", "sibling", "index"],
        "newlines-between": "always",
        "alphabetize": { "order": "asc" }
      }]
    },
    "settings": {
      "react": { "version": "detect" }
    }
  }
  ```
- [ ] Criar `.eslintignore`:
  ```
  node_modules
  dist
  build
  *.config.js
  *.config.ts
  ```

#### Configurar Prettier
- [ ] Criar `.prettierrc`:
  ```json
  {
    "semi": true,
    "singleQuote": true,
    "printWidth": 100,
    "tabWidth": 2,
    "trailingComma": "es5",
    "arrowParens": "always",
    "endOfLine": "lf"
  }
  ```
- [ ] Criar `.prettierignore`:
  ```
  node_modules
  dist
  build
  *.md
  ```

#### Adicionar Scripts
- [ ] Atualizar `package.json`:
  ```json
  {
    "scripts": {
      "lint": "eslint . --ext .ts,.tsx",
      "lint:fix": "eslint . --ext .ts,.tsx --fix",
      "format": "prettier --write \"src/**/*.{ts,tsx,css}\"",
      "format:check": "prettier --check \"src/**/*.{ts,tsx,css}\"",
      "prepare": "husky install"
    }
  }
  ```

#### Configurar Husky
- [ ] Inicializar Husky:
  ```bash
  npm run prepare
  npx husky add .husky/pre-commit "npx lint-staged"
  ```
- [ ] Configurar lint-staged no `package.json`:
  ```json
  {
    "lint-staged": {
      "*.{ts,tsx}": [
        "eslint --fix",
        "prettier --write"
      ],
      "*.{css,md}": [
        "prettier --write"
      ]
    }
  }
  ```

#### Rodar Linting
- [ ] Executar `npm run lint` e corrigir erros:
  - [ ] Unused variables
  - [ ] Missing return types (opcional)
  - [ ] A11y issues
- [ ] Executar `npm run format`
- [ ] Commit para testar pre-commit hook

#### VSCode Setup (opcional)
- [ ] Criar `.vscode/settings.json`:
  ```json
  {
    "editor.formatOnSave": true,
    "editor.defaultFormatter": "esbenp.prettier-vscode",
    "editor.codeActionsOnSave": {
      "source.fixAll.eslint": true
    },
    "eslint.validate": ["javascript", "typescript", "javascriptreact", "typescriptreact"]
  }
  ```

### Critérios de Aceitação
✅ ESLint 0 errors, 0 warnings  
✅ Prettier formatando 100% do código  
✅ Pre-commit hooks funcionando  
✅ Import order automático  
✅ A11y rules ativas  

---

## 🟡 Tarefa 1.4: TypeScript Strict Mode

### Informações
- **ID:** PHASE1-004
- **Prioridade:** 🟡 ALTA
- **Tipo:** Quality
- **Tempo Estimado:** 1-2 horas
- **Dependências:** 1.2 (Componentização)
- **Bloqueadores:** Nenhum

### Descrição
Habilitar modo strict do TypeScript para garantir type safety completo e prevenir bugs comuns.

### Checklist de Implementação

#### Configurar tsconfig.json
- [ ] Atualizar `tsconfig.json`:
  ```json
  {
    "compilerOptions": {
      "strict": true,
      "noImplicitAny": true,
      "strictNullChecks": true,
      "strictFunctionTypes": true,
      "strictBindCallApply": true,
      "strictPropertyInitialization": true,
      "noImplicitThis": true,
      "alwaysStrict": true,
      "noUnusedLocals": true,
      "noUnusedParameters": true,
      "noImplicitReturns": true,
      "noFallthroughCasesInSwitch": true
    }
  }
  ```

#### Corrigir Erros de Tipo
- [ ] **App.tsx:**
  - [ ] Tipar event handlers: `onClick: (e: React.MouseEvent) => void`
  - [ ] Tipar refs se houver
  - [ ] Remover `any` explícitos
- [ ] **Hooks:**
  - [ ] `useTheme.ts`: tipar retorno e localStorage
  - [ ] `useFavorites.ts`: tipar Set e localStorage
- [ ] **Componentes:**
  - [ ] AssetCard: tipar props, handlers
  - [ ] Navbar: tipar callbacks
  - [ ] Sidebar: tipar navegação
  - [ ] UploadForm: tipar validação
- [ ] **Utils:**
  - [ ] cn(): já tipado com CVA
  - [ ] Validações: adicionar types para schemas

#### Adicionar Types Faltantes
- [ ] Criar `types/` para types compartilhados:
  - [ ] `types/asset.ts`: consolidar AssetItem, AssetType, ComponentCategory
  - [ ] `types/events.ts`: tipos de eventos personalizados
- [ ] Exportar types de components/ui

#### Validação
- [ ] Rodar `tsc --noEmit` e corrigir todos os erros
- [ ] Verificar IntelliSense melhorado
- [ ] Testar aplicação funcionando normalmente

### Critérios de Aceitação
✅ `tsc --noEmit` sem erros  
✅ Sem `any` explícito  
✅ Null checks em todos os lugares  
✅ Event handlers tipados  
✅ IntelliSense preciso  

---

## 📝 Notas Gerais da Fase 1

### Ordem de Execução Recomendada
1. **1.1 Tailwind PostCSS** (2-3h) - Base para tudo
2. **1.2 Componentização** (3-4h) - Depende do Tailwind
3. **1.3 ESLint + Prettier** (1-2h) - Independente, pode rodar em paralelo
4. **1.4 TypeScript Strict** (1-2h) - Última, após componentização

### Commits Sugeridos
- `feat(tailwind): migrate from CDN to PostCSS`
- `refactor(ui): extract components with CVA pattern`
- `chore(lint): setup ESLint, Prettier and Husky`
- `refactor(ts): enable strict mode and fix types`

### Comandos Úteis Durante a Fase
```bash
# Desenvolvimento
npm run dev

# Linting
npm run lint
npm run lint:fix
npm run format

# Type checking
npx tsc --noEmit

# Build production
npm run build
npm run preview
```

### Ponto de Decisão
Após completar todas as 4 tarefas, fazer:
- [ ] Code review completo
- [ ] Testar todas as funcionalidades existentes
- [ ] Commit final: `chore(phase1): complete foundation setup`
- [ ] Atualizar ROADMAP.md com status
- [ ] Criar tag `v0.2.0`
- [ ] Decidir sobre iniciar Fase 2

---

**Criado em:** 29/11/2025  
**Última atualização:** 29/11/2025  
**Status:** 📝 Aguardando início
