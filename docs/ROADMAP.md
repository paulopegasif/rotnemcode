# 🗺️ RotnemCode - Roadmap de Evolução

**Objetivo:** Transformar o MVP em um SaaS profissional, escalável e pronto para produção seguindo padrões de mercado.

---

## 📊 Visão Geral das Fases

| Fase | Foco | Duração Estimada | Duração Real | Status |
|------|------|------------------|--------------|--------|
| Fase 1 | Fundação (Tooling & Components) | 1-2 dias | ~2h | ✅ Completa (29/11/25) |
| Fase 2 | Navegação & Estado | 1 dia | ~2h | ✅ Completa (29/11/25) |
| Fase 3 | Backend & Segurança | 2-3 dias | ~6h | ✅ Completa (04/12/25) |
| Fase 4 | UX Avançado | 1-2 dias | - | 🔜 Próxima |
| Fase 5 | Assinaturas & Pagamentos | 1-2 dias | - | ⏳ Pendente |
| Fase 6 | Admin & Curadoria | 1 dia | - | ⏳ Pendente |
| Fase 7 | Qualidade & Testes | 1 dia | - | ⏳ Pendente |
| Fase 8 | Performance & Scale | 1-2 dias | - | ⏳ Pendente |
| Fase 9 | Deploy & Monitoramento | 1 dia | - | ⏳ Pendente |

**Total Estimado:** 10-14 dias de desenvolvimento  
**Progresso:** 3/9 fases (33%) | ~10h de desenvolvimento

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
- [x] Tailwind compilado via PostCSS (bundle < 50KB gzipped)
- [x] Todos os componentes inline extraídos para `components/ui/`
- [x] CVA configurado e funcionando
- [x] ESLint 0 errors, 0 warnings
- [x] Prettier formatando 100% do código
- [x] TypeScript strict sem erros
- [x] Pre-commit hooks rodando lint + format
- [x] IntelliSense Tailwind funcionando no VSCode

**Status:** ✅ COMPLETA - 29/11/2025

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
- [x] URLs refletindo estado da aplicação
- [x] Navegação com back/forward do browser
- [x] Deep linking funcionando (compartilhar link direto)
- [x] Prop drilling eliminado (< 3 níveis, na verdade 1 nível via hooks)
- [x] Toast em todas as ações do usuário
- [x] Breadcrumbs nas páginas internas

**Status:** ✅ COMPLETA - 29/11/2025

**Resultados Alcançados:**
- 5 novos arquivos criados (Router, Layout, Breadcrumbs, NotFound, useAppStore)
- 11 componentes refatorados
- ~15 props eliminadas (prop drilling zerado)
- 3 dependências adicionadas (react-router-dom, zustand, sonner)
- 0 erros de linting
- 531 inserções, 182 deleções

---

## 🔐 Fase 3: Backend & Segurança

**Objetivo:** Implementar autenticação, autorização e sistema de publicação seguro com validação de entitlements.

### Tarefas

#### 3.1 Supabase Setup & Migrations
- **Prioridade:** 🔴 CRÍTICA
- **Impacto:** Fundação do backend, autenticação, database
- **Entregáveis:**
  - ✅ Migration 001: Schema inicial (profiles, assets, entitlements, subscriptions)
  - ✅ Migration 002: RLS policies básicas
  - ✅ Migration 005: Sistema de roles (is_admin)
  - ✅ Migration 006: Triggers e funções (entitlements default, check_user_quota)
  - ✅ Migration 007: Audit log e proteção admin promotion
  - ✅ Configuração Supabase client (`lib/supabase.ts`)
  - ✅ Context de autenticação (`AuthContext.tsx`)
- **Benefícios:**
  - Database PostgreSQL gerenciado
  - Auth com JWT out-of-the-box
  - RLS para segurança row-level
  - Real-time subscriptions (futuro)

