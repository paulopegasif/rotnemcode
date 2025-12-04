# Assinaturas e Publicações

Versão: 1.0.0  
Data: 03/12/2025

## Objetivo
Modelo de assinatura mensal acessível para liberar recursos premium e permitir que usuários publiquem códigos/templates publicamente (curadoria opcional).

## Planos
- free: acesso básico, limites de criação, sem publicação pública
- pro: assinatura mensal barata, publicação pública habilitada, limites ampliados
- administrador: gestão de conteúdo e curadoria (acesso total), define `is_featured`, moderação
  
Observação: o papel de administrador é controlado via `profiles.is_admin=true` e possui override nas políticas RLS.

## Entitlements
- can_publish: permite publicar assets como públicos
- max_assets: limite de assets por usuário
- max_code_size_kb: tamanho máximo por asset
- daily_upload_limit: uploads/dia

## Integração de Pagamentos (Stripe)
- Produtos: `pro_monthly` com preço recorrente
- Checkout via Stripe Hosted Checkout
- Webhooks: `checkout.session.completed`, `customer.subscription.updated`, `customer.subscription.deleted`
- Mapear `customer_id` Stripe em `profiles` (coluna `stripe_customer_id`)

## Schema (Supabase)
Tabelas adicionais:
- subscriptions: id, user_id, provider ('stripe'), status ('active','past_due','canceled'), current_period_end, cancel_at_period_end
- entitlements: user_id, can_publish boolean, max_assets int, max_code_size_kb int, daily_upload_limit int, updated_at

RLS:
- subscriptions: SELECT próprio; INSERT/UPDATE via Edge Function (webhook verificado)
- entitlements: SELECT próprio; UPDATE via Edge Function

## Fluxo
1. Usuário escolhe plano pro → abre checkout Stripe
2. Ao concluir: webhook atualiza `subscriptions` e `entitlements`
3. App lê `entitlements` para habilitar UI de publicação e quotas
4. Cancelamento/expiração: webhook atualiza status e desabilita `can_publish`

## Políticas de Publicação
- `can_publish = true` requerido para `assets.is_public = true` (validação no backend)
- Curadoria opcional: `is_featured` só por admins
- RLS continua garantindo ownership e leitura pública apenas quando `is_public=true`

## Edge Functions
- `stripe-webhook`: valida assinatura, atualiza `subscriptions` e `entitlements`
- `publish-asset`: valida `can_publish` + quotas antes de permitir `is_public=true`

## UI/UX
- Banner/cta para assinar
- Página de billing: status da assinatura, próximo vencimento
- Contadores de uso (assets atuais vs limite)

## Métricas
- Conversão para pro
- Churn e reativação
- Publicações/dia e engajamento

## Próximos passos
- Criar migrations para `subscriptions` e `entitlements`
- Implementar Edge Function `stripe-webhook`
- Página de billing e controle de publicação no frontend
