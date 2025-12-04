# Frontend Security - Publish Assets

## ⚠️ **IMPORTANTE: NÃO usar UPDATE direto**

**NUNCA** atualize `is_public` diretamente via client:

```typescript
// ❌ INSEGURO - Pode ser bypassado via DevTools
await supabase
  .from('assets')
  .update({ is_public: true })
  .eq('id', assetId);
```

**Por quê?**
- Qualquer usuário pode abrir DevTools e executar esse código
- Bypassa validações de `entitlements.can_publish`
- Bypassa quotas de assets públicos (`max_assets`)
- Permite que Free users publiquem ilimitadamente

---

## ✅ **Forma SEGURA: usar Edge Function**

### 1️⃣ Importar o hook `usePublishAsset`

```typescript
import { usePublishAsset } from '@/hooks/usePublishAsset';

function MyAssetComponent({ assetId }: { assetId: string }) {
  const { publishAsset, isPublishing } = usePublishAsset();

  const handlePublish = async () => {
    const success = await publishAsset(assetId, true);
    if (success) {
      // Atualizar UI, refetch assets, etc.
    }
  };

  return (
    <button onClick={handlePublish} disabled={isPublishing}>
      {isPublishing ? 'Publicando...' : 'Publicar Asset'}
    </button>
  );
}
```

### 2️⃣ Despublicar asset

```typescript
const handleUnpublish = async () => {
  const success = await publishAsset(assetId, false);
  if (success) {
    // Asset despublicado com sucesso
  }
};
```

---

## 🔒 Validações Automáticas

A Edge Function `publish-asset` **valida automaticamente**:

### ✅ 1. Autenticação
- Verifica JWT no header `Authorization`
- Retorna `401 Unauthorized` se token inválido

### ✅ 2. Ownership
- Verifica se `asset.user_id === user.id`
- Admins podem publicar qualquer asset (curadoria)

### ✅ 3. Entitlements (apenas não-admins)
```sql
SELECT can_publish FROM entitlements WHERE user_id = ?
```
- `can_publish = false` → retorna `403 CANNOT_PUBLISH`
- Mensagem: _"Você precisa do plano Pro para publicar assets"_

### ✅ 4. Quotas (apenas não-admins)
```sql
SELECT COUNT(*) FROM assets 
WHERE user_id = ? AND is_public = true AND deleted_at IS NULL
```
- Se `count >= max_assets` → retorna `403 QUOTA_EXCEEDED`
- Mensagem: _"Você atingiu o limite de 50 assets públicos"_

### ✅ 5. Admin Bypass
- Usuários com `is_admin = true` pulam validações 3 e 4
- Útil para moderação e curadoria

---

## 🚨 Tratamento de Erros

O hook `usePublishAsset` já trata todos os erros automaticamente:

| Erro | Toast Exibido | Ação Sugerida |
|------|---------------|---------------|
| `CANNOT_PUBLISH` | "Você precisa do plano Pro" | Botão "Upgrade" para `/pricing` |
| `QUOTA_EXCEEDED` | "Limite de 50 assets atingido" | "Delete alguns para liberar espaço" |
| `ENTITLEMENT_MISSING` | "Entitlements não configurados" | "Entre em contato com suporte" |
| `401 Unauthorized` | "Erro ao publicar asset" | Login novamente |
| `404 Not Found` | "Erro ao publicar asset" | Asset não existe |

### Customizar Tratamento de Erros

Se quiser tratamento personalizado:

```typescript
const { publishAsset, isPublishing } = usePublishAsset();

const handlePublish = async () => {
  const success = await publishAsset(assetId, true);
  
  if (!success) {
    // Seu tratamento customizado aqui
    console.log('Falhou ao publicar');
  }
};
```

---

## 🛠️ Migrando Código Antigo

### Antes (inseguro):

```typescript
const togglePublic = async () => {
  const { error } = await supabase
    .from('assets')
    .update({ is_public: !asset.is_public })
    .eq('id', asset.id);

  if (error) {
    toast.error('Erro ao atualizar');
  } else {
    toast.success('Atualizado!');
  }
};
```

### Depois (seguro):

```typescript
import { usePublishAsset } from '@/hooks/usePublishAsset';

const { publishAsset, isPublishing } = usePublishAsset();

const togglePublic = async () => {
  await publishAsset(asset.id, !asset.is_public);
  // Toast e validações são tratados automaticamente
};
```

---

## 📊 Monitoramento

### Ver logs da Edge Function

```bash
# Logs em tempo real
supabase functions logs publish-asset --tail

# Filtrar apenas erros
supabase functions logs publish-asset | grep "error"
```

### Métricas importantes

- Taxa de `403 CANNOT_PUBLISH` → usuários tentando publicar sem Pro
- Taxa de `403 QUOTA_EXCEEDED` → usuários atingindo limites
- Taxa de `401 Unauthorized` → problemas com sessão/JWT

---

## 🔐 Threat Model

| Ataque | Como é Mitigado |
|--------|-----------------|
| **Bypass via DevTools** | Edge Function obrigatória, RLS policies bloqueiam UPDATE direto |
| **JWT tampering** | Supabase valida signature do token |
| **Privilege escalation** | Edge Function verifica ownership + `is_admin` flag |
| **Quota bypass** | Contagem via `SERVICE_ROLE_KEY` (não pode ser manipulada) |
| **Race condition** | Atomic UPDATE com `WHERE` clause e transação |

---

## 📝 Checklist de Migração

- [ ] Remover todos os `.update({ is_public: ... })` diretos
- [ ] Substituir por `usePublishAsset` hook
- [ ] Testar cenários: Free user, Pro user, Admin
- [ ] Verificar toasts de erro (CANNOT_PUBLISH, QUOTA_EXCEEDED)
- [ ] Implementar botão "Upgrade" no toast de `CANNOT_PUBLISH`
- [ ] Atualizar UI para refletir estado `isPublishing`
- [ ] Commit: "feat: migrar para publish-asset Edge Function"

---

## 🧪 Testes Recomendados

### Cenário 1: Free User
1. Login como Free user
2. Tentar publicar asset
3. **Esperado**: Toast "Você precisa do plano Pro"

### Cenário 2: Pro User
1. Login como Pro user
2. Publicar até `max_assets` (ex: 50)
3. Tentar publicar 51º asset
4. **Esperado**: Toast "Limite de 50 assets atingido"

### Cenário 3: Admin
1. Login como Admin
2. Publicar asset de outro usuário
3. **Esperado**: Sucesso (bypass de ownership)

### Cenário 4: Despublicar
1. Despublicar asset público
2. **Esperado**: Sucesso sem validações de entitlements
3. **Resultado**: Libera 1 slot na quota

---

## 📚 Referências

- [Edge Function: publish-asset README](../supabase/functions/publish-asset/README.md)
- [Migration 007: Admin Promotion Security](../supabase/migrations/007_secure_admin_promotion.sql)
- [Backend Architecture](./BACKEND_ARCHITECTURE.md)
- [Subscriptions & Entitlements](./SUBSCRIPTIONS.md)
