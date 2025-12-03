# Backend Architecture - RotnemCode

Versão: 1.0.0  
Data: 03/12/2025  
Stack: Supabase (PostgreSQL + Auth + Storage + Edge Functions)

---

## Índice
- Visão Geral
- Regras de Negócio
- Arquitetura de Dados (Schema SQL + RLS)
- Sistema de Autenticação
- Políticas de Segurança
- API (padrões de uso com Supabase Client)
- Fluxos de Dados
- Storage Strategy
- Performance & Otimização
- Migrações
- Monitoramento e Logs
- Deployment Checklist

---

## Visão Geral

Sistema de gerenciamento de assets (templates, sections, components) com ownership por usuário, biblioteca pública compartilhada e operações CRUD completas.

Arquitetura:

Frontend (React) → Supabase Client → PostgREST → PostgreSQL
- Auth (JWT, OAuth, email/password)
- Storage (avatars, thumbnails)
- RLS (Row Level Security) para isolamento de dados
- Funções/Triggers para busca, contador de likes, soft delete

---

## Regras de Negócio

RN-001: Ownership
- Todo asset pertence ao usuário que criou (user_id)
- CRUD completo apenas para assets próprios

RN-002: Visibilidade
- is_public = true → visível para todos
- is_public = false → visível apenas para o dono

RN-003: Favoritos
- Tabela favorites (user_id + asset_id)
- Lista privada por usuário

RN-004: Likes (público)
- Tabela asset_likes, contador desnormalizado (likes_count)
- Triggers para sincronização

RN-005: Fork
- Criar asset novo a partir de público (forked_from)
- Incrementa forks_count no original

RN-006: Validação de código
- Template (JSON válido com chaves mínimas)
- CSS (blocos de regras)
- JS (sem eval/Function/document.write)
- HTML (sem <script> inline)

RN-007: Soft delete
- Campo deleted_at
- Hard delete por job agendado

RN-008: Quotas (free vs pro)
- Limites por usuário (assets totais, tamanho de código, uploads/dia)

---

## Arquitetura de Dados (Schema)

Extensões:
- uuid-ossp, pg_trgm, unaccent

Enums:
- asset_type: 'Template' | 'Section' | 'CSS' | 'JS' | 'HTML'
- component_category: 'codes' | 'buttons' | 'forms' | 'animations' | 'advanced-animations' | 'carousels' | 'hovers' | 'customizations' | 'compositions' | 'tools' | 'hero' | 'footer' | 'pricing' | 'faq'
- user_plan: 'free' | 'pro' | 'enterprise'

Tabelas:
- profiles: id (auth.users), username, plan, is_admin, avatar_url, timestamps
- assets: id, user_id, username, title, description, code, type, category, tags[], is_public, is_featured, thumbnail_url, views_count, likes_count, forks_count, forked_from, deleted_at, created_at, updated_at, search_vector
- favorites: (user_id, asset_id)
- asset_likes: (user_id, asset_id)
- asset_forks: id, original_asset_id, forked_asset_id, user_id
- asset_views: id, asset_id, user_id (nullable), ip_hash, user_agent, created_at

Índices principais:
- Por user_id, created_at, is_public, type, category
- GIN em tags e search_vector

Funções (PL/pgSQL):
- update_updated_at
- update_assets_search_vector (title/description/tags com pesos A/B/C)
- sync_likes_count (INSERT/DELETE em asset_likes)
- check_user_quota
- soft_delete_asset

RLS Policies:
- assets: SELECT públicos ou próprios; INSERT/UPDATE/DELETE apenas próprios
- favorites/asset_likes: manage only own rows
- profiles: SELECT público, UPDATE próprio

Views materializadas:
- featured_assets (curadoria)
- trending_assets (últimos 7 dias + score)

Storage buckets:
- avatars: público leitura, upload/update próprio
- thumbnails: público leitura, upload/update próprio

---

## Sistema de Autenticação

Providers: email/password, Google, GitHub, Magic Link.
Trigger de criação de profile ao inserir em auth.users.
JWT com claims de user e user_metadata.

---

## Políticas de Segurança (RLS)

Princípios: Default deny, Least privilege, User isolation, Public read para assets públicos.
Policies detalhadas para SELECT/INSERT/UPDATE/DELETE em assets e relacionamento.

Testes de segurança sugeridos: verificar não-leitura de privados, impossibilidade de editar/deletar de terceiros, leitura de próprios.

---

## API (Supabase Client)

Exemplos:
- Buscar públicos (com join de profile)
- Buscar do usuário
- Criar asset
- Atualizar asset
- Soft delete
- Busca full-text via RPC
- Favoritar/desfavoritar
- Like/unlike (triggers para contador)
- Upload de thumbnail (Storage + public URL)

---

## Fluxos de Dados

Diagramas (texto):
- Criar asset (validar → insert → triggers → retorno)
- Buscar assets com cache (React Query)
- Upload com thumbnail
- Fork asset (Edge Function + transação)

---

## Storage Strategy

Estrutura:
- avatars/{user_id}/avatar.ext
- thumbnails/{user_id}/{asset_id}.ext

Limites:
- avatars: 2MB por arquivo
- thumbnails: 5MB por arquivo

CDN e cache: cache-control longo com versionamento via query string.

---

## Performance & Otimização

- Índices estratégicos (com WHERE deleted_at IS NULL)
- Paginação baseada em cursor (created_at) ao invés de offset
- React Query com staleTime e cacheTime
- Realtime opcional para novos públicos
- Refresh de views materializadas agendado

---

## Migrações

Estrutura: supabase/migrations com arquivos numerados (schema, rls, funções, triggers, views, storage policies, seed).

Rollback: remover policies/tabelas com cuidado (CASCADE onde aplicável).

---

## Monitoramento e Logs

Métricas:
- Performance de queries, cache hit, conexões
- Uso: uploads/dia, ativos, por tipo
- Erros: auth, RLS, validação

Audit logs (opcional): tabela para ações sensíveis com trigger em deletes.

---

## Deployment Checklist

Pré-produção:
- Migrations e policies aplicadas
- Índices e views criados
- Buckets configurados
- Providers de auth ativos
- Variáveis de ambiente

Produção:
- Backups automáticos
- Monitoramento
- Rate limiting
- HTTPS e CORS
- Logs de auditoria

Pós-deploy:
- Smoke tests
- Baseline de performance
- Documentação atualizada

---

Recursos:
- Supabase: https://app.supabase.com
- Docs: https://supabase.com/docs
- Status: https://status.supabase.com
- Discord: https://discord.supabase.com
