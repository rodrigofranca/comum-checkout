# FEAT-02: Migração para Tropical Theme + Layout Mobile First E-commerce - TODOs

## Fase 1: Configuração Base e Estrutura Mobile First

### TODOs: 1.1 Evolução do Layout Principal

- [ ] **Ação 1:** Criar estrutura base do layout em `app/src/routes/+layout.svelte`
- [ ] **Ação 2:** Implementar container principal responsivo com tropical theme
- [ ] **Ação 3:** Adicionar sistema de slots para header, main, footer
- [ ] **Ação 4:** Integrar gerenciamento de drawers/modals mobile
- [ ] **Ação 5:** Implementar persistência de tema com localStorage

### TODOs: 1.2 Componentes Base Mobile First

- [ ] **Ação 1:** Criar `HeaderMobile.svelte` em `app/src/lib/components/layout/`
- [ ] **Ação 2:** Implementar logo centralizado e menu hamburger
- [ ] **Ação 3:** Adicionar ícones de search e carrinho à direita
- [ ] **Ação 4:** Implementar header sticky com tropical theme
- [ ] **Ação 5:** Criar `Navigation.svelte` com menu responsivo
- [ ] **Ação 6:** Implementar drawer lateral para mobile
- [ ] **Ação 7:** Criar menu horizontal para desktop
- [ ] **Ação 8:** Criar `Footer.svelte` com layout responsivo
- [ ] **Ação 9:** Adicionar links essenciais e informações de contato
- [ ] **Ação 10:** Implementar stack responsivo para mobile

### TODOs: 1.3 Sistema de Breakpoints

- [ ] **Ação 1:** Definir breakpoints customizados em `app/src/app.css`
- [ ] **Ação 2:** Criar utilities classes para containers responsivos
- [ ] **Ação 3:** Implementar sistema de grid tropical theme
- [ ] **Ação 4:** Adicionar variáveis CSS para espaçamentos mobile first

---

## Fase 2: Componentes de E-commerce com Tropical Theme

### TODOs: 2.1 Upgrade do ProductCard.svelte

- [ ] **Ação 1:** Refatorar `app/src/lib/components/ProductCard.svelte`
- [ ] **Ação 2:** Implementar imagem responsiva com lazy loading
- [ ] **Ação 3:** Adicionar preço destacado com cores tropical (primary/secondary)
- [ ] **Ação 4:** Criar botão "Adicionar ao Carrinho" prominent
- [ ] **Ação 5:** Implementar badge de desconto/promoção
- [ ] **Ação 6:** Adicionar hover effects suaves com tropical theme
- [ ] **Ação 7:** Otimizar para touch targets (44px mínimo)

### TODOs: 2.2 Upgrade do SearchBar.svelte

- [ ] **Ação 1:** Refatorar `app/src/lib/components/forms/SearchBar.svelte`
- [ ] **Ação 2:** Implementar input com ícone de busca tropical
- [ ] **Ação 3:** Criar filtros expansíveis para mobile
- [ ] **Ação 4:** Adicionar autocomplete/sugestões
- [ ] **Ação 5:** Implementar filtros por preço com range slider
- [ ] **Ação 6:** Criar botão "Clear filters" com tropical styling
- [ ] **Ação 7:** Implementar modal de filtros para mobile

### TODOs: 2.3 Criar FilterSidebar.svelte

- [ ] **Ação 1:** Criar `app/src/lib/components/FilterSidebar.svelte`
- [ ] **Ação 2:** Implementar drawer lateral para mobile
- [ ] **Ação 3:** Criar sidebar fixa para desktop
- [ ] **Ação 4:** Implementar filtros por categoria com tropical accordion
- [ ] **Ação 5:** Adicionar filtros por preço, marca, avaliação
- [ ] **Ação 6:** Criar botões "Apply" e "Clear" com tropical theme
- [ ] **Ação 7:** Implementar animações suaves de abertura/fechamento

### TODOs: 2.4 Criar CartDrawer.svelte

- [ ] **Ação 1:** Criar `app/src/lib/components/CartDrawer.svelte`
- [ ] **Ação 2:** Implementar slide-in lateral com tropical theme
- [ ] **Ação 3:** Criar lista de produtos no carrinho
- [ ] **Ação 4:** Implementar botões +/- para quantidade
- [ ] **Ação 5:** Adicionar subtotal destacado com primary color
- [ ] **Ação 6:** Criar botão "Finalizar Compra" prominent
- [ ] **Ação 7:** Implementar empty state com tropical imagery
- [ ] **Ação 8:** Adicionar animações de adição/remoção

### TODOs: 2.5 Criar Breadcrumbs.svelte

