# Stripe Webhook (Supabase Edge Function)

Esta função processa eventos de assinatura do Stripe e atualiza as tabelas `subscriptions` e `entitlements` no Supabase. Use-a para habilitar o modelo de assinatura mensal e controlar permissões de publicação.

## Requisitos
- Projeto Supabase ativo
- Tabelas e RLS aplicadas (migrations 001–005 + 004 billing)
- Conta Stripe com produto/price de assinatura (ex.: `pro_monthly`)

## Variáveis de Ambiente (Supabase)
Defina esses secrets no projeto Supabase (Settings → Functions → Secrets):
- `STRIPE_API_KEY`: chave secreta da API Stripe (ex.: `sk_live_...` ou `sk_test_...`)
- `STRIPE_WEBHOOK_SECRET`: secret do webhook gerado pelo Stripe para validação de assinatura
- `SUPABASE_URL`: URL do projeto Supabase (ex.: `https://<PROJECT_REF>.supabase.co`)
- `SUPABASE_SERVICE_ROLE_KEY`: chave Service Role do Supabase (permite upserts com RLS bypass via Edge Functions)

## Deploy
```bash
# Instale a CLI do Supabase se necessário
npm i -g supabase

# Faça login e selecione seu projeto
supabase login
supabase link --project-ref <PROJECT_REF>

# Deploy da função
supabase functions deploy stripe-webhook
```

## Endereço do Webhook
Ao publicar, a função ficará disponível em:
```
https://<PROJECT_REF>.functions.supabase.co/stripe-webhook
```

## Configuração no Stripe
1. Acesse o Dashboard do Stripe → Developers → Webhooks
2. Crie um endpoint apontando para a URL acima
3. Selecione eventos:
   - `customer.subscription.created`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
   (opcional: `checkout.session.completed` para mapeamentos adicionais)
4. Copie o **Signing secret** e configure em `STRIPE_WEBHOOK_SECRET`

## Mapeamento de Usuários
A função supõe que o `profiles.stripe_customer_id` já está vinculado ao usuário. Mapeamento sugerido:
- Durante o checkout/criação de cliente no Stripe, salve `customer.id` em `profiles.stripe_customer_id` (via backend/Edge Function).
- Alternativamente, usar `metadata` no Checkout (ex.: `user_id`) e uma função dedicada para vincular.

## Lógica da Função
- Valida a assinatura do webhook (`stripe-signature` + `STRIPE_WEBHOOK_SECRET`)
- Extrai `customer`, `status` e `current_period_end` do evento
- Localiza o `user_id` em `profiles` com `stripe_customer_id = customer`
- Upsert em `subscriptions`: status e `current_period_end`
- Upsert em `entitlements` conforme status:
  - `active/trialing`: `can_publish=true`, quotas elevadas
  - outros: `can_publish=false`, quotas padrão

## Testes Locais
```bash
# Rode a função localmente
supabase functions serve stripe-webhook

# Envie um evento de teste (exemplo com stripe CLI)
stripe listen --forward-to http://localhost:54321/functions/v1/stripe-webhook
stripe trigger customer_subscription_created
```

## Segurança
- Use **Service Role Key** apenas em funções server-side
- Verifique que `STRIPE_WEBHOOK_SECRET` está correto para evitar spoofing
- Mantenha RLS ativo nas tabelas e permita upserts somente via Edge Functions

## Troubleshooting
- 400 Invalid signature: verifique `STRIPE_WEBHOOK_SECRET`
- 500 Processing failed: confirme se `profiles.stripe_customer_id` está preenchido
- Erros de deploy: assegure `import_map.json` com `stripe` mapeado para `npm:stripe@14.3.0`

## Próximos Passos
- Criar função de mapeamento `attach-stripe-customer` para salvar `stripe_customer_id` no `profiles`
- Página de Billing no frontend (status, próximo vencimento)
- Botão de publicação condicionado à `entitlements.can_publish`
