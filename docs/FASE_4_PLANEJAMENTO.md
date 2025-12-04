# 📋 Fase 4: UX Advanced - Planejamento de Implementação

**Status:** 🔜 Próxima  
**Data prevista:** 04/12/2025 → 11/12/2025  
**Duração estimada:** 8-10h (2 dias)

---

## 📊 Análise do ROADMAP - Contexto Atual

### Estado do Projeto (04/12/2025)
```
Fase 1: Fundação ✅ (29/11/25) - 2h
  └─ Tailwind PostCSS, CVA, ESLint, Prettier, TypeScript Strict

Fase 2: Navegação & Estado ✅ (29/11/25) - 2h
  └─ React Router v6, Zustand, Sonner toasts

Fase 3: Backend & Segurança ✅ (04/12/25) - 6h
  └─ 7 Migrations, 2 Edge Functions, Hook + View, 5 Docs
  └─ 4 camadas de segurança, 7 ataques mitigados

Fase 4: UX Advanced 🔜 (Próxima) - 8-10h
  └─ Upload Form → Supabase, Quota UI, React Hook Form + Zod

Fase 5-9: Stripe, Admin, Testes, Performance, Deploy ⏳
```

**Progress:** 3/9 fases (33%) | ~10h desenvolvimento | ~1500 linhas de código

### Mudança de Prioridades vs ROADMAP

**ROADMAP diz:**
- Fase 4 = UX Advanced (Modais, Syntax Highlighting, Skeleton, Drag&Drop)

**Necessidade Real (MVP):**
- Upload Form → Supabase (crítico para fechar o loop)
- Quota Indicator (critical feedback visual)
- Badge de Plano (Free/Pro identification)
- React Hook Form + Zod (validação robusta)

**Decisão:** Implementar **versão simplificada da Fase 4** focando em:
1. ✅ Upload Form integrado ao Supabase
2. ✅ Quota Indicator em My Assets
3. ✅ Badge de Plano no Navbar
4. ✅ React Hook Form + Zod
5. ✅ Loading states básicos

**Later (Sprint 2):**
- Modais (Radix UI)
- Syntax Highlighting (Prism.js)
- Drag & Drop
- Skeleton loaders

---

## 🎯 Sprint Goal Fase 4

**Fechar o loop de publicação:** Usuário consegue **criar → salvar → visualizar → publicar** assets no MVP.

---

## 📦 Dependências a Instalar

```bash
# React Hook Form + Validação
npm i react-hook-form @hookform/resolvers zod

# Total de novas dependências: 3
# Bundle impact: ~50KB (gzipped)
```

---

## 🏗️ Arquitetura da Fase 4

### Upload Form Flow
```
User preenche form
    ↓
React Hook Form valida via Zod
    ↓
Se valid → onClick handleSubmit()
    ↓
useCreateAsset hook
    ↓
INSERT em assets (is_public = false)
    ↓
Toast success
    ↓
Redirect /my-assets
    ↓
MyAssetsView mostra novo asset
```

### Quota Check Flow
```
User em /my-assets
    ↓
Fetch get_user_publish_quota()
    ↓
{
  current_public_count: 2,
  max_allowed: 5,
  can_publish_more: true,
  tier: "free"
}
    ↓
Renderizar:
- Progress bar (2/5)
- Badge status
- Disable botão se quota = max
```

---

## 📝 Tarefas (Reordenadas por Prioridade)

### CRÍTICAS (Must Have) 🔴

#### Task 1: Schema Zod para Asset
**Prioridade:** 🔴 CRÍTICA | **Tempo:** 30min | **Commits:** 1

**Descrição:**
Criar schema de validação para form de criação de assets.

**Acceptance Criteria:**
- [ ] Arquivo `lib/schemas/assetSchema.ts` criado
- [ ] Validações:
  - title: min 3, max 100
  - description: optional, max 500
  - type: enum (template, section, css, js, html)
  - code: min 1 caractere
  - tags: array opcional, max 10
- [ ] Export `AssetFormData` type
- [ ] Validação JSON customizada para type = template

