# Admin Management & Recovery Procedures

## 🎯 Visão Geral

Este documento descreve procedimentos operacionais para gerenciar administradores, recovery em caso de emergências, e manutenção da segurança do sistema RotnemCode.

---

## 👤 Criação de Administradores

### Método 1: Bootstrap (Primeiro Admin)

**Quando usar**: Primeiro admin do sistema ou recovery após perder todos os admins.

**Pré-requisitos**:
- Acesso ao **Supabase Dashboard → SQL Editor**
- Usuário já criado via signup normal

**Procedimento**:

1. **Login do usuário via app** (para criar registro em `profiles`):
   - Acessar app e fazer signup/login com email/senha
   - Confirmar que profile foi criado:
     ```sql
     SELECT id, email, is_admin FROM profiles WHERE email = 'admin@example.com';
     ```

2. **Promover usuário a admin via SQL Editor**:
   ```sql
   -- Substituir 'admin@example.com' pelo email real
   UPDATE profiles 
   SET is_admin = true 
   WHERE email = 'admin@example.com';
   ```

3. **Verificar promoção no audit log**:
   ```sql
   SELECT * FROM get_recent_admin_actions(10);
   ```
   - Deve aparecer com `via_sql_editor: true` no metadata

4. **Testar permissões**:
   - Fazer logout e login novamente no app
   - Verificar que usuário tem acesso a funcionalidades admin

**⚠️ Segurança**: 
- Este método **bypassa** o trigger `prevent_self_admin_promotion` porque `auth.uid()` retorna NULL no SQL Editor
- Apenas use para bootstrap ou emergência
- Registre a ação em um log externo (quem fez, quando, por quê)

---

### Método 2: Admin promovendo outro Admin

**Quando usar**: Operação normal após primeiro admin existir.

**Pré-requisitos**:
- Usuário atual tem `is_admin = true`
- Usuário target já fez signup no app

**Procedimento via SQL** (recomendado para rastreabilidade):

```sql
-- Verificar se usuário atual é admin
SELECT is_admin FROM profiles WHERE id = auth.uid();
-- Deve retornar: is_admin = true

-- Promover novo admin
UPDATE profiles 
SET is_admin = true 
WHERE email = 'newadmin@example.com';

-- Verificar audit log
SELECT * FROM get_recent_admin_actions(5);
```

**Procedimento via UI Admin Panel** (futuro):
- TODO: Implementar página `/admin/users`
- Listar todos os usuários
- Botão "Promover a Admin" (chama Edge Function)
- Confirmação com senha do admin atual

---

## 🔓 Recovery Procedures

### Cenário 1: Perda de Todos os Admins

**Sintomas**:
- Nenhum usuário com `is_admin = true` no banco
- Impossível promover usuários via app

**Resolução**:
1. Seguir **Método 1: Bootstrap** (acima)
2. Criar ao menos 2 admins (redundância)
3. Documentar quem são os admins em local seguro (1Password, etc)

**Prevenção**:
- Manter **pelo menos 2 admins ativos** sempre
- Revisar lista de admins mensalmente:
  ```sql
  SELECT id, email, created_at, updated_at 
  FROM profiles 
  WHERE is_admin = true 
  ORDER BY created_at;
  ```

---

### Cenário 2: Admin Comprometido

**Sintomas**:
- Atividade suspeita no audit log
- Promoções/demotes não autorizados
- Usuário reporta acesso não autorizado

**Diagnóstico**:
```sql
-- Ver todas as ações do admin suspeito (últimas 24h)
SELECT * FROM admin_actions 
WHERE admin_id = 'uuid-do-admin-suspeito' 
  AND created_at > NOW() - INTERVAL '24 hours'
ORDER BY created_at DESC;

-- Ver logins recentes do admin
SELECT * FROM auth.audit_log_entries 
WHERE payload->>'user_id' = 'uuid-do-admin-suspeito'
ORDER BY created_at DESC LIMIT 50;
```

**Resolução Imediata**:

1. **Revogar acesso de admin**:
   ```sql
   UPDATE profiles 
   SET is_admin = false 
   WHERE id = 'uuid-do-admin-suspeito';
   ```

2. **Forçar logout** (invalidar refresh tokens):
   ```sql
   -- Via Supabase Dashboard → Authentication → Users
   -- Clicar no usuário → "Sign out user"
   ```

3. **Trocar senha do admin comprometido**:
   - Via Dashboard: Authentication → Users → Reset Password
   - Ou via API:
     ```typescript
     await supabase.auth.admin.updateUserById('uuid', {
       password: 'new-secure-password'
     });
     ```