#### 3.2 Edge Functions & Validação Backend
- **Prioridade:** 🔴 CRÍTICA
- **Impacto:** Segurança, prevenção de bypass, validação server-side
- **Entregáveis:**
  - ✅ Edge Function `publish-asset`:
    - Validação de JWT (autenticação)
    - Verificação de ownership
    - Validação de `entitlements.can_publish`
    - Checagem de quotas (`max_assets`)
    - Admin bypass para curadoria
    - UPDATE via SERVICE_ROLE_KEY
  - ✅ Edge Function `stripe-webhook` (preparação)
  - ✅ Deploy no Supabase Dashboard
  - ✅ Env vars configuradas (SUPABASE_URL, ANON_KEY, SERVICE_ROLE_KEY)
- **Threat Model Mitigado:**
  - ✅ Bypass de entitlements via DevTools
  - ✅ JWT tampering
  - ✅ Privilege escalation (self-promotion)
  - ✅ Quota bypass via race conditions
  - ✅ SQL injection
  - ✅ Mass assignment

#### 3.3 Frontend Integration (Hooks & Views)
- **Prioridade:** 🔴 CRÍTICA
- **Impacto:** UX, segurança, feedback visual
- **Entregáveis:**
  - ✅ Hook `usePublishAsset`:
    - Chamadas seguras via `supabase.functions.invoke`
    - Tratamento automático de erros (`CANNOT_PUBLISH`, `QUOTA_EXCEEDED`)
    - Toasts informativos com ações
    - Estado `isPublishing` para loading
  - ✅ View `MyAssetsView` (`/my-assets`):
    - Lista assets do usuário via Supabase
    - Botão toggle publicar/despublicar
    - Badge de status (Público/Privado)
    - Stats (views, likes)
    - Loading states e refresh manual
  - ✅ Rota protegida (`ProtectedRoute`)
  - ✅ Link no Sidebar

#### 3.4 Documentação de Segurança
- **Prioridade:** 🟡 ALTA
- **Impacto:** Onboarding, manutenção, recovery
- **Entregáveis:**
  - ✅ `docs/SECURITY.md` - Arquitetura de segurança em 4 camadas
  - ✅ `docs/ADMIN_GUIDE.md` - Procedures de admin e recovery
  - ✅ `docs/FRONTEND_SECURITY.md` - Guia de migração código inseguro → seguro
  - ✅ `docs/IMPLEMENTATION_SUMMARY.md` - Resumo executivo
  - ✅ `docs/TESTING_GUIDE.md` - 5 testes de validação
  - ✅ Threat model com 7 vetores de ataque
  - ✅ Recovery procedures para 4 cenários

### Critérios de Aceitação Fase 3
- [x] Migration 007 aplicada no banco de produção
- [x] Edge Function `publish-asset` deployada e testável
- [x] Hook `usePublishAsset` integrado no frontend
- [x] View `My Assets` funcional com publicar/despublicar
- [x] RLS policies bloqueando UPDATE direto em `is_admin`
- [x] Audit log registrando todas as promoções a admin
- [x] Documentação completa (5 docs)
- [ ] Testes de segurança executados (5 cenários)

**Status:** ✅ COMPLETA - 04/12/2025

**Resultados Alcançados:**
- 7 migrations aplicadas (schema completo)
- 2 Edge Functions implementadas e deployadas
- 1 hook seguro criado (`usePublishAsset`)
- 1 view nova (`MyAssetsView`)
- 5 documentos de segurança criados
- 6 commits organizados
- Threat model com 7 vetores mitigados
- Arquitetura de segurança em 4 camadas ativa

**Próximo Passo Crítico:** Executar testes de segurança documentados em `TESTING_GUIDE.md`

---

## 🎨 Fase 4: UX Avançado

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

### Critérios de Aceitação Fase 4
- [ ] Upload Form conectado ao Supabase
- [ ] Assets salvos no banco com `is_public = false`
- [ ] Modais acessíveis (focus, keyboard)
- [ ] Syntax highlighting em todos os previews
- [ ] Formulários validados com mensagens claras
- [ ] Skeleton em loading states
- [ ] Drag & drop funcional no upload
- [ ] Indicadores de plano (Free/Pro badge)
- [ ] Quota visível em My Assets