**Começar com:**
```bash
npm i react-hook-form @hookform/resolvers zod
```

---

#### Task 2: Hook useCreateAsset
**Prioridade:** 🔴 CRÍTICA | **Tempo:** 1h | **Commits:** 1

**Descrição:**
Hook para criar assets no Supabase.

**Acceptance Criteria:**
- [ ] Hook `hooks/useCreateAsset.tsx` criado
- [ ] Função `createAsset(data: AssetFormData)`
- [ ] INSERT em assets com is_public = false
- [ ] Busca user_id de useAuth()
- [ ] Estado `isCreating` para loading
- [ ] Toast success com "Criado com sucesso!"
- [ ] Toast error com mensagem específica
- [ ] Return asset criado (para analytics futuro)

**Key Implementation:**
```typescript
// hooks/useCreateAsset.tsx
const createAsset = async (data: AssetFormData) => {
  const { data: asset, error } = await supabase
    .from('assets')
    .insert({
      ...data,
      user_id: user.id,
      is_public: false, // SEMPRE false ao criar
    })
    .select()
    .single();
};
```

---

#### Task 3: Refactor UploadForm com React Hook Form
**Prioridade:** 🔴 CRÍTICA | **Tiempo:** 1h 30min | **Commits:** 1

**Descrição:**
Integrar React Hook Form e Zod no UploadForm existente.

**Acceptance Criteria:**
- [ ] `useForm` hook configurado com zodResolver
- [ ] Todos os inputs com `register()`
- [ ] Error messages por campo
- [ ] Submit handler com `handleSubmit()`
- [ ] Loading state no botão (isSubmitting)
- [ ] Disable inputs durante submit
- [ ] Reset form após sucesso
- [ ] Integração com `useCreateAsset`

**Componentes afetados:**
- `components/UploadForm.tsx` (refactor completo)

**Validação:**
- [ ] Form valida antes de enviar
- [ ] Erros aparecem inline
- [ ] Loading state funciona
- [ ] Redirect para /my-assets após sucesso

---

#### Task 4: Hook useGetQuota
**Prioridade:** 🔴 CRÍTICA | **Tiempo:** 45min | **Commits:** 1

**Descrição:**
Hook para buscar quota atual do usuário.

**Acceptance Criteria:**
- [ ] Hook `hooks/useGetQuota.tsx` criado
- [ ] Chama `supabase.rpc('get_user_publish_quota')`
- [ ] Retorna `{ current_public_count, max_allowed, can_publish_more, tier }`
- [ ] Estado `isLoading` para fetch inicial
- [ ] Função `refetch()` manual (para após publish)
- [ ] Error handling com toast

**Key Implementation:**
```typescript
// hooks/useGetQuota.tsx
const fetchQuota = async () => {
  const { data, error } = await supabase
    .rpc('get_user_publish_quota');
  
  if (error) throw error;
  setQuota(data);
};
```

---

#### Task 5: Adicionar Quota Indicator em MyAssetsView
**Prioridad:** 🔴 CRÍTICA | **Tiempo:** 1h | **Commits:** 1

**Descripción:**
Exibir quota visual em My Assets view.

**Acceptance Criteria:**
- [ ] Hook `useGetQuota` integrado em MyAssetsView
- [ ] Exibir "X/Y assets públicos" no topo
- [ ] Progress bar visual (0-100%)
- [ ] Cores:
  - Verde: < 70%
  - Amarelo: 70-90%
  - Vermelho: > 90%
- [ ] Warning quando > 90%
- [ ] CTA "Upgrade to Pro" se quota = 100%
- [ ] Loading state durante fetch

**Rendering:**
```tsx
<div className="mb-6 p-4 bg-white dark:bg-gray-800 rounded-lg">
  <div className="flex justify-between items-center mb-2">
    <span>Assets Públicos</span>
    <span className="font-semibold">{quota.current}/{quota.max}</span>
  </div>
  
  <div className="w-full bg-gray-200 rounded-full h-2">
    <div
      className={`h-2 rounded-full transition-all ${quotaColor}`}
      style={{ width: `${quotaPercentage}%` }}
    />
  </div>
  
  {quotaPercentage > 90 && (
    <p className="mt-2 text-sm text-yellow-600">
      ⚠️ Próximo do limite!
    </p>
  )}
</div>
```

