# Security Architecture - RotnemCode

## 🎯 Visão Geral

Este documento descreve a arquitetura de segurança multi-camadas da aplicação RotnemCode, com foco em prevenir bypass de validações de entitlements, proteção contra privilege escalation, e garantir integridade de dados.

---

## 🏗️ Camadas de Segurança

```
┌────────────────────────────────────────────────────────────┐
│ Camada 1: Frontend (React + Supabase Client)              │
│ - Validações de UI para UX (não confiar para segurança)   │
│ - Toasts e mensagens de erro amigáveis                    │
│ - Hook usePublishAsset para chamadas seguras              │
└────────────────────────────────────────────────────────────┘
                         ↓ JWT Authorization Header
┌────────────────────────────────────────────────────────────┐
│ Camada 2: Edge Functions (Deno Runtime)                   │
│ - publish-asset: valida entitlements + quotas             │
│ - stripe-webhook: atualiza subscriptions + entitlements   │
│ - Usa SERVICE_ROLE_KEY para bypass RLS quando necessário  │
└────────────────────────────────────────────────────────────┘
                         ↓ SQL Queries com RLS
┌────────────────────────────────────────────────────────────┐
│ Camada 3: PostgreSQL + Row Level Security (RLS)           │
│ - Políticas bloqueiam UPDATE direto em is_admin           │
│ - Triggers auditam todas as promoções a admin             │
│ - Funções helper: is_admin(uuid), check_user_quota()      │
└────────────────────────────────────────────────────────────┘
                         ↓ Audit Trail
┌────────────────────────────────────────────────────────────┐
│ Camada 4: Audit & Logging                                 │
│ - Tabela admin_actions: log de todas as alterações        │
│ - Edge Function logs (Supabase Dashboard)                 │
│ - Stripe webhook logs                                      │
└────────────────────────────────────────────────────────────┘
```

---

## 🔐 Threat Model

### 1. Bypass de Entitlements via Client Direto

**Ataque**: Free user abre DevTools e executa:
```typescript
await supabase.from('assets').update({ is_public: true }).eq('id', assetId);
```

**Mitigação**:
- ✅ RLS policy permite UPDATE apenas via SERVICE_ROLE_KEY
- ✅ Edge Function `publish-asset` obrigatória
- ✅ Validação de `entitlements.can_publish` no backend
- ✅ Frontend usa hook `usePublishAsset` (chama Edge Function)

**Resultado**: UPDATE direto falha silenciosamente (RLS bloqueia).

---

### 2. JWT Tampering

**Ataque**: Atacante modifica JWT para trocar `user_id` ou adicionar claim `is_admin`.

**Mitigação**:
- ✅ Supabase valida assinatura HMAC do JWT (SECRET_KEY)
- ✅ Claims `user_id` e `role` são verificados pelo servidor
- ✅ Edge Functions extraem `user.id` via `auth.getUser()` (server-side)

**Resultado**: JWT alterado retorna `401 Unauthorized`.

---

### 3. Privilege Escalation (Self-Promotion a Admin)

**Ataque**: Usuário comum tenta promover-se a admin via:
```sql
UPDATE profiles SET is_admin = true WHERE id = auth.uid();
```

**Mitigação**:
- ✅ RLS policy **split em duas**:
  - Policy 1 (users): `WITH CHECK (is_admin IS NULL OR is_admin = OLD.is_admin)`
  - Policy 2 (admins): `USING (is_admin(auth.uid()))` pode UPDATE qualquer profile
- ✅ Trigger `prevent_self_admin_promotion()` bloqueia self-promotion
- ✅ Audit log registra tentativas (admin_actions table)

**Resultado**: UPDATE com `is_admin = true` lança exceção SQL.

---

### 4. Quota Bypass

**Ataque**: Free user tenta publicar mais assets do que seu limite usando requisições paralelas.

**Mitigação**:
- ✅ Contagem de assets via `SERVICE_ROLE_KEY` (não pode ser manipulada)
- ✅ Atomic UPDATE com `WHERE` clause e transação
- ✅ Edge Function valida quota **antes** de cada publicação
- ✅ Race condition prevenida por serialização na Edge Function

**Resultado**: Requisição paralela 51+ retorna `403 QUOTA_EXCEEDED`.

---