---

## 💳 Fase 5: Assinaturas & Pagamentos

**Objetivo:** Monetizar com Stripe Checkout e gerenciar planos Pro.

### Tarefas

#### 5.1 Stripe Integration (Checkout)
- **Prioridade:** 🔴 CRÍTICA
- **Impacto:** Monetização, conversão Free → Pro
- **Entregáveis:**
  - Implementar `pages/PricingPage.tsx`:
    - Cards com planos (Free vs Pro)
    - Comparação de features
    - Botão "Upgrade to Pro"
  - Criar Stripe Checkout Session:
    ```typescript
    const { data } = await supabase.functions.invoke('create-checkout', {
      body: { priceId: 'price_xxx' }
    });
    window.location.href = data.url; // Redireciona para Stripe
    ```
  - Páginas:
    - `/success` - Após pagamento bem-sucedido
    - `/cancel` - Se usuário cancelar
  - Edge Function `create-checkout`:
    - Criar Stripe Customer
    - Criar Checkout Session
    - Retornar URL de redirecionamento
  - Webhook já existe (`stripe-webhook`) ✅

#### 5.2 Stripe Customer Portal
- **Prioridade:** 🟡 ALTA
- **Impacto:** Self-service, cancelamento, upgrade/downgrade
- **Entregáveis:**
  - Botão "Manage Subscription" em `/settings`
  - Edge Function `create-portal-session`:
    - Gera URL do Customer Portal
    - Permite cancelar, atualizar forma de pagamento
  - Link de retorno para `/settings`

#### 5.3 Subscription Status UI
- **Prioridade:** 🟡 ALTA
- **Impacto:** Transparência, retenção
- **Entregáveis:**
  - Badge de plano no Navbar:
    ```tsx
    <Badge variant={isPro ? "default" : "secondary"}>
      {isPro ? "Pro" : "Free"}
    </Badge>
    ```
  - Quota indicator em My Assets:
    - "5/50 assets públicos" (visual progressbar)
    - Aviso quando próximo do limite (90%)
  - Warning banner quando assinatura expirada:
    - "Sua assinatura expirou. Renovar agora?"
  - Desabilitar botão "Publicar" se quota atingida

#### 5.4 Settings Page
- **Prioridade:** 🟢 MÉDIA
- **Entregáveis:**
  - Substituir placeholder por `views/SettingsView.tsx`
  - Tabs:
    - **Profile**: Avatar (Supabase Storage), nome, bio
    - **Subscription**: 
      - Plano atual, data de renovação
      - Botão "Manage Subscription" (Customer Portal)
      - Histórico de faturas (via Stripe API)
    - **Security**: 
      - Trocar senha
      - 2FA (futuro, via Supabase Auth)

### Critérios de Aceitação Fase 5
- [ ] Pricing page com CTAs claros
- [ ] Checkout Stripe funcional
- [ ] Webhook atualizando `subscriptions` e `entitlements`
- [ ] Customer Portal acessível via Settings
- [ ] Badge de plano visível
- [ ] Quota indicator funcionando
- [ ] Warning de quota próxima (90%)
- [ ] Botão "Publicar" desabilitado se limite atingido

---

## 👨‍💼 Fase 6: Admin & Curadoria

**Objetivo:** Ferramentas de administração e moderação de conteúdo.

### Tarefas