---

#### Task 6: Desabilitar Botão Publicar quando Quota Atingida
**Prioridade:** 🔴 CRÍTICA | **Tiempo:** 15min | **Commits:** 1

**Descripción:**
Bloquear publicação quando user atingiu quota.

**Acceptance Criteria:**
- [ ] Botão "Publicar" desabilitado se `quota.current >= quota.max`
- [ ] Tooltip: "Quota atingida. Despublique um asset ou faça upgrade."
- [ ] Botão "Despublicar" sempre habilitado

**Code:**
```tsx
<Button
  onClick={() => handleTogglePublish(asset)}
  disabled={!asset.is_public && !quota.can_publish_more}
  title={!quota.can_publish_more ? 'Quota atingida' : ''}
>
  {asset.is_public ? 'Despublicar' : 'Publicar'}
</Button>
```

---

#### Task 7: Badge de Plano no Navbar
**Prioridade:** 🔴 CRÍTICA | **Tiempo:** 30min | **Commits:** 1

**Descripción:**
Exibir Free/Pro badge no Navbar.

**Acceptance Criteria:**
- [ ] Query entitlements.tier no useAuth
- [ ] Badge criado ao lado do avatar
- [ ] Free user → "Free" (cinza, variant="secondary")
- [ ] Pro user → "✨ Pro" (azul, variant="default")
- [ ] Tooltip: "Plano Free: 5 assets públicos"
- [ ] Link para /pricing ao clicar

**Código:**
```tsx
// components/Navbar.tsx
<Link to="/pricing">
  <Badge 
    variant={userTier === 'pro' ? 'default' : 'secondary'}
    title={`Plano ${userTier === 'pro' ? 'Pro: 50' : 'Free: 5'} assets públicos`}
  >
    {userTier === 'pro' ? '✨ Pro' : 'Free'}
  </Badge>
</Link>
```

---

### ALTAS (Should Have) 🟡

#### Task 8: Loading States no Upload Form
**Prioridade:** 🟡 ALTA | **Tiempo:** 30min | **Commits:** 1

**Descripción:**
Adicionar feedback visual durante upload.

**Acceptance Criteria:**
- [ ] Spinner no botão submit durante isSubmitting
- [ ] Inputs desabilitados durante submit
- [ ] Label do botão muda para "Salvando..."
- [ ] Animação suave (transição CSS)

---

#### Task 9: Validação JSON em Tempo Real
**Prioridade:** 🟡 ALTA | **Tiempo:** 30min | **Commits:** 1

**Descripción:**
Validar JSON quando type = template.

**Acceptance Criteria:**
- [ ] Zod refine customizado
- [ ] Error message: "JSON inválido"
- [ ] Validação apenas para type = template
- [ ] Red border no input se inválido

---

### MÉDIAS (Could Have) 🟢

#### Task 10: Error Boundary Melhorado
**Prioridad:** 🟢 MÉDIA | **Tiempo:** 1h | **Commits:** 1

**Description:**
Implementar error boundary mais robusto.

**Acceptance Criteria:**
- [ ] Component `components/ErrorBoundary.tsx`
- [ ] Fallback UI amigável
- [ ] Botão "Reload"
- [ ] Dev-only detalhes do erro

---

## 📊 Estimativa de Tempo

| Task | Tempo | Deps |
|------|-------|------|
| 1. Schema Zod | 30min | npm install |
| 2. useCreateAsset | 1h | Task 1 |
| 3. UploadForm refactor | 1h 30min | Task 1, 2 |
| 4. useGetQuota | 45min | Backend ✅ |
| 5. Quota Indicator | 1h | Task 4 |
| 6. Disable Publish | 15min | Task 5 |
| 7. Badge Navbar | 30min | useAuth ✅ |
| 8. Loading States | 30min | Task 3 |
| 9. JSON Validation | 30min | Task 1 |
| 10. Error Boundary | 1h | React ✅ |
| **Total** | **8-9h** | |

