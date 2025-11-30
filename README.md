# RotnemCode - Elementor Asset Hub

**Uma biblioteca centralizada de componentes Web para designers, desenvolvedores e criadores de conteúdo.**

RotnemCode é um SaaS (Software as a Service) criado para armazenar, organizar e reutilizar:
- Templates completos (especialmente Elementor)
- Seções individuais (Hero, Footer, Pricing etc.)
- Snippets de CSS
- Snippets de JavaScript
- Estruturas HTML
- Futuramente: componentes React

## 🚀 Stack Tecnológica Atual (MVP SPA)

- **React 19** + **TypeScript**
- **Vite 6** (bundler e dev server)
- **Tailwind CSS** via CDN (config inline no `index.html`)
- **lucide-react** (ícones)
- Hooks customizados: `useTheme` (tema dark/light com `localStorage`), `useFavorites` (favoritos persistidos)

## 📁 Estrutura do Projeto

```
/
├── components/
│   ├── Navbar.tsx          # Barra superior com busca e tema
│   ├── Sidebar.tsx         # Menu lateral com navegação (Templates, Sections, Components)
│   ├── AssetCard.tsx       # Card de asset com favoritos e preview
│   └── UploadForm.tsx      # Formulário multi-tab de upload
├── views/
│   ├── Home.tsx            # Dashboard inicial com stats e recentes
│   ├── ComponentsView.tsx  # View de components com filtros de categoria
│   ├── ListView.tsx        # View genérica para listas (Templates, Sections, Favorites)
│   └── Upload.tsx          # Wrapper do UploadForm
├── index.css               # Design tokens (CSS variables HSL) e estilos globais
├── useTheme.ts             # Hook de tema dark/light com localStorage
├── useFavorites.ts         # Hook de favoritos com Set e localStorage
├── App.tsx                 # Componente raiz com navegação e lógica de filtros
├── index.tsx               # Entry point React
├── index.html              # HTML base com Tailwind CDN
├── vite.config.ts          # Configuração Vite com aliases
└── tsconfig.json           # Configuração TypeScript
```

## 🎯 Funcionalidades Implementadas

- ✅ Navegação client-side com 4 abas principais:
  - **Templates**: Páginas completas do Elementor
  - **Sections**: Seções individuais reutilizáveis
  - **Components**: Snippets (CSS/JS/HTML) com filtros por 10 categorias (códigos, botões, formulários, animações, animações avançadas, carrosséis, hovers, personalizações, composições, ferramentas)
  - **Upload Center**: Interface de upload multi-formato
- ✅ Sistema de categorização por badges clicáveis
- ✅ Tema dark/light com persistência em `localStorage`
- ✅ Favoritos locais com toggle (ícone de coração) e persistência em `localStorage`
- ✅ Busca por título em tempo real com filtragem combinada (busca + categoria + favoritos)
- ✅ Cards de assets com preview visual, badges de tipo e ações
- ✅ Arquitetura componentizada e views organizadas
- ✅ Acessibilidade com aria-labels em elementos interativos

## 🛠️ Executar Localmente

**Pré-requisitos:** Node.js 18+

1. Instale as dependências:
   ```bash
   npm install
   ```

2. Inicie o dev server:
   ```bash
   npm run dev
   ```

3. Abra no navegador o endereço exibido (ex: `http://localhost:3000`).

## 📋 Decisões de Arquitetura

### Dependências
- **Vite + node_modules**: Import map CDN removido para consistência; todas as deps via `package.json`.
- **Tailwind CDN**: Mantido no `index.html` para prototipagem rápida; migração para PostCSS planejada na v2.

### Estado e Persistência
- Navegação por `currentView` (useState); sem roteamento real (URLs).
- Tema e favoritos persistidos via `localStorage`.
- Mock data em `RECENT_ASSETS` (sem backend ainda).

### Componentes e Views
- Componentes base (`Button`, `Input`, `Card`, `Badge`) inline inspirados em shadcn/ui.
- Views organizadas: `Home` (dashboard), `ComponentsView` (filtros por categoria), `ListView` (genérica para Templates/Sections/Favorites), `Upload` (formulário).
- `AssetCard` recebe props de favoritos e renderiza ícones dinâmicos por tipo + categoria.
- Filtros combinados: busca global + filtro de categoria (em Components) + filtro de favoritos (em Favorites).

## 🚧 Próximos Passos (Roadmap)

### 🎯 Fase 1: Migração para SaaS (Next.js + Prisma + Auth)
- [ ] Migrar para **Next.js 15** (App Router) com roteamento file-based
- [ ] Adicionar **Prisma** (ORM) + **PostgreSQL** para persistência
- [ ] Configurar **Auth.js** (NextAuth) com OAuth ou credenciais
- [ ] Implementar **Route Handlers** para CRUD de assets, tags, favoritos
- [ ] Upload e parsing de Elementor JSON (validação com `zod`)
- [ ] Integração com **shadcn/ui** oficial (componentes robustos)
- [ ] Tema com **next-themes** (persistência SSR-safe)

### 🎯 Fase 2: Funcionalidades Avançadas
- [ ] Busca full-text com **pg_trgm** ou **Meilisearch**
- [ ] Tags e categorias dinâmicas
- [ ] Versionamento de assets
- [ ] Preview de código (syntax highlighting com Prism/Monaco)
- [ ] Copy-to-clipboard com feedback
- [ ] Compartilhamento de assets (links públicos)
- [ ] Roles e permissões (ADMIN/USER)

### 🎯 Fase 3: Escala e Deploy
- [ ] CI/CD com Vercel + Railway/Fly.io (DB)
- [ ] Storage para uploads (S3/R2)
- [ ] Observabilidade (logs, métricas, Sentry)
- [ ] Rate-limiting e segurança (CSP, sanitização)
- [ ] Testes unitários e E2E (Vitest, Playwright)

## 📝 Limitações Conhecidas (MVP Atual)

- **Sem backend**: Dados mockados; upload não persiste.
- **Sem roteamento**: URLs não refletem a view atual.
- **Sem autenticação**: Acesso aberto; sem contas.
- **Tailwind via CDN**: Sem JIT ou purge; bundle maior em produção.
- **Busca simples**: Filtro local por título; sem indexação.
- **Favoritos locais**: Apenas no browser atual; sem sync cross-device.

## 🤝 Contribuindo

Contribuições são bem-vindas! Para mudanças grandes, abra uma issue primeiro para discutir a proposta.

## 📄 Licença

MIT