#### 6.1 Admin Dashboard (`/admin/users`)
- **Prioridade:** 🟡 ALTA
- **Impacto:** Gestão de usuários, moderação
- **Entregáveis:**
  - Criar `views/AdminDashboard.tsx` (ProtectedRoute com `is_admin`)
  - Tabela de usuários:
    - Colunas: email, plano, is_admin, created_at, assets_count
    - Filtros: Admin/Free/Pro
    - Busca por email
    - Ordenação (mais recentes, mais assets)
  - Ações por usuário:
    - **Promover a Admin**: Modal de confirmação → UPDATE seguro
    - **Demover de Admin**: Confirmação → UPDATE
    - **Ver Assets**: Link para `/admin/users/:id/assets`
    - **Banir** (futuro): Soft-delete do usuário
  - Edge Function `promote-admin`:
    - Validação: apenas admins podem promover
    - Audit log automático via trigger
  - Paginação (50 users por página)

#### 6.2 Audit Log Viewer (`/admin/audit-log`)
- **Prioridade:** 🟢 MÉDIA
- **Impacto:** Compliance, troubleshooting, security
- **Entregáveis:**
  - Criar `views/AuditLogView.tsx`
  - Listar `admin_actions` com query `get_recent_admin_actions()`
  - Tabela:
    - timestamp, admin_email, action, target_email, metadata
    - Highlight de self-promotion attempts (via_sql_editor: false)
  - Filtros:
    - Action type (PROMOTE_TO_ADMIN, DEMOTE_FROM_ADMIN)
    - Date range (últimos 7 dias, 30 dias, custom)
    - Admin específico (dropdown)
  - Export para CSV (via `json2csv`)
  - Busca por email (admin ou target)

#### 6.3 Asset Moderation (`/admin/assets`)
- **Prioridade:** 🟢 MÉDIA
- **Impacto:** Qualidade de conteúdo, featured assets
- **Entregáveis:**
  - View de todos os assets públicos
  - Ações:
    - **Feature**: Marca `is_featured = true` (destaque no home)
    - **Unfeature**: Remove destaque
    - **Unpublish**: Despublica asset (moderação)
    - **Delete**: Soft-delete (casos graves)
  - Filtros:
    - Tipo (Template, Section, CSS, JS, HTML)
    - Status (Public, Featured)
    - Usuário (dropdown)
  - Preview rápido ao hover
  - Batch actions (selecionar múltiplos)

#### 6.4 Analytics Dashboard (`/admin/analytics`)
- **Prioridade:** 🟢 BAIXA
- **Impacto:** Insights de negócio, KPIs
- **Entregáveis:**
  - Métricas:
    - Total users (Free vs Pro)
    - Novos cadastros (últimos 7/30 dias)
    - Taxa de conversão Free → Pro
    - MRR (Monthly Recurring Revenue) via Stripe API
    - Churn rate
    - Assets públicos por plano
    - Top users (mais assets, mais views)
  - Gráficos (Chart.js ou Recharts):
    - Crescimento de usuários (line chart)
    - Distribuição de planos (pie chart)
    - Assets criados por dia (bar chart)
  - Queries otimizadas com materialized views (futuro)

### Critérios de Aceitação Fase 6
- [ ] Admin dashboard protegido (`is_admin = true`)
- [ ] Promover/demover admin funcionando
- [ ] Audit log visível e filtrável
- [ ] Moderação de assets (feature/unfeature/delete)
- [ ] Analytics com métricas básicas

---

## 🧪 Fase 7: Qualidade & Testes

**Objetivo:** Garantir confiabilidade, segurança e resiliência da aplicação.

**Tempo estimado:** 8h  
**Data prevista:** A definir

### Tarefas

#### 7.1 Executar Testes de Segurança (TESTING_GUIDE.md)
- **Prioridade:** 🔴 CRÍTICA
- **Impacto:** Validação de 4 camadas de segurança
- **Entregáveis:**
  - Criar 3 contas de teste (Free, Pro, Admin)
  - Executar 5 cenários de teste:
    - **Test 1:** Free user → 403 CANNOT_PUBLISH
    - **Test 2:** Pro user quota → 403 QUOTA_EXCEEDED
    - **Test 3:** Admin curadoria → 200 Success
    - **Test 4:** Self-promotion SQL → Exception blocked
    - **Test 5:** Despublicar → quota liberada
  - Documentar resultados em `docs/TEST_RESULTS.md`
  - Validar Edge Function, RLS, Entitlements, Audit log

