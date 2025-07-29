# Plano de Ação: Tropical Theme POC - Checkout Comum (FEAT-02-POC)

## Contexto

Implementar o tropical theme especificamente para a POC do Checkout Comum, priorizando apenas as funcionalidades essenciais descritas no PRD. Foco em mobile first para uso em feiras e eventos.

## Escopo da POC

### Funcionalidades Essenciais (do PRD)
- ✅ **FEAT-01:** Listagem Visual de Inventário
- ✅ **FEAT-01A:** Seleção de Itens da Lista  
- ✅ **FEAT-01B:** Busca e Filtros
- ✅ **FEAT-02:** Gerenciamento do Carrinho
- ✅ **FEAT-03:** Aplicação de Desconto
- ✅ **FEAT-04:** Coleta de Dados do Cliente
- ✅ **FEAT-05:** Seleção de Forma de Pagamento
- ✅ **FEAT-06:** Finalização da Venda
- ✅ **FEAT-07:** Envio de Recibo por E-mail

### Componentes Principais (do PRD)
- `InventoryGrid.svelte` - Grid responsivo dos produtos
- `ProductCard.svelte` - Card individual do produto  
- `SearchBar.svelte` - Busca e filtros
- `CartFloating.svelte` - Botão flutuante do carrinho
- `CheckoutFlow.svelte` - Fluxo de finalização

---

## Fase 1: Layout Base POC com Tropical Theme

### 1. Layout Minimalista para POC
- **Arquivo:** `app/src/routes/+layout.svelte`
- **Implementação:**
  - Header simples com logo e contador do carrinho
  - Main content area para inventory/checkout
  - Sem footer complexo (apenas copyright)
  - Modal/drawer básico para carrinho

### 2. Estrutura Mobile First Essencial
- **Breakpoints básicos:**
  - Mobile: 320px-767px (prioritário)
  - Desktop: 768px+ (secundário)
- **Container responsivo simples**
- **Touch targets mínimos 44px**

---

## Fase 2: Componentes POC com Tropical Theme

### 1. `InventoryGrid.svelte` (Upgrade)
- **Função:** Grid principal para seleção de produtos
- **Tropical Theme:**
  - Cards com `bg-base-100` e sombra suave
  - Hover com `hover:bg-base-200` 
  - Grid responsivo (1 col mobile, 2-3 cols tablet+)

### 2. `ProductCard.svelte` (Upgrade) 
- **Função:** Card otimizado para POC mobile
- **Tropical Theme:**
  - Imagem responsiva com `rounded-box`
  - Preço destacado com `text-primary font-bold`
  - Botão "+" com `btn btn-circle btn-primary btn-sm`
  - Nome do produto com `text-base-content`

### 3. `SearchBar.svelte` (Upgrade)
- **Função:** Busca simples para POC
- **Tropical Theme:**
  - Input com `input input-bordered` 
  - Ícone de busca com `text-primary`
  - Filtro de preço básico com `range range-primary`
  - Botão clear com `btn btn-ghost btn-sm`

### 4. `CartFloating.svelte` (Já existe - Upgrade)
- **Função:** Acesso rápido ao carrinho
- **Tropical Theme:** 
  - Badge com `badge badge-secondary`
  - Botão principal com `btn btn-primary btn-circle btn-lg`
  - Posição `fixed bottom-4 right-4`

### 5. `CheckoutFlow.svelte` (Novo)
- **Função:** Modal/drawer de checkout para POC
- **Tropical Theme:**
  - Modal com `modal modal-open`
  - Background `bg-base-100`
  - Steps com cores tropical
  - Botões de ação com `btn btn-primary` e `btn btn-secondary`

---

## Fase 3: Fluxo de Checkout POC

### 1. Estado do Carrinho (Upgrade Básico)
- **Arquivo:** `app/src/lib/cart.svelte.ts`
- **Implementação POC:**
  - Add/remove items
  - Cálculo de subtotal
  - Aplicação de desconto simples
  - Persistência localStorage básica

### 2. Checkout Flow (Novo)
- **Componentes:**
  - Lista de itens do carrinho
  - Campo de desconto
  - Formulário cliente (nome/email)
  - Seleção forma de pagamento
  - Botão finalizar

### 3. Layout Principal POC
- **Arquivo:** `app/src/routes/+layout.svelte`
- **Implementação:**
  - Header tropical simples
  - Container principal
  - CartFloating integration
  - Toast notifications básicas

### 4. Homepage POC
- **Arquivo:** `app/src/routes/+page.svelte`  
- **Implementação:**
  - SearchBar no topo
  - InventoryGrid principal
  - Loading states simples
  - Empty state básico

---

## Especificações Técnicas POC

### Tropical Theme Aplicado
```css
/* Componentes POC com tropical theme */
.inventory-grid {
  @apply grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4;
}

.product-card {
  @apply card bg-base-100 shadow-md hover:shadow-lg transition-shadow;
}

.product-card .card-body {
  @apply p-4;
}

.product-price {
  @apply text-2xl font-bold text-primary;
}

.add-to-cart-btn {
  @apply btn btn-primary btn-sm btn-circle;
}

.checkout-modal {
  @apply modal modal-open;
}

.checkout-content {
  @apply modal-box bg-base-100 max-w-md;
}
```

### Estrutura de Dados POC
```typescript
// Produto para POC
interface ProductPOC {
  id: string;
  codigo: string;
  nome: string;
  preco: number;
  status: 'disponivel' | 'vendido';
  foto_url?: string;
}

// Carrinho POC
interface CartPOC {
  items: ProductPOC[];
  subtotal: number;
  desconto: number;
  total: number;
}

// Cliente POC
interface ClientePOC {
  nome?: string;
  email?: string;
}
```

---

## Critérios de Sucesso POC

### Métricas do PRD
- ✅ Tempo de checkout < 90 segundos
- ✅ Interface intuitiva sem treinamento
- ✅ 99% uptime durante feira
- ✅ 30% captura de email

### Validações Tropical Theme
- ✅ Cores consistentes (primary, secondary, accent)
- ✅ Interface mobile first
- ✅ Touch targets adequados
- ✅ Contraste acessível

---

## Deliverables POC

### Componentes Essenciais
- [ ] InventoryGrid tropical upgrade
- [ ] ProductCard tropical upgrade  
- [ ] SearchBar tropical upgrade
- [ ] CartFloating tropical (já existe)
- [ ] CheckoutFlow tropical novo

### Layout POC
- [ ] Layout minimalista responsivo
- [ ] Header tropical simples
- [ ] Container principal
- [ ] Modal/drawer integration

### Funcionalidades
- [ ] Busca e seleção de produtos
- [ ] Carrinho com desconto
- [ ] Checkout completo
- [ ] Persistência localStorage
- [ ] Toast notifications

---

## Exclusões da POC

### Fora do Escopo Atual
- ❌ Footer complexo
- ❌ Navigation avançada
- ❌ Breadcrumbs
- ❌ Categorias complexas
- ❌ Filtros avançados
- ❌ Dashboard analytics
- ❌ Sistema de usuários
- ❌ Checkout multi-step complexo

### Para Versão Futura
- 🔄 Layout completo e-commerce
- 🔄 Sistema de categorias
- 🔄 Filtros avançados
- 🔄 Dashboard de vendas
- 🔄 Analytics completo
- 🔄 Multi-tenant
- 🔄 Offline mode

---

**Prazo POC:** 1-2 sprints
**Prioridade:** Crítica
**Objetivo:** Validar viabilidade em feira real

---

*Mantém simplicidade da POC + elegância do tropical theme* 