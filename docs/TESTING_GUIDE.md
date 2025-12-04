# 🧪 Instruções para Testar o Registro de Usuário

## O que foi corrigido:

1. ✅ **Trigger automático para criar perfil FREE**
   - Quando um usuário se registra, um perfil é automaticamente criado na tabela `profiles`
   - O plano padrão é `'free'`
   - O flag `is_admin` é `false`

2. ✅ **Melhor tratamento de erros no LoginView**
   - Validação de campos obrigatórios
   - Logs de erro no console para debug
   - Mensagens de erro mais claras

## Passo a Passo para Testar:

### 1. Iniciar o servidor dev
```bash
npm run dev
```
O app estará disponível em `http://localhost:3000` (ou `3001` se 3000 estiver em uso)

### 2. Acessar a página de login
- Clique em "Login" na navbar ou acesse `/login` diretamente

### 3. Criar uma nova conta
- **E-mail**: Use um email novo (ex: `teste@exemplo.com`)
- **Senha**: Use uma senha com pelo menos 6 caracteres
- Clique em "Criar Conta"

### 4. Verificar no Supabase Dashboard
1. Acesse [supabase.com](https://supabase.com) e faça login no seu projeto
2. Vá para **SQL Editor**
3. Execute a query abaixo para verificar o novo usuário:

```sql
SELECT id, username, plan, is_admin, created_at 
FROM public.profiles 
ORDER BY created_at DESC 
LIMIT 1;
```

Você deve ver:
- `plan`: `'free'`
- `is_admin`: `false`
- `created_at`: Timestamp recente

### 5. Testar a conexão do banco
1. Abra o console do navegador (F12 ou Cmd+Option+I)
2. Execute:
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
