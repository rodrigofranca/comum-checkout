<!--
  @component
  CartItem - Componente que exibe um item individual do carrinho com controles de quantidade
-->
<script lang="ts">
  import type { CartItem } from '$lib/types';
  import { removeItem, updateItemQuantity } from '$lib/cart.svelte';
  import pb from '$lib/pocketbase';

  // Props
  type Props = { item: CartItem; disabled?: boolean };
  const { item, disabled = false }: Props = $props();

  // Formatação de moeda
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  // Cálculo do subtotal
  const subtotal = $derived(item.quantity * (item.product.price || item.product.preco));

  // Estado do botão de remoção
  let isRemoving = $state(false);

  // Função para obter URL da imagem
  function getImageUrl() {
    // Primeiro tenta usar o novo campo images
    if (item.product.images && item.product.images.length > 0) {
      const recordLike = {
        id: item.product.id,
        collectionId: 'pbc_1475816973', // inventory collection ID
        collectionName: 'inventory'
      };
      return pb.files.getURL(recordLike, item.product.images[0]);
    }
    
    // Fallback para foto_url legacy
    if (item.product.foto_url) {
      return item.product.foto_url;
    }
    
    return null;
  }

  // Funções de interação
  function handleQuantityChange(delta: number) {
    if (disabled) return;
    const newQuantity = item.quantity + delta;
    if (newQuantity <= 0) {
      handleRemove();
    } else {
      updateItemQuantity(item.product.id, newQuantity);
    }
  }

  function handleRemove() {
    if (disabled) return;
    isRemoving = true;
    setTimeout(() => {
      removeItem(item.product.id);
    }, 150); // Pequeno delay para a animação
  }
</script>

<!-- Container do item -->
<div
  class="cart-item card bg-base-100 shadow-sm"
  class:removing={isRemoving}
>
  <div class="card-body p-3">
    <!-- NEW LAYOUT: Main container for vertical stacking -->
    <div class="flex flex-col gap-3">
      <!-- Top section: Image + Main Info -->
      <div class="flex items-start gap-4">
        <!-- Área da imagem -->
        <div class="w-20 h-20 flex-shrink-0 rounded-box bg-base-200 overflow-hidden">
          {#if getImageUrl()}
            <img
              src={getImageUrl()}
              alt={item.product.title || item.product.nome}
              class="w-full h-full object-cover"
              loading="lazy"
            />
          {:else}
            <div class="w-full h-full flex items-center justify-center text-base-content/50">
              <span class="text-2xl">📷</span>
            </div>
          {/if}
        </div>

        <!-- Informações do produto (Nome e Código) -->
        <div class="flex-grow">
          <h3 class="text-base font-medium text-base-content leading-tight">{item.product.title || item.product.nome}</h3>
          <p class="text-sm text-base-content/70 mt-1">Código: {item.product.product_id || item.product.codigo}</p>
        </div>
      </div>

      <!-- Bottom section: Prices + Controls -->
      <div class="flex items-end justify-between">
        <!-- Preços -->
        <div class="text-sm">
          <p class="text-base-content/70">
            Preço unitário:
            <span class="font-medium text-base-content">{formatCurrency(item.product.price || item.product.preco)}</span>
          </p>
          <p class="text-base-content">
            Subtotal:
            <span class="font-medium text-primary">{formatCurrency(subtotal)}</span>
          </p>
        </div>

        <!-- Controles de quantidade -->
        <div class="flex flex-col items-end gap-2">
          <!-- Botões de quantidade -->
          <div class="join">
            <button
              class="btn btn-sm join-item btn-outline"
              onclick={() => handleQuantityChange(-1)}
              disabled={isRemoving || disabled}
            >
              <span class="text-lg">−</span>
            </button>
            <span class="btn btn-sm join-item btn-ghost no-animation min-w-[2.5rem] {disabled ? 'opacity-60' : ''}">
              {item.quantity}
            </span>
            <button
              class="btn btn-sm join-item btn-outline"
              onclick={() => handleQuantityChange(1)}
              disabled={isRemoving || disabled}
            >
              <span class="text-lg">+</span>
            </button>
          </div>

          <!-- Botão remover -->
          <button
            class="btn btn-sm btn-error btn-outline gap-2"
            onclick={handleRemove}
            disabled={isRemoving || disabled}
          >
            {#if isRemoving}
              <span class="loading loading-spinner loading-xs"></span>
            {/if}
            Remover
          </button>
        </div>
      </div>
    </div>
  </div>
</div>

<style>
  .cart-item {
    border: var(--border);
    border-radius: var(--radius-box);
    transition: all 0.2s ease-in-out;
  }

  .cart-item:hover {
    transform: translateY(-2px);
    box-shadow: var(--depth) var(--depth) 1rem rgba(0, 0, 0, 0.1);
  }

  /* Animação de remoção */
  .cart-item.removing {
    opacity: 0.5;
    transform: translateX(100%);
    transition: all 0.15s ease-in-out;
  }

  /* Melhorar legibilidade dos símbolos + e - */
  .text-lg {
    line-height: 1;
  }
</style>