### 5. SQL Injection

**Ataque**: Injeção de SQL via parâmetros de query.

**Mitigação**:
- ✅ Supabase client usa prepared statements
- ✅ Parâmetros são escapados automaticamente
- ✅ Edge Functions validam tipos (`typeof isPublic !== 'boolean'`)
- ✅ RLS policies usam `auth.uid()` (server-side, não user input)

**Resultado**: Supabase sanitiza automaticamente, não há vetores de injeção.

---

### 6. Mass Assignment

**Ataque**: Usuário envia campos extras no body para alterar `is_featured` ou `is_admin`.

**Mitigação**:
- ✅ Edge Functions extraem apenas campos esperados: `{ assetId, isPublic }`
- ✅ UPDATE hardcoded: `.update({ is_public: isPublic, updated_at: ... })`
- ✅ RLS policies bloqueiam alteração de campos privilegiados

**Resultado**: Campos extras são ignorados pela Edge Function.

---

### 7. Session Hijacking

**Ataque**: Roubo de JWT via XSS ou network sniffing.

**Mitigação**:
- ✅ JWT expira em **1 hora** (refresh necessário)
- ✅ Supabase usa `httpOnly` cookies (não acessível via JS)
- ✅ HTTPS obrigatório (TLS)
- ✅ CSP headers previnem XSS (configurar no Supabase)

**Resultado**: Janela de exposição limitada + refresh automático.

---

## 🛡️ Recursos de Segurança Implementados

### Migration 007: Secure Admin Promotion

**Arquivo**: `supabase/migrations/007_secure_admin_promotion.sql`

**Componentes**:
1. **Tabela `admin_actions`**: Audit log de promoções/demotes
   ```sql
   CREATE TABLE admin_actions (
     id UUID PRIMARY KEY,
     admin_id UUID REFERENCES profiles(id),  -- Quem fez a ação
     action TEXT NOT NULL,                    -- PROMOTE_TO_ADMIN | DEMOTE_FROM_ADMIN
     target_user_id UUID REFERENCES profiles(id),  -- Usuário afetado
     metadata JSONB,                          -- { via_sql_editor: boolean }
     ip_address INET,
     created_at TIMESTAMPTZ DEFAULT NOW()
   );
   ```

2. **Trigger `log_admin_promotion()`**: Log automático de alterações
   - Captura OLD.is_admin e NEW.is_admin
   - Registra admin_id (auth.uid()) ou NULL se via SQL Editor
   - Adiciona flag `via_sql_editor` para bootstrap

3. **Trigger `prevent_self_admin_promotion()`**: Bloqueia self-promotion
   ```sql
   IF current_user_id IS NOT NULL AND current_user_id = NEW.id THEN
     RAISE EXCEPTION 'Cannot promote yourself to admin';
   END IF;
   ```
   - Se `current_user_id IS NULL` (SQL Editor): permite (bootstrap)
   - Se session existe: valida que `current_user_id != NEW.id`

4. **Split RLS Policies**: Duas policies em vez de uma
   ```sql
   -- Policy 1: Users (não pode alterar is_admin)
   CREATE POLICY "Users can update own profile fields"
   ON profiles FOR UPDATE
   USING (auth.uid() = id)
   WITH CHECK (
     is_admin IS NULL OR is_admin = (SELECT is_admin FROM profiles WHERE id = auth.uid())
   );

   -- Policy 2: Admins (pode alterar qualquer profile)
   CREATE POLICY "Admins can update any profile"
   ON profiles FOR UPDATE
   USING (is_admin(auth.uid()));
   ```

5. **Função `get_recent_admin_actions()`**: Query de audit log
   ```sql
   SELECT 
     aa.*,
     admin_profiles.email AS admin_email,
     target_profiles.email AS target_email
   FROM admin_actions aa
   LEFT JOIN profiles admin_profiles ON aa.admin_id = admin_profiles.id
   LEFT JOIN profiles target_profiles ON aa.target_user_id = target_profiles.id
   ORDER BY aa.created_at DESC
   LIMIT limit_count;
   ```

---

### Edge Function: publish-asset

**Arquivo**: `supabase/functions/publish-asset/index.ts`

