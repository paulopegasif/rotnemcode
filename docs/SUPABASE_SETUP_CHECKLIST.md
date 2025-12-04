# 📋 Checklist: Configuração Supabase para Desenvolvimento

## ⚠️ Importante: Email Confirmation pode estar bloqueando signups

Se você está recebendo erro 500 ao tentar registrar, é possível que email confirmation esteja habilitado.

### Para desabilitar Email Confirmation:

1. Acesse o [Supabase Dashboard](https://supabase.com)
2. Selecione seu projeto
3. Vá para **Authentication** → **Providers**
4. Procure por **Email** e verifique as configurações:
   - [ ] **Confirm email** - Desabilite esta opção
   - [ ] **Double confirm changes** - Desabilite esta opção
5. Clique **Save**

### Configurações Recomendadas para Desenvolvimento:

**Authentication → User Signup Data**
- [ ] Enable email confirmations → ❌ DESABILITAR

**Authentication → Email Templates**
- Pode deixar como padrão

**Authentication → Providers**
- [ ] Email → Desabilitar confirmação
- [ ] Google → Configure se quiser testar OAuth (opcional)
- [ ] GitHub → Configure se quiser testar OAuth (opcional)

### Alternativa: Se quiser manter Email Confirmation

Se preferir manter confirmação de email para produção, configure:

1. Em seu arquivo `.env.local`, adicione:
```env
# Supabase - confirm email redirection
VITE_SUPABASE_REDIRECT_URL=http://localhost:3000/auth/callback
```

2. Crie uma página em `pages/AuthCallback.tsx` para lidar com links de confirmação

3. Atualize o `Router.tsx` para incluir a rota de callback

**Mas para testes iniciais, recomendamos desabilitar confirmação de email.**

### Verificar se o Trigger está Ativo

1. Em **SQL Editor**, execute:
```sql
SELECT trigger_name, trigger_schema, event_manipulation, event_object_table
FROM information_schema.triggers 
WHERE trigger_name = 'on_auth_user_created';
```

Você deve ver um resultado com a trigger `on_auth_user_created` na schema `auth`.

### Teste Rápido

Após desabilitar email confirmation:

1. Acesse http://localhost:3000/login
2. Crie uma conta com email novo
3. Você deve ser redirecionado imediatamente para home
4. Verifique em **SQL Editor** se o perfil foi criado:
```sql
SELECT * FROM public.profiles ORDER BY created_at DESC LIMIT 1;
```