---

## 🔀 Ordem de Implementação

### Day 1 (4-5h)
1. npm install (5min)
2. Task 1: Schema Zod (30min)
3. Task 4: useGetQuota (45min)
4. Task 2: useCreateAsset (1h)
5. Task 3: UploadForm refactor (1h 30min)
6. Commit 1: "feat(frontend): adicionar React Hook Form + Zod"

### Day 2 (4-5h)
1. Task 5: Quota Indicator (1h)
2. Task 6: Disable Publish (15min)
3. Task 7: Badge Navbar (30min)
4. Task 8: Loading States (30min)
5. Task 9: JSON Validation (30min)
6. Task 10: Error Boundary (1h) - opcional se tempo permitir
7. Commit 2: "feat(frontend): implementar Quota UI e validações"

---

## ✅ Checklist de Testes

### Testes Manuais

**Upload Form:**
- [ ] Form vazio → erros de validação
- [ ] Título com 2 caracteres → erro "mínimo 3"
- [ ] JSON inválido → erro "JSON inválido"
- [ ] Submit válido → Toast success + redirect /my-assets
- [ ] Asset aparece em My Assets com is_public = false

**Quota:**
- [ ] Criar 5 assets → Quota 0/5 (nenhum public)
- [ ] Publicar 5 assets → Quota 5/5
- [ ] Botão "Publicar" desabilitado
- [ ] Despublicar 1 → Quota 4/5
- [ ] Botão "Publicar" habilitado novamente

**Badge:**
- [ ] Free user → "Free" cinza
- [ ] (Futuro) Pro user → "✨ Pro" azul
- [ ] Tooltip funciona
- [ ] Link para /pricing funciona

**Loading:**
- [ ] Submit form → spinner aparece
- [ ] Inputs desabilitados
- [ ] Label muda para "Salvando..."
- [ ] Após sucesso → volta ao normal

---

## 🚀 Next Steps Após Fase 4

### Imediatamente (Fase 5 - Stripe)
1. Criar `/pricing` page com planos Free/Pro
2. Integrar Stripe Checkout
3. Webhook Stripe atualizando entitlements
4. Customer Portal para gerenciar assinatura

### Segunda Semana (Fase 6 - Admin)
1. Admin Dashboard (`/admin/users`)
2. Audit Log viewer
3. Moderação de assets

### Testes de Segurança (Fase 7)
1. Executar 5 cenários do TESTING_GUIDE.md
2. Vitest para unit tests
3. Error Boundary testing

---

## 📈 Métricas de Sucesso Fase 4

### Técnicas
- ✅ Upload form salva em Supabase (100% success)
- ✅ Validação funciona (0 submits inválidos)
- ✅ Quota exibida em real-time
- ✅ Bundle size < 200KB (gzipped)

### UX
- ✅ Feedback visual em todas as ações
- ✅ Erros claros e específicos
- ✅ Loading states profissionais
- ✅ < 500ms para salvar asset

### Negócio
- 🎯 +30% em criação de assets (vs baseline)
- 🎯 Usuários veem limite de quota
- 🎯 CTA para upgrade funciona

---

## 📋 Dependências

### Nova Instalação
```bash
npm i react-hook-form @hookform/resolvers zod
```

### Já Existentes
- React Hook Form: ✅
- Zod: ✅ 
- Supabase client: ✅
- Sonner toasts: ✅
- Zustand store: ✅

---

## 🎯 Definition of Done

- [ ] Todas as 10 tasks completas (ou 7 críticas + 3 altas)
- [ ] npm install sem errors
- [ ] Compilação sem erros TypeScript
- [ ] ESLint 0 errors
- [ ] Testes manuais passando
- [ ] 2 commits organizados
- [ ] README atualizado (se necessário)
- [ ] ROADMAP atualizado com status Fase 4

---

**Preparado para começar!** 🚀

Próximo: `npm i react-hook-form @hookform/resolvers zod`
