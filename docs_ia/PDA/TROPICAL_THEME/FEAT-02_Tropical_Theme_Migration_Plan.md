# Plano de Ação: Migração para Tropical Theme + Layout Mobile First E-commerce (FEAT-02)

## Contexto

Migrar o projeto atual para implementar completamente o tropical theme com foco em mobile first e boas práticas de e-commerce. O tema já está configurado no CSS, mas precisa evolução completa do layout e componentes.

## Situação Atual

- ✅ Tropical theme configurado em `app.css`
- ✅ HTML base com `data-theme="tropical-light"`
- ✅ Componentes básicos: `CartFloating`, `ProductCard`, `InventoryGrid`
- ⚠️ Layout simples em `+layout.svelte` (apenas slot + CartFloating)
- ⚠️ Falta estrutura mobile first
- ⚠️ Falta componentes de e-commerce essenciais

---

## Fase 1: Configuração Base e Estrutura Mobile First

### 1. Evolução do Layout Principal
- **Arquivo:** `app/src/routes/+layout.svelte`
- **Implementação:**
  - Header responsivo com logo, menu hamburger mobile
  - Navigation principal com categorias
  - Footer com informações essenciais
  - Sidebar mobile para filtros
  - Breadcrumbs para navegação

### 2. Componentes Base Mobile First
- **Header Mobile (`HeaderMobile.svelte`):**
  - Logo centralizado
  - Menu hamburger à esquerda
  - Carrinho/search à direita
  - Sticky no topo
  
- **Navigation (`Navigation.svelte`):**
  - Menu categorias horizontal (desktop)
  - Drawer lateral (mobile)
  - Submenu com tropical theme
  
- **Footer (`Footer.svelte`):**
  - Links essenciais
  - Informações de contato
  - Redes sociais
  - Responsive stack

### 3. Sistema de Breakpoints
- **Implementação em `app.css`:**
  - Mobile: 320px-767px
  - Tablet: 768px-1023px
  - Desktop: 1024px+
  - Containers responsivos

---

## Fase 2: Componentes de E-commerce com Tropical Theme

### 1. Componente `ProductCard.svelte` (Upgrade)
- **Função:** Card de produto otimizado para mobile e tropical theme
- **Implementação:**
  - Imagem responsiva com lazy loading
  - Preço destacado com cores tropical
  - Botão "Adicionar ao Carrinho" prominent
  - Badge de desconto/promoção
  - Rating/reviews (se disponível)
  - Hover effects suaves

### 2. Componente `SearchBar.svelte` (Upgrade)
- **Função:** Busca avançada mobile first
- **Implementação:**
  - Input com ícone de busca
  - Filtros expansíveis (mobile)
  - Autocomplete/sugestões
  - Filtros por preço, categoria
  - Clear filters button
  - Responsivo entre modal (mobile) e inline (desktop)

### 3. Componente `FilterSidebar.svelte` (Novo)
- **Função:** Sidebar de filtros para e-commerce
- **Implementação:**
  - Drawer lateral (mobile)
  - Sidebar fixa (desktop)
  - Filtros por categoria, preço, marca
  - Tropical theme accordion
  - Apply/Clear filters buttons

### 4. Componente `CartDrawer.svelte` (Novo)
- **Função:** Drawer do carrinho mobile first
- **Implementação:**
  - Slide-in lateral
  - Lista de produtos no carrinho
  - Quantidade +/- buttons
  - Subtotal destacado
  - Botão "Finalizar Compra" prominent
  - Empty state com tropical imagery

### 5. Componente `Breadcrumbs.svelte` (Novo)
- **Função:** Navegação hierárquica
- **Implementação:**
  - Responsive breadcrumbs
  - Tropical theme styling
  - Current page highlight
  - Mobile optimization

---

## Fase 3: Lógica de Negócio e Integração E-commerce

### 1. Estado Global do Carrinho (Upgrade)
- **Arquivo:** `app/src/lib/cart.svelte.ts`
- **Implementação:**
  - Runes para reatividade
  - Persistência localStorage
  - Funções: add, remove, update quantity
  - Cálculos: subtotal, total, shipping
  - Validações de estoque

### 2. Sistema de Categorias
- **Arquivo:** `app/src/lib/categories.svelte.ts`
- **Implementação:**
  - Estado global de categorias
  - Filtros dinâmicos
  - Navegação por categoria
  - Breadcrumbs integration

### 3. Busca e Filtros (Upgrade)
- **Arquivo:** `app/src/lib/search.svelte.ts`
- **Implementação:**
  - Estado global de busca
  - Filtros avançados
  - Debounced search
  - URL sync para SEO
  - Histórico de busca

### 4. Layout Responsivo Principal
- **Arquivo:** `app/src/routes/+layout.svelte`
- **Implementação:**
  - Container principal responsivo
  - Header com CategoryNav
  - Main content area
  - Footer
  - Modals/drawers management
  - Theme persistence

### 5. Página Principal E-commerce
- **Arquivo:** `app/src/routes/+page.svelte`
- **Implementação:**
  - Hero section (mobile optimized)
  - Featured products
  - Categories grid
  - Search + filters integration
  - Infinite scroll/pagination
  - Loading states

---

## Considerações Técnicas

### Mobile First Principles
- Design mobile first, progressive enhancement
- Touch-friendly interface (44px min touch targets)
- Performant images (webp, lazy loading)
- Offline considerations

### Tropical Theme Integration
- Consistent color palette usage
- Smooth transitions and animations
- Accessibility (contrast ratios)
- Dark mode preparation

### E-commerce Best Practices
- Clear product hierarchy
- Prominent call-to-actions
- Trust indicators
- Fast checkout flow
- Search & filter optimization

### Performance
- Code splitting por rota
- Lazy loading components
- Optimized images
- Minimal bundle size

---

## Deliverables

### Fase 1
- [ ] Layout base responsivo
- [ ] Header/Footer mobile first
- [ ] Navigation system
- [ ] Breakpoints system

### Fase 2
- [ ] ProductCard upgrade
- [ ] SearchBar upgrade
- [ ] FilterSidebar novo
- [ ] CartDrawer novo
- [ ] Breadcrumbs novo

### Fase 3
- [ ] Cart state upgrade
- [ ] Categories system
- [ ] Search system upgrade
- [ ] Layout principal final
- [ ] Homepage e-commerce

## Próximos Passos

1. Criar tarefas específicas para cada item
2. Implementar fase por fase
3. Testar responsividade em cada etapa
4. Validar com usuários reais
5. Otimizar performance

---

**Prazo Estimado:** 3-4 sprints
**Prioridade:** Alta
**Impacto:** Fundamental para experiência do usuário 