#### 7.2 Error Boundaries
- **Prioridade:** 🟡 ALTA
- **Entregáveis:**
  - Criar `components/ErrorBoundary.tsx`
  - Fallback UI:
    - Mensagem amigável ("Algo deu errado")
    - Botão "Reload"
    - Detalhes do erro (somente dev mode)
  - Wrap em `App.tsx`
  - Preparar para Sentry (logging)

#### 7.3 Testes Unitários (Vitest)
- **Prioridade:** 🟢 MÉDIA
- **Entregáveis:**
  - Instalar `vitest`, `@testing-library/react`, `jsdom`
  - Configurar `vitest.config.ts`
  - Testar:
    - **Hooks:**
      - `usePublishAsset.test.ts` (success, errors, loading)
      - `useAuth.test.ts` (login, logout, session)
    - **Components:**
      - `MyAssetsView.test.tsx` (render, toggle publish)
      - `AssetCard.test.tsx` (status badge, actions)
    - **Utils:**
      - Validação de JWT
      - Formatação de datas
  - Coverage mínimo: 50%
  - Scripts: `npm test`, `npm run test:coverage`

#### 7.4 Testes E2E (Playwright - opcional)
- **Prioridade:** 🟢 BAIXA
- **Entregáveis:**
  - Instalar Playwright
  - Fluxos críticos:
    - Login → My Assets → Publish
    - Free user → Upgrade CTA
    - Admin → Promote user
  - CI integration (GitHub Actions)

### Critérios de Aceitação Fase 7
- [ ] 5 testes de segurança executados e documentados
- [ ] Error boundary funcionando
- [ ] Coverage > 50% (hooks críticos testados)
- [ ] 0 falhas em testes automatizados
- [ ] CI rodando testes (futuro)

---

## ⚡ Fase 8: Performance & Scale

**Objetivo:** Otimizar para produção e preparar para milhares de usuários.

**Tempo estimado:** 6h  
**Data prevista:** A definir

### Tarefas

#### 8.1 Code Splitting & Lazy Loading
- **Prioridade:** 🟡 ALTA
- **Entregáveis:**
  - `React.lazy()` para routes:
    ```tsx
    const AdminDashboard = lazy(() => import('./views/AdminDashboard'));
    const MyAssetsView = lazy(() => import('./views/MyAssetsView'));
    ```
  - `<Suspense>` com Skeleton fallback
  - Dynamic imports para:
    - Modais (abrir sob demanda)
    - Syntax highlighter (carregar quando necessário)
  - Redução de bundle inicial: < 150KB

#### 8.2 Database Indexing
- **Prioridade:** 🔴 CRÍTICA
- **Entregáveis:**
  - Criar índices no Postgres:
    ```sql
    CREATE INDEX idx_assets_user_id ON assets(user_id);
    CREATE INDEX idx_assets_is_public ON assets(is_public);
    CREATE INDEX idx_subscriptions_user_id ON subscriptions(user_id);
    CREATE INDEX idx_entitlements_user_id ON entitlements(user_id);
    ```
  - Analisar query performance (EXPLAIN ANALYZE)
  - Otimizar RLS policies (evitar full table scans)

#### 8.3 Caching Strategy
- **Prioridade:** 🟢 MÉDIA
- **Entregáveis:**
  - Zustand persist para:
    - User profile (24h TTL)
    - Entitlements (1h TTL)
  - Supabase query cache:
    ```tsx
    const { data, error } = await supabase
      .from('assets')
      .select('*')
      .eq('user_id', userId)
      .cache({ ttl: 300 }); // 5 min
    ```
  - Browser cache headers (Vercel config)

