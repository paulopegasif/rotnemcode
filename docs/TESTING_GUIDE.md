# 🧪 Guia de Testes - Segurança e Publicação de Assets

## 🎯 Objetivos dos Testes

Validar as **4 camadas de segurança** implementadas:
1. ✅ SQL Level (RLS policies + triggers + audit log)
2. ✅ Backend Level (Edge Function `publish-asset`)
3. ✅ Frontend Level (Hook `usePublishAsset`)
4. ✅ UI Level (View "My Assets")

---

## 📋 Pré-requisitos

### 1. Ter 3 Contas de Teste

Execute no Supabase SQL Editor para verificar/criar:

```sql
-- Listar usuários
SELECT p.id, p.email, p.is_admin, e.tier, e.can_publish, e.max_assets
FROM profiles p
LEFT JOIN entitlements e ON p.id = e.user_id
ORDER BY p.created_at DESC;
```

**Você precisa de**:
- ❌ **Free User**: `free@test.com` (can_publish = false, max_assets = 5)
- ❌ **Pro User**: `pro@test.com` (can_publish = true, max_assets = 50)
- ❌ **Admin**: `admin@test.com` (is_admin = true)

### 2. Criar Entitlements para Testes

```sql
-- Free user
INSERT INTO entitlements (user_id, tier, can_publish, max_assets)
SELECT id, 'free', false, 5 FROM profiles WHERE email = 'free@test.com'
ON CONFLICT (user_id) DO UPDATE SET
  tier = 'free', can_publish = false, max_assets = 5;

-- Pro user
INSERT INTO entitlements (user_id, tier, can_publish, max_assets)
SELECT id, 'pro', true, 50 FROM profiles WHERE email = 'pro@test.com'
ON CONFLICT (user_id) DO UPDATE SET
  tier = 'pro', can_publish = true, max_assets = 50;
```

---

## 🧪 Teste 1: Free User Tenta Publicar (403 CANNOT_PUBLISH)

### Objetivo
Validar que usuários Free **não podem** publicar assets públicos.

### Passos

1. **Login** como `free@test.com`
2. Acesse **My Assets** (`/my-assets`)
3. Se não tiver assets, crie um via **Upload**
4. Clique em **"Publicar"** em algum asset privado

### ✅ Resultado Esperado

**Toast exibido**:
```
❌ Você precisa do plano Pro para publicar assets
Faça upgrade para desbloquear publicações ilimitadas
[Botão: Upgrade]
```

**Console (F12)**:
```json
{
  "error": "Forbidden",
  "message": "You need a Pro plan to publish assets publicly.",
  "code": "CANNOT_PUBLISH"
}
```

**Asset permanece privado** (badge "Privado" não muda).

---

## 🧪 Teste 2: Pro User Atinge Quota (403 QUOTA_EXCEEDED)

### Objetivo
Validar que Pro users **não podem** ultrapassar `max_assets` (50).

### Passos

1. **Login** como `pro@test.com`
2. Criar **50 assets** e publicá-los (ou via SQL):
   ```sql
   -- Criar 50 assets públicos para pro@test.com
   INSERT INTO assets (user_id, username, title, description, code, type, is_public)
   SELECT 
     id,
     'pro-test',
     'Asset de Teste ' || generate_series,
     'Descrição teste',
     '{"version": "1.0"}',
     'template',
     true
   FROM profiles, generate_series(1, 50)
   WHERE email = 'pro@test.com';
   ```
3. Tentar publicar **51º asset**

### ✅ Resultado Esperado

**Toast exibido**:
```
❌ Limite de 50 assets públicos atingido
Você tem 50 assets públicos. Delete alguns para liberar espaço.
```

**Console**:
```json
{
  "error": "Quota Exceeded",
  "message": "You've reached your limit of 50 public assets.",
  "code": "QUOTA_EXCEEDED",
  "quota": {
    "current": 50,
    "limit": 50
  }
}
```

---

## 🧪 Teste 3: Admin Publica Asset de Outro Usuário (200 Success)

### Objetivo
Validar que admins podem publicar **qualquer asset** (curadoria).

### Passos

1. **Login** como `admin@test.com`
2. Via SQL, descobrir ID de um asset de `free@test.com`:
   ```sql
   SELECT id, title, user_id, is_public 
   FROM assets 
   WHERE user_id = (SELECT id FROM profiles WHERE email = 'free@test.com')
   LIMIT 1;
   ```
3. Publicar esse asset via **DevTools Console**:
   ```javascript
   const { data, error } = await supabase.functions.invoke('publish-asset', {
     body: { assetId: 'uuid-do-asset', isPublic: true }
   });
   console.log(data, error);
   ```

### ✅ Resultado Esperado

