# 🗺️ RotnemCode - Roadmap de Evolução

**Objetivo:** Transformar o MVP em um SaaS profissional, escalável e pronto para produção seguindo padrões de mercado.

---

## 📊 Visão Geral das Fases

| Fase | Foco | Duração Estimada | Status |
|------|------|------------------|--------|
| Fase 1 | Fundação (Tooling & Components) | 1-2 dias | 🔜 Próxima |
| Fase 2 | Navegação & Estado | 1 dia | ⏳ Pendente |
| Fase 3 | UX Avançado | 1-2 dias | ⏳ Pendente |
| Fase 4 | Qualidade & Testes | 1 dia | ⏳ Pendente |
| Fase 5 | Performance & Scale | 1-2 dias | ⏳ Pendente |
| Fase 6 | Deploy & Monitoramento | 1 dia | ⏳ Pendente |

**Total Estimado:** 6-9 dias de desenvolvimento

---

## 🎯 Fase 1: Fundação (Tooling & Components)

**Objetivo:** Estabelecer base técnica sólida com ferramentas profissionais e componentes reutilizáveis.

### Tarefas

#### 1.1 Migração Tailwind: CDN → PostCSS
- **Prioridade:** 🔴 CRÍTICA
- **Impacto:** Performance, DX, Bundle Size
- **Entregáveis:**
  - Remover CDN do `index.html`
  - Instalar `tailwindcss`, `postcss`, `autoprefixer`
  - Criar `tailwind.config.ts` com tema customizado
  - Criar `postcss.config.js`
  - Importar Tailwind no `index.css`
  - Configurar purge/content para otimização
- **Benefícios:**
  - ✅ JIT mode (compile on demand)
  - ✅ Bundle 60-80% menor
  - ✅ IntelliSense no VSCode
  - ✅ Customização total do tema
  - ✅ Purge automático de classes não utilizadas

#### 1.2 Componentização Avançada (shadcn/ui pattern)
- **Prioridade:** 🔴 CRÍTICA
- **Impacto:** Manutenibilidade, Reusabilidade, DX
- **Entregáveis:**
  - Criar estrutura `components/ui/`
  - Instalar `class-variance-authority` (CVA)
  - Extrair componentes inline:
    - `Button.tsx` com variants (default, outline, ghost, secondary)
    - `Input.tsx` com error states
    - `Card.tsx` com Header/Content/Footer
    - `Badge.tsx` com variants
    - `Textarea.tsx`
  - Criar `lib/utils.ts` com função `cn()`
  - Atualizar imports em todos os arquivos
- **Padrão:**
  ```tsx
  // Exemplo Button com CVA
  import { cva, VariantProps } from 'class-variance-authority';
  
  const buttonVariants = cva(
    'base-classes',
    {
      variants: {
        variant: { default: '...', outline: '...' },
        size: { sm: '...', md: '...' }
      }
    }
  );
  ```

#### 1.3 ESLint + Prettier
- **Prioridade:** 🟡 ALTA
- **Impacto:** Code Quality, Consistência, Automação
- **Entregáveis:**
  - Instalar `eslint`, `@typescript-eslint/*`, `eslint-plugin-react`
  - Instalar `prettier`, `eslint-config-prettier`
  - Criar `.eslintrc.json` com regras:
    - React hooks rules
    - a11y plugin
    - TypeScript strict
    - Import order
  - Criar `.prettierrc` com:
    - semi: true
    - singleQuote: true
    - printWidth: 100
    - trailingComma: 'es5'
  - Adicionar scripts no `package.json`:
    - `lint`: eslint check
    - `lint:fix`: auto-fix
    - `format`: prettier write
  - Instalar `husky` + `lint-staged` (pre-commit hooks)
- **Automação:**
  - Lint automático antes de commit
  - Format automático em save (VSCode config)

#### 1.4 TypeScript Strict Mode
- **Prioridade:** 🟡 ALTA
- **Impacto:** Type Safety, Bug Prevention
- **Entregáveis:**
  - Habilitar no `tsconfig.json`:
    ```json
    {
      "compilerOptions": {
        "strict": true,
        "noImplicitAny": true,
        "strictNullChecks": true,
        "strictFunctionTypes": true,
        "noUnusedLocals": true,
        "noUnusedParameters": true
      }
    }
    ```
  - Corrigir erros de tipo em:
    - `App.tsx`
    - Hooks (`useTheme`, `useFavorites`)
    - Componentes com `any`
  - Adicionar types para:
    - Event handlers
    - Refs
    - Generic components