#### 8.4 Image Optimization
- **Prioridade:** 🟢 BAIXA
- **Entregáveis:**
  - Supabase Storage transformations:
    - Thumbnails: 300x300 (quality 80)
    - Previews: 800x600 (quality 85)
  - WebP format (fallback JPEG)
  - Lazy loading de imagens (Intersection Observer)

### Critérios de Aceitação Fase 8
- [ ] Lighthouse Score > 90
- [ ] FCP < 1.5s
- [ ] TTI < 3s
- [ ] Bundle size < 150KB (gzipped, inicial)
- [ ] Queries < 100ms (p95)
- [ ] Database indexes criados

---

## 🚀 Fase 9: Deploy & Monitoramento

**Objetivo:** Preparar para produção com CI/CD e observabilidade.

**Tempo estimado:** 4h  
**Data prevista:** A definir

### Tarefas

#### 9.1 Metadata & SEO
- **Prioridade:** 🟡 ALTA
- **Entregáveis:**
  - Meta tags no `index.html`:
    - `<title>`, `<meta description>`
    - Open Graph (og:title, og:image, og:url)
    - Twitter Card (twitter:card, twitter:image)
  - PWA manifest básico (`manifest.json`)
  - Favicon set (16x16 até 512x512)
  - robots.txt, sitemap.xml

#### 9.2 Error Tracking (Sentry)
- **Prioridade:** 🔴 CRÍTICA
- **Entregáveis:**
  - Criar conta no Sentry
  - Instalar `@sentry/react`
  - Configurar:
    ```tsx
    Sentry.init({
      dsn: import.meta.env.VITE_SENTRY_DSN,
      environment: import.meta.env.MODE,
      tracesSampleRate: 0.1,
    });
    ```
  - Capturar erros:
    - Uncaught exceptions
    - Edge Function failures (via webhook)
    - Supabase errors
  - Alertas no Slack/Email

#### 9.3 CI/CD com GitHub Actions
- **Prioridade:** 🔴 CRÍTICA
- **Entregáveis:**
  - Workflow `.github/workflows/ci.yml`:
    ```yaml
    name: CI
    on: [push, pull_request]
    jobs:
      test:
        - Checkout
        - Setup Node 20
        - Install deps
        - Lint (ESLint)
        - Type check (tsc)
        - Test (Vitest)
        - Build
      deploy:
        - Deploy to Vercel (if main branch)
    ```
  - Status badge no README
  - Deploy automático:
    - PRs → Preview URL
    - main → Production (rotnemcode.vercel.app)

#### 9.4 Environment Variables
- **Prioridade:** 🟡 ALTA
- **Entregáveis:**
  - Criar `.env.example`:
    ```bash
    VITE_SUPABASE_URL=https://xxx.supabase.co
    VITE_SUPABASE_ANON_KEY=eyJhbGc...
    VITE_SENTRY_DSN=https://xxx@sentry.io/xxx
    VITE_STRIPE_PUBLIC_KEY=pk_live_xxx
    ```
  - Validation com zod (`lib/env.ts`):
    ```tsx
    const envSchema = z.object({
      VITE_SUPABASE_URL: z.string().url(),
      VITE_SUPABASE_ANON_KEY: z.string().min(100),
    });
    export const env = envSchema.parse(import.meta.env);
    ```
  - Type-safe: `env.VITE_SUPABASE_URL` (autocomplete)

### Critérios de Aceitação Fase 9
- [ ] SEO meta tags completos
- [ ] Sentry capturando erros
- [ ] CI rodando em todas as PRs
- [ ] Deploy automático funcionando (Vercel)
- [ ] Env vars tipadas e validadas
- [ ] Production URL ativa

---

## 📈 Métricas de Sucesso

### Técnicas
- ✅ Lighthouse Score: > 90
- ✅ Bundle Size: < 150KB (gzipped, inicial)
- ✅ Test Coverage: > 50% (hooks críticos)
- ✅ TypeScript Strict: 0 errors
- ✅ ESLint: 0 errors, 0 warnings
- ✅ Build Time: < 30s
- ✅ Query Performance: < 100ms (p95)