**Toast exibido**:
```
✅ Asset publicado com sucesso!
```

**Console**:
```json
{
  "success": true,
  "assetId": "uuid-do-asset",
  "isPublic": true,
  "message": "Asset published successfully"
}
```

**Asset fica público** mesmo sem ser do admin.

---

## 🧪 Teste 4: Self-Promotion a Admin (SQL Exception)

### Objetivo
Validar que usuários **não podem** promover-se a admin.

### Passos

1. **Login** como `free@test.com`
2. No console do navegador, obter seu user ID:
   ```javascript
   const { data } = await supabase.auth.getUser();
   console.log('User ID:', data.user.id);
   ```
3. No **Supabase SQL Editor**, tentar self-promotion:
   ```sql
   UPDATE profiles 
   SET is_admin = true 
   WHERE id = 'seu-user-id';  -- Substituir pelo ID real
   ```

### ✅ Resultado Esperado

**Erro SQL**:
```
ERROR: Cannot promote yourself to admin
CONTEXT: PL/pgSQL function prevent_self_admin_promotion()
```

**Audit log registra tentativa**:
```sql
SELECT * FROM admin_actions 
ORDER BY created_at DESC LIMIT 1;
-- action: 'PROMOTE_TO_ADMIN' (se logado)
```

---

## 🧪 Teste 5: Despublicar Libera Quota (200 Success)

### Objetivo
Validar que despublicar assets **libera slots** na quota.

### Passos

1. **Login** como `pro@test.com` com 50/50 assets públicos
2. **Despublicar** um asset (botão "Despublicar")
3. Verificar quota:
   ```sql
   SELECT COUNT(*) FROM assets 
   WHERE user_id = (SELECT id FROM profiles WHERE email = 'pro@test.com')
     AND is_public = true 
     AND deleted_at IS NULL;
   -- Deve retornar: 49
   ```
4. Publicar um **novo asset** (deve funcionar)

### ✅ Resultado Esperado

**Toast exibido** (ao despublicar):
```
✅ Asset despublicado com sucesso!
```

**Toast exibido** (ao publicar novo):
```
✅ Asset publicado com sucesso!
```

**Quota final**: 50/50 novamente.

---

## 📊 Verificação Final

Após executar todos os testes, verificar **audit log**:

```sql
SELECT * FROM get_recent_admin_actions(20);
```

Deve conter:
- Tentativas de self-promotion (se testou Teste 4)
- Promoções/demotes de admins (se fez bootstrap)

---

## 🐛 Troubleshooting

### Erro: "Missing Authorization header"
**Causa**: JWT não está sendo enviado  
**Solução**: Verificar se usuário está logado (`supabase.auth.getUser()`)

### Erro: "Entitlements not found"
**Causa**: Registro ausente em `entitlements` table  
**Solução**: Executar INSERTs da seção "Pré-requisitos"

### Asset não atualiza após publicar
**Causa**: UI não refletiu mudança  
**Solução**: Clicar em "Atualizar" ou recarregar página

### Edge Function retorna 500
**Causa**: Env vars não configuradas  
**Solução**: Verificar `SUPABASE_SERVICE_ROLE_KEY` no Dashboard

---

## ✅ Checklist de Validação

Após executar os 5 testes, marcar:

- [ ] Teste 1: Free user recebe CANNOT_PUBLISH
- [ ] Teste 2: Pro user recebe QUOTA_EXCEEDED ao ultrapassar limite
- [ ] Teste 3: Admin consegue publicar assets de outros
- [ ] Teste 4: Self-promotion lança SQL exception
- [ ] Teste 5: Despublicar libera quota

**Status**: Todos os testes passaram? → ✅ Sistema pronto para produção!
```javascript
testSupabaseConnection()
```

Você deve ver mensagens de teste indicando que a conexão está ok.

### 6. Testar login
- Volte para `/login` e faça login com as credenciais que acabou de criar
- Você deve ser redirecionado para home e ver seu email na navbar

## Possíveis Erros e Soluções:

### ❌ Erro 500 durante signup
**Causa**: Trigger não está funcionando corretamente
**Solução**: Verifique se a migration 006 foi aplicada no Supabase

### ❌ Perfil não criado
**Causa**: Trigger não foi disparado
**Solução**: Verifique os logs do Supabase em **Functions** → **Logs**

### ❌ Erro "Email link is invalid"
**Causa**: Email confirmation está habilitado
**Solução**: Desabilite email confirmation em **Authentication** → **Providers** → **Email**

## Próximos Passos (após teste bem-sucedido):

1. Testar CRUD de assets (criar, listar, editar, deletar)
2. Testar RLS policies com usuários diferentes
3. Implementar upload de assets
4. Testar integração com Stripe