**Fluxo**:
```typescript
1. Validar JWT (auth.getUser())
   ↓
2. Buscar asset + verificar ownership
   ↓
3. Verificar se user é admin
   ↓ (se NÃO admin E publicando)
4. Validar entitlements.can_publish
   ↓
5. Contar assets públicos vs max_assets
   ↓
6. UPDATE via SERVICE_ROLE_KEY
   ↓
7. Retornar success/error
```

**Validações**:
- ✅ `assetId` e `isPublic` required
- ✅ `isPublic` deve ser boolean
- ✅ Asset existe e pertence ao usuário
- ✅ `entitlements.can_publish = true` (Free → 403)
- ✅ Quota não excedida (count < max_assets)
- ✅ Admin bypass para curadoria

**Respostas**:
| Status | Código | Significado |
|--------|--------|-------------|
| 200 | `success: true` | Asset publicado/despublicado |
| 400 | `Bad Request` | Parâmetros inválidos |
| 401 | `Unauthorized` | JWT inválido |
| 403 | `CANNOT_PUBLISH` | Free user sem permissão |
| 403 | `QUOTA_EXCEEDED` | Limite de assets atingido |
| 404 | `Not Found` | Asset não existe |
| 500 | `Internal Server Error` | Erro inesperado |

---

### Frontend Hook: usePublishAsset

**Arquivo**: `hooks/usePublishAsset.ts`

**Interface**:
```typescript
const { publishAsset, isPublishing } = usePublishAsset();

// Publicar
await publishAsset('asset-uuid', true);

// Despublicar
await publishAsset('asset-uuid', false);
```

**Tratamento de Erros**:
- `CANNOT_PUBLISH` → Toast com botão "Upgrade"
- `QUOTA_EXCEEDED` → Toast com detalhes da quota
- `ENTITLEMENT_MISSING` → Toast com contato suporte
- Erros genéricos → Toast com mensagem de erro

---

## 🔍 Auditoria e Monitoramento

### 1. Logs de Admin Actions

**Query**: Últimas 100 ações de admin
```sql
SELECT * FROM get_recent_admin_actions(100);
```

**Campos**:
- `admin_email`: Email do admin que fez a ação
- `action`: PROMOTE_TO_ADMIN ou DEMOTE_FROM_ADMIN
- `target_email`: Email do usuário afetado
- `metadata.via_sql_editor`: true se feito via SQL Editor (bootstrap)
- `created_at`: Timestamp da ação

**Alertas**:
- Múltiplas promoções em curto período → possível comprometimento
- Promoções via SQL Editor fora do horário de trabalho → investigar
- Self-promotion attempts (capturados pelo trigger) → red flag

---

### 2. Edge Function Logs

**Comando**: Ver logs em tempo real
```bash
supabase functions logs publish-asset --tail
```

**Filtrar erros**:
```bash
supabase functions logs publish-asset | grep "error"
```

**Métricas Importantes**:
- Taxa de `403 CANNOT_PUBLISH` → demanda por upgrade Pro
- Taxa de `403 QUOTA_EXCEEDED` → usuários ativos atingindo limites
- Taxa de `401 Unauthorized` → problemas com sessão/refresh

---

### 3. Dashboard de Segurança (Recomendado)

**Métricas sugeridas**:
```sql
-- Free users tentando publicar (últimas 24h)
SELECT COUNT(*) FROM edge_function_logs
WHERE function_name = 'publish-asset'
  AND status_code = 403
  AND error_code = 'CANNOT_PUBLISH'
  AND created_at > NOW() - INTERVAL '24 hours';

-- Assets públicos por plano
SELECT 
  s.tier,
  COUNT(*) AS total_public_assets
FROM assets a
JOIN profiles p ON a.user_id = p.id
LEFT JOIN subscriptions s ON p.id = s.user_id
WHERE a.is_public = true AND a.deleted_at IS NULL
GROUP BY s.tier;

-- Promoções a admin (últimos 30 dias)
SELECT 
  DATE_TRUNC('day', created_at) AS date,
  COUNT(*) AS promotions
FROM admin_actions
WHERE action = 'PROMOTE_TO_ADMIN'
  AND created_at > NOW() - INTERVAL '30 days'
GROUP BY date
ORDER BY date;
```

---

## 🚨 Procedimentos de Resposta a Incidentes

### Cenário 1: Usuário reclama que não consegue publicar