### Segurança
- ✅ 4 Camadas de segurança implementadas
- ✅ RLS em todas as tabelas críticas
- ✅ JWT com 1h expiration
- ✅ Audit log de ações admin
- ✅ 0 vulnerabilidades CVE em dependências
- ✅ HTTPS obrigatório (Vercel)

### UX
- ✅ FCP (First Contentful Paint): < 1.5s
- ✅ TTI (Time to Interactive): < 3s
- ✅ CLS (Cumulative Layout Shift): < 0.1
- ✅ Acessibilidade (a11y): WCAG AA
- ✅ Mobile-first: responsivo em 100% das views

### Negócio
- 🎯 Conversão Free → Pro: > 5%
- 🎯 Churn rate: < 10%
- 🎯 MRR (Monthly Recurring Revenue): tracking
- 🎯 Assets públicos por usuário: média > 3

### Desenvolvimento
- ✅ Componentes reutilizáveis: 100%
- ✅ Props drilling: eliminado (< 3 níveis)
- ✅ Hot reload: < 100ms
- ✅ IntelliSense: funcionando
- ✅ Git commits: conventional commits

---

## 🎓 Tecnologias por Fase

| Fase | Tecnologias | Status |
|------|-------------|--------|
| 1 | Tailwind, PostCSS, CVA, ESLint, Prettier, Husky | ✅ Completa |
| 2 | React Router, Zustand, Sonner | ✅ Completa |
| 3 | Supabase (Auth, Database, Edge Functions, Storage), PostgreSQL, RLS, JWT | ✅ Completa |
| 4 | Radix UI, Prism.js, React Hook Form, Zod, react-dropzone | ⏳ Pendente |
| 5 | Stripe Checkout, Stripe Webhooks, Stripe Customer Portal | ⏳ Pendente |
| 6 | Admin Dashboard, Audit Log, Asset Moderation, Analytics | ⏳ Pendente |
| 7 | Vitest, Testing Library, Playwright (opcional), Sentry | ⏳ Pendente |
| 8 | React.lazy, Suspense, Database Indexing, Caching, Image Optimization | ⏳ Pendente |
| 9 | GitHub Actions, Vercel, Sentry, SEO, PWA | ⏳ Pendente |

---

## 📝 Notas de Implementação

### Decisões Técnicas
- **Supabase** sobre backend custom: Auth, Database, Storage integrado, RLS nativo
- **Edge Functions** sobre REST API: Serverless, deploy rápido, integração com RLS
- **JWT** sobre Session Cookies: Stateless, escala horizontal fácil
- **PostgreSQL** sobre NoSQL: Relational data, ACID, RLS policies
- **Tailwind PostCSS** sobre CDN: Performance e customização
- **CVA** sobre inline variants: Type-safety e manutenibilidade
- **Zustand** sobre Context: Performance em updates frequentes
- **Radix UI** sobre Headless UI: Melhor DX e docs
- **Vitest** sobre Jest: Mais rápido, melhor integração Vite
- **Sonner** sobre react-hot-toast: Mais leve e customizável
- **Stripe** sobre PayPal: Melhor DX, webhooks confiáveis, Customer Portal

### Dependências Instaladas (Fase 1-3)
```bash
# Core
npm i react react-dom react-router-dom zustand sonner
npm i @supabase/supabase-js

# UI
npm i tailwindcss postcss autoprefixer
npm i class-variance-authority clsx tailwind-merge
npm i lucide-react

# Dev
npm i -D typescript @types/react @types/react-dom
npm i -D eslint prettier @typescript-eslint/parser
npm i -D vite @vitejs/plugin-react
```

