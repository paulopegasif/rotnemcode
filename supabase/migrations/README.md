# Supabase Migrations

Este diretório contém as migrações SQL para configurar o schema do banco de dados no Supabase.

## Estrutura

- `001_initial_schema.sql` - Schema inicial (tabelas, índices, triggers)
- `002_rls_policies.sql` - Políticas Row Level Security
- `003_storage_buckets.sql` - Configuração de buckets de Storage

## Como Aplicar

### Via Dashboard do Supabase

1. Acesse https://app.supabase.com
2. Selecione seu projeto
3. Vá em **SQL Editor**
4. Execute cada arquivo na ordem (001, 002, 003)

### Via Supabase CLI (opcional)

Se você instalou a CLI do Supabase:

```bash
# Instalar CLI (se necessário)
npm install -g supabase

# Link com projeto remoto
supabase link --project-ref <seu-project-ref>

# Aplicar migrations
supabase db push
```

### Via MCP Server Supabase (VS Code)

Se você tem o MCP Server Supabase instalado:

1. Copie o conteúdo de cada arquivo SQL
2. Use o comando do MCP para executar migrations
3. Aplique na ordem: 001 → 002 → 003

## Verificação

Após aplicar as migrations, verifique:

```sql
-- Verificar tabelas criadas
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public';

-- Verificar RLS ativado
SELECT tablename, rowsecurity 
FROM pg_tables 
WHERE schemaname = 'public';

-- Verificar buckets de storage
SELECT * FROM storage.buckets;
```

## Rollback

Para reverter (use com cuidado):

```sql
-- Remover buckets
DELETE FROM storage.buckets WHERE id IN ('avatars', 'thumbnails');

-- Remover políticas RLS
DROP POLICY IF EXISTS "..." ON table_name;

-- Remover tabelas (cascade apaga dependências)
DROP TABLE IF EXISTS asset_views CASCADE;
DROP TABLE IF EXISTS asset_forks CASCADE;
DROP TABLE IF EXISTS asset_likes CASCADE;
DROP TABLE IF EXISTS favorites CASCADE;
DROP TABLE IF EXISTS assets CASCADE;
DROP TABLE IF EXISTS profiles CASCADE;

-- Remover enums
DROP TYPE IF EXISTS user_plan;
DROP TYPE IF EXISTS component_category;
DROP TYPE IF EXISTS asset_type;
```

## Próximos Passos

Após aplicar as migrations:

1. Testar autenticação (criar usuário via app)
2. Verificar criação automática de profile
3. Criar alguns assets de teste
4. Validar RLS (tentar acessar assets privados de outro usuário)
5. Testar upload de thumbnails no Storage