**Diagnóstico**:
1. Verificar entitlements do usuário:
   ```sql
   SELECT can_publish, max_assets FROM entitlements WHERE user_id = 'uuid';
   ```
2. Verificar quota de assets públicos:
   ```sql
   SELECT COUNT(*) FROM assets 
   WHERE user_id = 'uuid' AND is_public = true AND deleted_at IS NULL;
   ```

**Resolução**:
- Se `can_publish = false` → Verificar subscription ativa
- Se quota excedida → Orientar a deletar assets ou upgrade
- Se entitlements ausente → Criar via SQL ou trigger

---

### Cenário 2: Admin promovido indevidamente

**Diagnóstico**:
1. Query audit log:
   ```sql
   SELECT * FROM admin_actions 
   WHERE target_user_id = 'uuid' 
   ORDER BY created_at DESC LIMIT 10;
   ```
2. Verificar `via_sql_editor` flag
3. Verificar `admin_email` (quem fez a promoção)

**Resolução**:
1. Demote imediatamente:
   ```sql
   UPDATE profiles SET is_admin = false WHERE id = 'uuid';
   ```
2. Investigar como o bypass ocorreu
3. Revisar logs de acesso ao SQL Editor
4. Revocar credenciais do admin comprometido (se aplicável)

---

### Cenário 3: Edge Function retornando 500

**Diagnóstico**:
```bash
supabase functions logs publish-asset --tail
```

**Possíveis Causas**:
- `SUPABASE_SERVICE_ROLE_KEY` não configurado → Verificar env vars
- Timeout na query → Otimizar índices
- RLS policy bloqueando UPDATE → Verificar policies

**Resolução**:
1. Corrigir env vars no Dashboard → Settings → Edge Functions
2. Adicionar índices faltantes:
   ```sql
   CREATE INDEX IF NOT EXISTS idx_assets_user_public 
   ON assets(user_id, is_public) WHERE deleted_at IS NULL;
   ```
3. Verificar policies com `EXPLAIN ANALYZE`

---

## 📋 Checklist de Segurança

### Deployment

- [ ] Migration 007 aplicada no banco de produção
- [ ] Edge Function `publish-asset` deployada
- [ ] Env vars configuradas (SUPABASE_URL, ANON_KEY, SERVICE_ROLE_KEY)
- [ ] Frontend usando `usePublishAsset` hook (não UPDATE direto)
- [ ] Primeiro admin criado via SQL direto (bootstrap)
- [ ] Audit log funcionando (query `get_recent_admin_actions()`)

### Testes

- [ ] Free user tenta publicar → 403 CANNOT_PUBLISH
- [ ] Pro user publica até max_assets → sucesso
- [ ] Pro user tenta 51º asset → 403 QUOTA_EXCEEDED
- [ ] Admin publica asset de outro usuário → sucesso (curadoria)
- [ ] Usuário comum tenta self-promotion → SQL exception
- [ ] Despublicar asset libera slot na quota → verificar count

### Monitoramento

- [ ] Dashboard de métricas configurado (Grafana/Metabase)
- [ ] Alertas para múltiplas promoções a admin
- [ ] Logs de Edge Functions sendo revisados semanalmente
- [ ] Backup do audit log (admin_actions table)

---

## 🔗 Referências

- [Frontend Security Guide](./FRONTEND_SECURITY.md) - Hook usePublishAsset e migração
- [Edge Function README](../supabase/functions/publish-asset/README.md) - API docs
- [Backend Architecture](./BACKEND_ARCHITECTURE.md) - RLS policies e schema
- [Subscriptions & Entitlements](./SUBSCRIPTIONS.md) - Planos e quotas
- [Migration 007](../supabase/migrations/007_secure_admin_promotion.sql) - Código SQL

---

## 📝 Próximos Passos (Opcional/Futuro)

- [ ] Rate limiting (100 req/min por usuário)
- [ ] Webhook para notificar sobre novas publicações
- [ ] Dashboard admin para revisar assets publicados
- [ ] 2FA obrigatório para admins
- [ ] IP allowlist para SQL Editor (produção)
- [ ] Criptografia de thumbnails via Storage hooks
- [ ] CAPTCHA para signup (prevenir spam)
- [ ] Métricas de publicações por plano (analytics)
