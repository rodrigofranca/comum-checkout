# Implementação do Carrinho de Compras

Este documento descreve a implementação do carrinho de compras usando Svelte 5 com Runes.

## Estrutura

### Tipos

O carrinho utiliza as seguintes interfaces (definidas em `$lib/types.ts`):

```typescript
interface Product {
  id: string;
  codigo: string;
  nome: string;
  preco: number;
  status: 'disponivel' | 'vendido';
  foto_url?: string;
  categoria?: string;
  descricao?: string;
}

interface CartItem {
  product: Product;
  quantity: number;
}

interface Cart {
  items: CartItem[];
  total: number;
}
```

### Estado do Carrinho

O estado do carrinho é gerenciado através do módulo `$lib/cart.svelte.ts` usando Svelte 5 Runes:

```typescript
const cart = $state<Cart>({ 
  items: [], 
  total: 0 
});
```

## API do Carrinho

O módulo `$lib/cart.svelte.ts` expõe as seguintes funcionalidades:

### Estado

```typescript
cart.state: Cart // Acesso ao estado atual do carrinho
```

### Métodos

```typescript
// Adiciona um produto ao carrinho
cart.addItem(product: Product): void

// Remove um produto do carrinho pelo ID
cart.removeItem(productId: string): void

// Atualiza a quantidade de um item
cart.updateItemQuantity(productId: string, quantity: number): void

// Limpa o carrinho
cart.clearCart(): void
```

## Como Usar

### 1. Importar o Módulo

```typescript
import cart from '$lib/cart.svelte';
```

### 2. Acessar o Estado

```typescript
// Número de itens no carrinho
const itemCount = cart.state.items.length;

// Total do carrinho
const total = cart.state.total;

// Verificar se um produto está no carrinho
const isInCart = cart.state.items.some(item => item.product.id === productId);
```

### 3. Manipular Itens

```typescript
// Adicionar item
cart.addItem(product);

// Remover item
cart.removeItem(productId);

// Atualizar quantidade
cart.updateItemQuantity(productId, newQuantity);

// Limpar carrinho
cart.clearCart();
```

## Exemplos de Uso

### Botão de Adicionar/Remover em um Card de Produto

```svelte
<script lang="ts">
  import cart from '$lib/cart.svelte';
  export let product: Product;

  $state isInCart = cart.state.items.some(item => item.product.id === product.id);
</script>

{#if isInCart}
  <button
    class="btn btn-error btn-wide"
    onclick={() => cart.removeItem(product.id)}
  >
    ➖ Remover do Carrinho
  </button>
{:else}
  <button
    class="btn btn-primary btn-wide"
    onclick={() => cart.addItem(product)}
  >
    ➕ Adicionar ao Carrinho
  </button>
{/if}
```

### Exibição de Itens do Carrinho

```svelte
<script lang="ts">
  import cart from '$lib/cart.svelte';
</script>

{#if cart.state.items.length > 0}
  <div class="space-y-3">
    {#each cart.state.items as item}
      <div class="flex justify-between items-center p-4">
        <div>
          <h3>{item.product.nome}</h3>
          <p>R$ {item.product.preco.toFixed(2)} cada</p>
        </div>
        <div class="flex items-center gap-4">
          <div>
            <div>Qtd: {item.quantity}</div>
            <div>Subtotal: R$ {(item.product.preco * item.quantity).toFixed(2)}</div>
          </div>
          <button 
            class="btn btn-error btn-circle btn-sm"
            onclick={() => cart.removeItem(item.product.id)}
          >
            ✕
          </button>
        </div>
      </div>
    {/each}
  </div>
  <div class="text-right">
    <p class="text-xl">Total: R$ {cart.state.total.toFixed(2)}</p>
  </div>
{:else}
  <p>Carrinho vazio</p>
{/if}
```

### Indicador Flutuante do Carrinho

```svelte
<script lang="ts">
  import cart from '$lib/cart.svelte';
</script>

{#if cart.state.items.length > 0}
  <div class="fixed bottom-4 right-4">
    <a href="/cart" class="btn btn-primary btn-circle btn-lg">
      <div class="indicator">
        <span class="indicator-item badge badge-secondary">
          {cart.state.items.length}
        </span>
        <svg><!-- ícone do carrinho --></svg>
      </div>
    </a>
  </div>
{/if}
```

## Estilização

O carrinho utiliza classes do DaisyUI com o tema Tropical. Principais classes utilizadas:

- `btn-primary`: Ações principais (adicionar)
- `btn-error`: Ações de remoção
- `border-primary`: Indicação de item selecionado
- `text-success`: Valores e totais
- `text-primary`: Quantidades
- `badge-secondary`: Contador de itens

## Testes

Um conjunto completo de testes está disponível em `/app/src/routes/test/cart/+page.svelte`, incluindo:

- Adição de item único
- Adição múltipla do mesmo item
- Adição de itens diferentes
- Remoção de itens
- Cálculo do total
- Limpeza do carrinho

## Observações

1. O estado do carrinho é reativo graças ao Svelte 5 Runes
2. O total é recalculado automaticamente após cada operação
3. A UI fornece feedback visual claro das ações
4. O design segue o Tropical Theme para consistência visual 