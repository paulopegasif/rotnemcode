# Publish Asset (Supabase Edge Function)

## Propósito

Valida permissões (`entitlements`) e quotas antes de permitir que usuários publiquem assets como públicos. **Esta Edge Function é crítica para segurança** - previne bypass de validação de `can_publish` via client direto.

## Fluxo de Segurança

```
1. Client envia POST com JWT no Authorization header
   ↓
2. Edge Function valida JWT (autenticação)
   ↓
3. Verifica ownership do asset (ou se é admin)
   ↓
4. Se publicando: valida entitlements.can_publish
   ↓
5. Se publicando: verifica quota de assets públicos
   ↓
6. Atualiza asset via SERVICE_ROLE_KEY (bypass RLS)
   ↓
7. Retorna sucesso ou erro detalhado
```

## Request

**Endpoint**: `POST /functions/v1/publish-asset`

**Headers**:
```
Authorization: Bearer <user-jwt-token>
Content-Type: application/json
```

**Body**:
```json
{
  "assetId": "uuid-do-asset",
  "isPublic": true
}
```

## Response

### ✅ Success (200)
```json
{
  "success": true,
  "assetId": "uuid-do-asset",
  "isPublic": true,
  "message": "Asset published successfully"
}
```

### ❌ Errors

**401 Unauthorized** - Token inválido ou ausente
```json
{
  "error": "Unauthorized",
  "message": "Invalid or expired token"
}
```

**403 Forbidden - Não pode publicar** (Free user)
```json
{
  "error": "Forbidden",
  "message": "You need a Pro plan to publish assets publicly. Upgrade to Pro to unlock this feature.",
  "code": "CANNOT_PUBLISH"
}
```

**403 Forbidden - Quota excedida**
```json
{
  "error": "Quota Exceeded",
  "message": "You've reached your limit of 50 public assets. Delete some assets or upgrade your plan.",
  "code": "QUOTA_EXCEEDED",
  "quota": {
    "current": 50,
    "limit": 50
  }
}
```

**404 Not Found** - Asset não existe
```json
{
  "error": "Not Found",
  "message": "Asset not found"
}
```

## Uso no Frontend

```typescript
// ❌ INSEGURO - NÃO FAZER ISSO
await supabase
  .from('assets')
  .update({ is_public: true })
  .eq('id', assetId);

// ✅ SEGURO - SEMPRE USAR EDGE FUNCTION
const { data, error } = await supabase.functions.invoke('publish-asset', {
  body: { assetId, isPublic: true }
});

if (error) {
  if (error.context?.code === 'CANNOT_PUBLISH') {
    // Mostrar modal de upgrade para Pro
    showUpgradeModal();
  } else if (error.context?.code === 'QUOTA_EXCEEDED') {
    // Mostrar mensagem de quota excedida
    const { current, limit } = error.context.quota;
    showQuotaExceededMessage(current, limit);
  }
}
```

## Deploy

```bash
# Deploy da função
supabase functions deploy publish-asset

# Verificar logs
supabase functions logs publish-asset --tail
```

## Variáveis de Ambiente (Auto-configuradas)

- `SUPABASE_URL` - URL do projeto Supabase
- `SUPABASE_ANON_KEY` - Anon key para validar JWT
- `SUPABASE_SERVICE_ROLE_KEY` - Service role para bypass RLS

## Validações Implementadas

### 1. Autenticação
- ✅ Verifica JWT no header Authorization
- ✅ Extrai user.id do token
- ✅ Retorna 401 se token inválido

### 2. Autorização
- ✅ Verifica ownership do asset
- ✅ Admin bypass (pode publicar qualquer asset)
- ✅ Retorna 403 se não é dono do asset

### 3. Entitlements (apenas para não-admins)
- ✅ Busca `entitlements.can_publish` do usuário
- ✅ Retorna 403 se `can_publish = false`
- ✅ Mensagem clara para upgrade Pro

### 4. Quotas (apenas para não-admins)
- ✅ Conta assets públicos do usuário
- ✅ Compara com `entitlements.max_assets`
- ✅ Retorna 403 com detalhes da quota

### 5. Update Seguro
- ✅ Usa SERVICE_ROLE_KEY para garantir sucesso
- ✅ Double-check de ownership na query
- ✅ Atualiza `updated_at` automaticamente

## Comportamentos Especiais

### Admin Users
- **Skip validações de entitlements e quotas**
- Pode publicar qualquer asset (mesmo de outros usuários)
- Útil para curadoria e moderação

### Unpublish (isPublic = false)
- **Não requer validações de entitlements**
- Qualquer usuário pode despublicar seus próprios assets
- Libera espaço na quota

## Segurança

### Threat Model

| Ataque | Mitigação |
|--------|-----------|
| Bypass via client direto | Edge Function obrigatória |
| JWT tampering | Supabase valida signature |
| Privilege escalation | Double-check ownership + admin flag |
| Quota bypass | Contagem via SERVICE_ROLE (não pode ser manipulada) |
| Race condition | Atomic UPDATE com WHERE clause |

### Logs e Auditoria

Todos os requests são logados automaticamente pelo Supabase:
```bash
# Ver logs em tempo real
supabase functions logs publish-asset --tail

# Filtrar erros
supabase functions logs publish-asset | grep "error"
```

## Troubleshooting

### Erro: "Entitlements not found"
**Causa**: Usuário não tem registro em `entitlements` table  
**Solução**: Criar entitlement default via trigger ou migration

### Erro: "Service role key not configured"
**Causa**: `SUPABASE_SERVICE_ROLE_KEY` não está nas env vars  
**Solução**: Verificar configuração no Supabase Dashboard → Settings → Edge Functions

### Asset não atualiza
**Causa**: RLS policy bloqueando UPDATE  
**Solução**: Edge Function usa SERVICE_ROLE_KEY que bypassa RLS automaticamente

## Próximos Passos

- [ ] Adicionar rate limiting (100 req/min por usuário)
- [ ] Implementar webhook para notificar sobre novas publicações
- [ ] Dashboard admin para revisar assets publicados
- [ ] Métricas de publicações por plano (analytics)