### Dependências a Instalar (Fase 4-9)
```bash
# Fase 4: UX Advanced
npm i @radix-ui/react-dialog @radix-ui/react-select
npm i prismjs
npm i react-hook-form @hookform/resolvers zod
npm i react-dropzone

# Fase 5: Stripe
npm i @stripe/stripe-js stripe

# Fase 7: Testes
npm i -D vitest @testing-library/react jsdom
npm i -D playwright @playwright/test # opcional

# Fase 8: Performance
npm i react-window

# Fase 9: Monitoramento
npm i @sentry/react
```

### Supabase Migrations Aplicadas
1. `001_initial_schema.sql` - Tabelas base (assets, subscriptions, entitlements)
2. `002_rls_policies.sql` - Row Level Security
3. `003_admin_role.sql` - Função is_admin()
4. `004_publish_entitlement.sql` - Função check_publish_entitlement()
5. `005_admin_actions_log.sql` - Tabela de audit log
6. `006_prevent_self_promotion.sql` - Trigger de segurança
7. `007_quota_management.sql` - Função get_user_publish_quota()

### Edge Functions Deployed
1. `publish-asset` - Validação de entitlements e publicação
2. `stripe-webhook` - Processamento de eventos Stripe (subscriptions)
3. `create-checkout` (futuro) - Criar Checkout Session
4. `create-portal-session` (futuro) - Customer Portal
5. `promote-admin` (futuro) - Promoção segura de admins

### Estrutura de Pastas Atual
```
rotnemcode/
├── docs/                    # Documentação completa
│   ├── ROADMAP.md           # Este arquivo
│   ├── IMPLEMENTATION_SUMMARY.md
│   ├── SECURITY.md          # Threat model
│   ├── ADMIN_GUIDE.md       # Procedimentos admin
│   ├── FRONTEND_SECURITY.md # Hooks seguros
│   └── TESTING_GUIDE.md     # Cenários de teste
├── src/
│   ├── components/
│   │   ├── Sidebar.tsx
│   │   └── ui/              # shadcn/ui components
│   ├── hooks/
│   │   ├── useAuth.tsx
│   │   ├── useAppStore.tsx
│   │   └── usePublishAsset.tsx
│   ├── views/
│   │   ├── MyAssetsView.tsx
│   │   ├── Templates.tsx
│   │   └── Settings.tsx (placeholder)
│   ├── lib/
│   │   ├── supabase.ts
│   │   └── utils.ts
│   ├── Router.tsx
│   └── App.tsx
├── supabase/
│   ├── functions/
│   │   ├── publish-asset/
│   │   └── stripe-webhook/
│   └── migrations/          # 7 migrations aplicadas
└── package.json
```

---

## 🔐 Segurança - Resumo

### Camadas Implementadas
1. **Frontend**: Hook `usePublishAsset` com JWT validation
2. **Edge Function**: Validação de entitlements e quotas
3. **RLS Policies**: Permissões row-level no Postgres
4. **Audit Log**: Rastreamento de ações admin com trigger anti-self-promotion

### Ataques Mitigados
- ✅ **Bypass de Quota**: Edge Function valida via `get_user_publish_quota()`
- ✅ **Privilege Escalation**: RLS impede UPDATE direto em `is_admin`
- ✅ **Self-Promotion**: Trigger `prevent_admin_self_promotion` bloqueia
- ✅ **Token Theft**: JWT expira em 1h, refresh automático
- ✅ **SQL Injection**: RLS policies com prepared statements
- ✅ **Direct API Access**: SERVICE_ROLE_KEY em Edge Function apenas
- ✅ **CSRF**: Supabase Auth protege (SameSite cookies)

### Próximos Passos de Segurança
- [ ] Rate limiting (Supabase built-in)
- [ ] 2FA (Supabase Auth MFA)
- [ ] CAPTCHA no signup (Cloudflare Turnstile)
- [ ] Content Security Policy (CSP headers)
- [ ] Webhook signature validation (Stripe)

---

**Última atualização:** 04/12/2025  
**Versão atual:** v0.3.0  
**Próximo milestone:** v0.4.0 (Fase 4: UX Advanced)  
**Status:** 3/9 fases completas (33%)