### Critérios de Aceitação Fase 1
- [ ] Tailwind compilado via PostCSS (bundle < 50KB gzipped)
- [ ] Todos os componentes inline extraídos para `components/ui/`
- [ ] CVA configurado e funcionando
- [ ] ESLint 0 errors, 0 warnings
- [ ] Prettier formatando 100% do código
- [ ] TypeScript strict sem erros
- [ ] Pre-commit hooks rodando lint + format
- [ ] IntelliSense Tailwind funcionando no VSCode

---

## 🚀 Fase 2: Navegação & Estado

**Objetivo:** Implementar navegação real e gerenciamento de estado escalável.

### Tarefas

#### 2.1 React Router v6
- **Prioridade:** 🔴 CRÍTICA
- **Entregáveis:**
  - Instalar `react-router-dom@6`
  - Criar estrutura de rotas:
    - `/` - Home
    - `/templates` - Templates grid
    - `/templates/:id` - Template detail (futuro)
    - `/sections` - Sections grid
    - `/sections/:id` - Section detail (futuro)
    - `/components` - Components com query params `?category=buttons`
    - `/upload` - Upload center
    - `/favorites` - Favoritos
    - `/settings` - Configurações
  - Criar `RouterProvider` no `App.tsx`
  - Migrar navegação de `setCurrentView` para `useNavigate()`
  - Atualizar `Sidebar` com `NavLink` (active states)
  - Implementar breadcrumbs
  - 404 page

#### 2.2 Context API / Zustand
- **Prioridade:** 🟡 ALTA
- **Entregáveis:**
  - **Opção A - Context API:**
    - `AppContext` com theme, favorites, search
    - Provider no root
  - **Opção B - Zustand (recomendado):**
    - `useAppStore` com slices
    - Persist middleware para localStorage
    - DevTools integration
  - Remover prop drilling de:
    - `searchQuery` (8 níveis)
    - `theme` (5 níveis)
    - `favorites` (7 níveis)

#### 2.3 Toast System (sonner)
- **Prioridade:** 🟡 ALTA
- **Entregáveis:**
  - Instalar `sonner`
  - Setup `<Toaster />` no root
  - Criar helper `toast.success()`, `toast.error()`
  - Substituir alerts/confirms:
    - Copiar código → toast.success('Código copiado!')
    - Salvar asset → toast.success('Asset salvo com sucesso')
    - Validação → toast.error('JSON inválido')
  - Configurar tema dark/light sync

### Critérios de Aceitação Fase 2
- [ ] URLs refletindo estado da aplicação
- [ ] Navegação com back/forward do browser
- [ ] Deep linking funcionando (compartilhar link direto)
- [ ] Prop drilling eliminado (< 3 níveis)
- [ ] Toast em todas as ações do usuário
- [ ] Breadcrumbs nas páginas internas

---

## 🎨 Fase 3: UX Avançado

**Objetivo:** Elevar experiência do usuário com interações modernas e feedback visual.

### Tarefas

#### 3.1 Modal/Dialog System (Radix UI)
- **Prioridade:** 🟡 ALTA
- **Entregáveis:**
  - Instalar `@radix-ui/react-dialog`
  - Criar `Dialog` component
  - Implementar modals:
    - Preview completo de código (syntax highlight)
    - Confirmação de delete
    - Detalhes de asset (metadata)
    - Share asset (futuro)
  - Focus trap, escape key, backdrop click
  - Animações de entrada/saída

#### 3.2 Syntax Highlighting (Prism.js)
- **Prioridade:** 🟡 ALTA
- **Entregáveis:**
  - Instalar `prismjs` + themes
  - Criar `CodeBlock` component
  - Suporte para:
    - CSS (prism-css)
    - JavaScript (prism-javascript)
    - HTML (prism-markup)
    - JSON (prism-json)
  - Tema dark/light sync
  - Line numbers
  - Copy button integrado

#### 3.3 React Hook Form + Zod
- **Prioridade:** 🟡 ALTA
- **Entregáveis:**
  - Instalar `react-hook-form`, `zod`, `@hookform/resolvers`
  - Refatorar `UploadForm`:
    ```tsx
    const schema = z.object({
      title: z.string().min(3).max(100),
      description: z.string().optional(),
      code: z.string().min(1),
      type: z.enum(['template', 'css', 'js', 'html'])
    });
    ```
  - Error messages por campo
  - Submit com loading state
  - Reset form após sucesso

#### 3.4 Skeleton Loaders
- **Prioridade:** 🟢 MÉDIA
- **Entregáveis:**
  - Criar `Skeleton` component
  - `CardSkeleton` para grids
  - Loading states em:
    - Primeira renderização
    - Filtros aplicados
    - Busca em tempo real
  - Shimmer animation