4. **Investigar impacto**:
   ```sql
   -- Assets alterados pelo admin nas últimas 24h
   SELECT a.* FROM assets a
   JOIN admin_actions aa ON a.user_id = aa.target_user_id
   WHERE aa.admin_id = 'uuid-do-admin-suspeito'
     AND aa.created_at > NOW() - INTERVAL '24 hours';

   -- Usuários promovidos/demovidos
   SELECT * FROM admin_actions 
   WHERE admin_id = 'uuid-do-admin-suspeito'
   ORDER BY created_at DESC;
   ```

5. **Reverter alterações não autorizadas** (se aplicável):
   ```sql
   -- Demover admins promovidos indevidamente
   UPDATE profiles 
   SET is_admin = false 
   WHERE id IN (
     SELECT target_user_id FROM admin_actions 
     WHERE admin_id = 'uuid-do-admin-suspeito'
       AND action = 'PROMOTE_TO_ADMIN'
       AND created_at > NOW() - INTERVAL '24 hours'
   );
   ```

**Pós-Incidente**:
- Documentar timeline do incidente
- Notificar usuários afetados (se dados foram acessados)
- Revisar logs de acesso ao SQL Editor
- Considerar implementar 2FA obrigatório para admins

---

### Cenário 3: Entitlements Corrompidos

**Sintomas**:
- Pro user não consegue publicar assets
- Edge Function retorna `ENTITLEMENT_MISSING`
- `entitlements` table com registros ausentes

**Diagnóstico**:
```sql
-- Verificar usuários sem entitlements
SELECT p.id, p.email 
FROM profiles p
LEFT JOIN entitlements e ON p.id = e.user_id
WHERE e.user_id IS NULL;

-- Ver entitlements do usuário específico
SELECT * FROM entitlements WHERE user_id = 'uuid';
```

**Resolução**:

1. **Criar entitlements default para usuário**:
   ```sql
   INSERT INTO entitlements (user_id, tier, can_publish, max_assets)
   VALUES (
     'uuid-do-usuario',
     'free',  -- ou 'pro'
     false,   -- true para Pro
     5        -- ou 50 para Pro
   )
   ON CONFLICT (user_id) DO UPDATE SET
     tier = EXCLUDED.tier,
     can_publish = EXCLUDED.can_publish,
     max_assets = EXCLUDED.max_assets;
   ```

2. **Recriar entitlements para TODOS os usuários** (se muitos afetados):
   ```sql
   INSERT INTO entitlements (user_id, tier, can_publish, max_assets)
   SELECT 
     p.id,
     COALESCE(s.tier, 'free') AS tier,
     CASE WHEN COALESCE(s.tier, 'free') = 'pro' THEN true ELSE false END AS can_publish,
     CASE WHEN COALESCE(s.tier, 'free') = 'pro' THEN 50 ELSE 5 END AS max_assets
   FROM profiles p
   LEFT JOIN subscriptions s ON p.id = s.user_id
   ON CONFLICT (user_id) DO NOTHING;
   ```

3. **Verificar correção**:
   ```sql
   -- Contar usuários sem entitlements (deve ser 0)
   SELECT COUNT(*) FROM profiles p
   LEFT JOIN entitlements e ON p.id = e.user_id
   WHERE e.user_id IS NULL;
   ```

**Prevenção**:
- Implementar trigger `ON INSERT INTO profiles` para criar entitlements default
- Monitorar contagem de `profiles` vs `entitlements` diariamente

---

### Cenário 4: Quota Incorreta

**Sintomas**:
- Pro user recebe `QUOTA_EXCEEDED` mesmo tendo <50 assets
- Free user conseguiu publicar >5 assets

**Diagnóstico**:
```sql
-- Verificar quota real do usuário
SELECT 
  e.max_assets AS quota_limite,
  COUNT(a.id) AS assets_publicos_reais
FROM entitlements e
LEFT JOIN assets a ON e.user_id = a.user_id 
  AND a.is_public = true 
  AND a.deleted_at IS NULL
WHERE e.user_id = 'uuid'
GROUP BY e.max_assets;
```

**Resolução**:

1. **Corrigir max_assets se incorreto**:
   ```sql
   UPDATE entitlements 
   SET max_assets = 50  -- ou 5 para Free
   WHERE user_id = 'uuid';
   ```

2. **Despublicar assets excedentes** (se Free ultrapassou limite):
   ```sql
   -- Despublicar assets mais antigos acima do limite
   WITH ranked_assets AS (
     SELECT id, ROW_NUMBER() OVER (ORDER BY created_at ASC) AS rn
     FROM assets 
     WHERE user_id = 'uuid' AND is_public = true AND deleted_at IS NULL
   )
   UPDATE assets 
   SET is_public = false 
   WHERE id IN (
     SELECT id FROM ranked_assets WHERE rn > 5  -- limite Free
   );
   ```