- [ ] **Ação 1:** Criar `app/src/lib/components/Breadcrumbs.svelte`
- [ ] **Ação 2:** Implementar navegação hierárquica responsiva
- [ ] **Ação 3:** Aplicar tropical theme styling
- [ ] **Ação 4:** Destacar página atual com accent color
- [ ] **Ação 5:** Otimizar para mobile com collapse/ellipsis
- [ ] **Ação 6:** Integrar com sistema de rotas do SvelteKit

---

## Fase 3: Lógica de Negócio e Integração E-commerce

### TODOs: 3.1 Upgrade do Estado Global do Carrinho

- [ ] **Ação 1:** Refatorar `app/src/lib/cart.svelte.ts` para usar runes
- [ ] **Ação 2:** Implementar persistência com localStorage
- [ ] **Ação 3:** Adicionar funções: add, remove, updateQuantity
- [ ] **Ação 4:** Implementar cálculos: subtotal, total, shipping
- [ ] **Ação 5:** Adicionar validações de estoque
- [ ] **Ação 6:** Criar notificações de sucesso/erro
- [ ] **Ação 7:** Implementar sync entre CartFloating e CartDrawer

### TODOs: 3.2 Sistema de Categorias

- [ ] **Ação 1:** Criar `app/src/lib/categories.svelte.ts`
- [ ] **Ação 2:** Implementar estado global de categorias
- [ ] **Ação 3:** Criar filtros dinâmicos por categoria
- [ ] **Ação 4:** Implementar navegação por categoria
- [ ] **Ação 5:** Integrar com breadcrumbs
- [ ] **Ação 6:** Adicionar busca dentro de categoria

### TODOs: 3.3 Upgrade do Sistema de Busca e Filtros

- [ ] **Ação 1:** Criar `app/src/lib/search.svelte.ts`
- [ ] **Ação 2:** Implementar estado global de busca
- [ ] **Ação 3:** Adicionar filtros avançados (preço, categoria, marca)
- [ ] **Ação 4:** Implementar debounced search
- [ ] **Ação 5:** Criar sync com URL para SEO
- [ ] **Ação 6:** Implementar histórico de busca
- [ ] **Ação 7:** Adicionar sugestões de busca

### TODOs: 3.4 Layout Responsivo Principal

- [ ] **Ação 1:** Finalizar `app/src/routes/+layout.svelte`
- [ ] **Ação 2:** Integrar HeaderMobile com Navigation
- [ ] **Ação 3:** Implementar main content area responsiva
- [ ] **Ação 4:** Adicionar Footer com tropical theme
- [ ] **Ação 5:** Implementar gerenciamento de modals/drawers
- [ ] **Ação 6:** Criar sistema de notificações toast
- [ ] **Ação 7:** Implementar loading states globais

### TODOs: 3.5 Página Principal E-commerce

- [ ] **Ação 1:** Refatorar `app/src/routes/+page.svelte`
- [ ] **Ação 2:** Criar hero section mobile optimized
- [ ] **Ação 3:** Implementar seção de produtos em destaque
- [ ] **Ação 4:** Criar grid de categorias responsivo
- [ ] **Ação 5:** Integrar SearchBar com filtros
- [ ] **Ação 6:** Implementar infinite scroll ou paginação
- [ ] **Ação 7:** Adicionar loading states e skeleton screens
- [ ] **Ação 8:** Implementar empty states com tropical imagery

---

## Checklist Final

### Validações Obrigatórias

- [ ] **Responsividade:** Testar em mobile (320px), tablet (768px), desktop (1024px+)
- [ ] **Acessibilidade:** Verificar contraste, navegação por teclado, screen readers
- [ ] **Performance:** Lazy loading, code splitting, otimização de imagens
- [ ] **Tropical Theme:** Consistência de cores, animações, typography
- [ ] **E-commerce UX:** Fluxo de compra, trust indicators, call-to-actions
- [ ] **SEO:** URLs amigáveis, meta tags, structured data

### Testes

- [ ] **Testes unitários:** Componentes críticos
- [ ] **Testes de integração:** Fluxo de compra
- [ ] **Testes de responsividade:** Breakpoints
- [ ] **Testes de acessibilidade:** WCAG compliance
- [ ] **Testes de performance:** Core Web Vitals

### Documentação

- [ ] **Atualizar documentação:** Componentes e APIs
- [ ] **Criar guia de estilo:** Tropical theme usage
- [ ] **Documentar padrões:** Mobile first practices
- [ ] **Criar changelog:** Features implementadas

---

**Status:** 🟡 Planejado | **Prazo:** 3-4 sprints | **Prioridade:** Alta 