#### 3.5 Drag & Drop (react-dropzone)
- **Prioridade:** 🟢 MÉDIA
- **Entregáveis:**
  - Instalar `react-dropzone`
  - Integrar no `UploadForm` tab Template
  - Visual feedback:
    - Hover states (border color change)
    - File preview
    - Progress bar (simulado)
  - Validação:
    - Accept apenas .json
    - Max size 5MB
    - Error states

### Critérios de Aceitação Fase 3
- [ ] Modais acessíveis (focus, keyboard)
- [ ] Syntax highlighting em todos os previews
- [ ] Formulários validados com mensagens claras
- [ ] Skeleton em loading states
- [ ] Drag & drop funcional no upload

---

## 🧪 Fase 4: Qualidade & Testes

**Objetivo:** Garantir confiabilidade e resiliência da aplicação.

### Tarefas

#### 4.1 Error Boundaries
- **Prioridade:** 🔴 CRÍTICA
- **Entregáveis:**
  - Criar `ErrorBoundary` component
  - Fallback UI:
    - Mensagem amigável
    - Botão "Reload"
    - Detalhes do erro (dev only)
  - Wrap App.tsx
  - Preparar para Sentry (logging)

#### 4.2 Testes Unitários (Vitest)
- **Prioridade:** 🟡 ALTA
- **Entregáveis:**
  - Instalar `vitest`, `@testing-library/react`, `jsdom`
  - Configurar `vitest.config.ts`
  - Testar:
    - **Hooks:**
      - `useTheme.test.ts` (toggle, localStorage)
      - `useFavorites.test.ts` (add, remove, persist)
    - **Components:**
      - `AssetCard.test.tsx` (render, favorite, copy)
      - `ListView.test.tsx` (filtros, empty state)
    - **Utils:**
      - Validação de código
      - Formatação
  - Coverage mínimo: 60%
  - Scripts:
    - `test`: vitest
    - `test:ui`: interface web
    - `test:coverage`: relatório

#### 4.3 Storybook (opcional)
- **Prioridade:** 🟢 BAIXA
- **Entregáveis:**
  - Instalar Storybook
  - Stories para components/ui:
    - Button (todas variants)
    - Input (error states)
    - Card (composição)
  - Args controls
  - Actions logging

### Critérios de Aceitação Fase 4
- [ ] App não crasha (error boundary)
- [ ] Coverage > 60%
- [ ] Todos os hooks testados
- [ ] Componentes críticos testados
- [ ] CI rodando testes (futuro)

---

## ⚡ Fase 5: Performance & Scale

**Objetivo:** Otimizar para produção e preparar para escala.

### Tarefas

#### 5.1 Code Splitting & Lazy Loading
- **Prioridade:** 🟡 ALTA
- **Entregáveis:**
  - `React.lazy()` para routes:
    ```tsx
    const Templates = lazy(() => import('./views/Templates'));
    ```
  - `<Suspense>` com Skeleton fallback
  - Dynamic imports para:
    - Modais (abrir sob demanda)
    - Syntax highlighter (carregar quando necessário)

#### 5.2 Otimização de Re-renders
- **Prioridade:** 🟢 MÉDIA
- **Entregáveis:**
  - `useMemo` estratégico em:
    - Filtros complexos
    - Computações pesadas
  - `useCallback` em:
    - Event handlers passados como props
    - Callbacks em Context
  - `React.memo` em:
    - AssetCard (pure component)
    - Listas grandes

#### 5.3 Virtualização (react-window)
- **Prioridade:** 🟢 BAIXA
- **Entregáveis:**
  - Instalar `react-window`
  - Virtualizar grids com 100+ items
  - Smooth scrolling
  - Performance: 60fps constante

#### 5.4 Organização Feature-Based
- **Prioridade:** 🟢 MÉDIA
- **Entregáveis:**
  - Reestruturar para:
    ```
    src/
    ├── features/
    │   ├── templates/
    │   │   ├── components/
    │   │   ├── hooks/
    │   │   ├── types/
    │   │   └── index.ts
    │   ├── sections/
    │   ├── components/
    │   └── upload/
    ├── shared/
    │   ├── components/ui/
    │   ├── hooks/
    │   └── utils/
    └── App.tsx
    ```
  - Barrel exports (`index.ts`)
  - Import absolutos (`@/features/...`)

### Critérios de Aceitação Fase 5
- [ ] Lighthouse Score > 90
- [ ] FCP < 1.5s
- [ ] TTI < 3s
- [ ] Bundle size < 200KB (gzipped)
- [ ] Re-renders otimizados (< 10ms por componente)

---

## 🚢 Fase 6: Deploy & Monitoramento