3. **Notificar usuário** (via email ou toast):
   - "Seu limite de assets públicos foi ajustado para X"
   - "Alguns assets foram despublicados automaticamente"

---

## 📊 Queries de Manutenção

### Listar Todos os Admins

```sql
SELECT 
  p.id,
  p.email,
  p.full_name,
  p.created_at,
  COUNT(aa.id) AS total_actions
FROM profiles p
LEFT JOIN admin_actions aa ON p.id = aa.admin_id
WHERE p.is_admin = true
GROUP BY p.id
ORDER BY p.created_at;
```

### Últimas 50 Ações de Admin

```sql
SELECT * FROM get_recent_admin_actions(50);
```

### Usuários Pro sem Entitlements

```sql
SELECT p.id, p.email, s.tier
FROM profiles p
JOIN subscriptions s ON p.id = s.user_id
LEFT JOIN entitlements e ON p.id = e.user_id
WHERE s.tier = 'pro' AND e.user_id IS NULL;
```

### Assets Públicos por Plano

```sql
SELECT 
  COALESCE(s.tier, 'free') AS plano,
  COUNT(a.id) AS total_assets_publicos,
  AVG(COUNT(a.id)) OVER (PARTITION BY COALESCE(s.tier, 'free')) AS media_por_usuario
FROM assets a
JOIN profiles p ON a.user_id = p.id
LEFT JOIN subscriptions s ON p.id = s.user_id
WHERE a.is_public = true AND a.deleted_at IS NULL
GROUP BY COALESCE(s.tier, 'free');
```

### Usuários que Atingiram Limite de Quota

```sql
SELECT 
  p.email,
  e.max_assets AS limite,
  COUNT(a.id) AS assets_publicos
FROM entitlements e
JOIN profiles p ON e.user_id = p.id
LEFT JOIN assets a ON e.user_id = a.user_id 
  AND a.is_public = true 
  AND a.deleted_at IS NULL
GROUP BY p.email, e.max_assets
HAVING COUNT(a.id) >= e.max_assets;
```

---

## 🔒 Hardening de Segurança

### SQL Editor Access Control

**Recomendação**: Restringir acesso ao SQL Editor apenas a IPs confiáveis.

**Configuração** (via Supabase Dashboard):
1. Settings → Database → Network Restrictions
2. Adicionar IPs da equipe de infraestrutura
3. Bloquear acesso público ao SQL Editor

### Service Role Key Rotation

**Frequência**: A cada 6 meses ou após incidente de segurança.

**Procedimento**:
1. Gerar nova Service Role Key:
   - Dashboard → Settings → API → Generate New Service Role Key
2. Atualizar env vars nas Edge Functions:
   - Dashboard → Edge Functions → Configuration → SUPABASE_SERVICE_ROLE_KEY
3. Testar Edge Functions após rotação:
   ```bash
   supabase functions logs publish-asset --tail
   ```
4. Revogar chave antiga após confirmar sucesso

### 2FA para Admins (Futuro)

**Objetivo**: Exigir 2FA para todas as contas com `is_admin = true`.

**Implementação**:
```sql
-- Verificar admins sem 2FA
SELECT p.email 
FROM profiles p
LEFT JOIN auth.users u ON p.id = u.id
WHERE p.is_admin = true 
  AND u.phone IS NULL;  -- Proxy para 2FA não configurado
```

**Policy**:
- Admins têm 30 dias para configurar 2FA após promoção
- Acesso bloqueado após prazo (demote automático)

---

## 📋 Checklist de Manutenção Mensal

- [ ] Revisar lista de admins (remover inativos)
- [ ] Auditar `admin_actions` (últimos 30 dias)
- [ ] Verificar usuários sem entitlements (deve ser 0)
- [ ] Conferir quotas incorretas (query acima)
- [ ] Rotacionar Service Role Key (a cada 6 meses)
- [ ] Backup do banco (incluindo `admin_actions` table)
- [ ] Testar recovery procedure (em ambiente staging)
- [ ] Atualizar documentação se mudanças foram feitas

---

## 🆘 Contatos de Emergência

**Infra Lead**: [Adicionar email/telefone]  
**Database Admin**: [Adicionar email/telefone]  
**Supabase Support**: https://supabase.com/support  
**Escalation**: [Adicionar processo de escalação]

---

## 📚 Referências

- [Security Architecture](./SECURITY.md) - Threat model e camadas de segurança
- [Frontend Security](./FRONTEND_SECURITY.md) - Hook usePublishAsset
- [Migration 007](../supabase/migrations/007_secure_admin_promotion.sql) - Audit log SQL
- [Supabase Auth Docs](https://supabase.com/docs/guides/auth) - 2FA e session management
