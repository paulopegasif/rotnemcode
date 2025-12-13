# 🧪 Resultados de Testes de Segurança

**Data:** 13/12/2025  
**Escopo:** Testes descritos em `docs/TESTING_GUIDE.md` (Edge Function `publish-asset`, RLS, triggers, frontend hook).

## Estado Atual
- ❗ Não executado: falta acesso ao ambiente Supabase (credenciais/JWT de teste). 
- Pré-requisitos pendentes: provisionar contas `free@test.com`, `pro@test.com`, `admin@test.com` e entitlements correspondentes.

## Checklist de Testes (planejado)
- [ ] Teste 1: Free user → publicar asset → 403 `CANNOT_PUBLISH`
- [ ] Teste 2: Pro user com 50/50 → publicar 51º → 403 `QUOTA_EXCEEDED`
- [ ] Teste 3: Admin publica asset de outro usuário → 200 sucesso
- [ ] Teste 4: Self-promotion via SQL → SQL exception + audit log
- [ ] Teste 5: Despublicar libera quota → volta para 50/50

## Próximos Passos
1) Provisionar ambiente Supabase de teste e credenciais das 3 contas.
2) Executar o checklist acima seguindo `docs/TESTING_GUIDE.md`.
3) Registrar evidências (logs/toasts) e atualizar este arquivo marcando cada teste.