**Objetivo:** Preparar para produção com CI/CD e observabilidade.

### Tarefas

#### 6.1 Metadata & SEO
- **Prioridade:** 🟡 ALTA
- **Entregáveis:**
  - Meta tags no `index.html`:
    - description, keywords
    - og:title, og:image (Open Graph)
    - twitter:card
  - PWA manifest básico
  - Favicon set (16x16 até 512x512)
  - robots.txt, sitemap.xml (preparação)

#### 6.2 Analytics Setup
- **Prioridade:** 🟢 MÉDIA
- **Entregáveis:**
  - Escolher: Google Analytics 4 ou Plausible
  - Criar hook `useAnalytics`:
    ```tsx
    const { trackEvent } = useAnalytics();
    trackEvent('view_template', { id, category });
    ```
  - Eventos críticos:
    - page_view
    - copy_code
    - add_favorite
    - upload_asset
    - search_query
  - GDPR banner (cookie consent)

#### 6.3 CI/CD com GitHub Actions
- **Prioridade:** 🔴 CRÍTICA
- **Entregáveis:**
  - Workflow `.github/workflows/ci.yml`:
    ```yaml
    - Checkout
    - Setup Node
    - Install deps
    - Lint
    - Test
    - Build
    - Deploy (Vercel preview)
    ```
  - Status badge no README
  - Deploy automático:
    - PRs → Preview
    - main → Production
  - Vercel integration

#### 6.4 Environment Variables
- **Prioridade:** 🟡 ALTA
- **Entregáveis:**
  - Criar `.env.example`
  - Variáveis:
    - `VITE_API_URL` (preparação backend)
    - `VITE_GA_ID` (analytics)
    - `VITE_SENTRY_DSN` (error tracking)
  - Validation com zod
  - Type-safe env (`env.ts`)

### Critérios de Aceitação Fase 6
- [ ] SEO meta tags completos
- [ ] Analytics trackando eventos
- [ ] CI rodando em todas as PRs
- [ ] Deploy automático funcionando
- [ ] Env vars tipadas e validadas

---

## 📈 Métricas de Sucesso

### Técnicas
- ✅ Lighthouse Score: > 90
- ✅ Bundle Size: < 200KB (gzipped)
- ✅ Test Coverage: > 60%
- ✅ TypeScript Strict: 0 errors
- ✅ ESLint: 0 errors, 0 warnings
- ✅ Build Time: < 30s

### UX
- ✅ FCP (First Contentful Paint): < 1.5s
- ✅ TTI (Time to Interactive): < 3s
- ✅ CLS (Cumulative Layout Shift): < 0.1
- ✅ Acessibilidade (a11y): WCAG AA

### Desenvolvimento
- ✅ Componentes reutilizáveis: 100%
- ✅ Props drilling: eliminado (< 3 níveis)
- ✅ Hot reload: < 100ms
- ✅ IntelliSense: funcionando

---

## 🎓 Tecnologias por Fase

| Fase | Tecnologias |
|------|-------------|
| 1 | Tailwind, PostCSS, CVA, ESLint, Prettier, Husky |
| 2 | React Router, Zustand/Context, Sonner |
| 3 | Radix UI, Prism.js, React Hook Form, Zod, react-dropzone |
| 4 | Vitest, Testing Library, Storybook |
| 5 | React.lazy, Suspense, react-window, import maps |
| 6 | GitHub Actions, Vercel, Analytics, Sentry |

---

## 📝 Notas de Implementação

### Decisões Técnicas
- **Tailwind PostCSS** sobre CDN: Performance e customização
- **CVA** sobre inline variants: Type-safety e manutenibilidade
- **Zustand** sobre Context: Performance em updates frequentes
- **Radix UI** sobre Headless UI: Melhor DX e docs
- **Vitest** sobre Jest: Mais rápido, melhor integração Vite
- **Sonner** sobre react-hot-toast: Mais leve e customizável

### Dependências a Instalar
```bash
# Fase 1
npm i -D tailwindcss postcss autoprefixer
npm i class-variance-authority clsx tailwind-merge
npm i -D eslint prettier @typescript-eslint/parser
npm i -D husky lint-staged

# Fase 2
npm i react-router-dom zustand sonner

# Fase 3
npm i @radix-ui/react-dialog prismjs
npm i react-hook-form @hookform/resolvers zod
npm i react-dropzone

# Fase 4
npm i -D vitest @testing-library/react jsdom

# Fase 5
npm i react-window

# Fase 6
# (apenas configs, sem deps extras)
```

---

**Última atualização:** 29/11/2025  
**Versão atual:** v0.1.0  
**Próximo milestone:** v0.2.0 (Fase 1 completa)
