<script lang="ts">
	// Importar o estado do carrinho usando named exports
	import { items } from '$lib/cart.svelte';
	import CartView from '$lib/components/cart/CartView.svelte';

	const itemCount = $derived(items.length);
	let showCart = $state(false);

	function toggleCart() {
		showCart = !showCart;

		if (showCart) {
			// Desabilitar scroll da página
			document.body.style.overflow = 'hidden';
		} else {
			// Habilitar scroll da página
			document.body.style.overflow = '';
		}
	}

	function closeCart() {
		showCart = false;
		// Habilitar scroll da página
		document.body.style.overflow = '';
	}

	function handleBackdropClick() {
		closeCart();
	}

	function handleKeydown(event: KeyboardEvent) {
		if (event.key === 'Escape') {
			closeCart();
		}
	}
</script>

<!-- Lógica de exibição condicional -->
{#if itemCount > 0}
<div class="fixed bottom-4 right-4 z-50">
  <button class="btn btn-primary btn-circle btn-lg" onclick={toggleCart} aria-label="Abrir carrinho">
    <div class="indicator">
      <!-- Exibição dinâmica do número de itens -->
      <span class="indicator-item badge badge-secondary">{itemCount}</span>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        class="h-6 w-6"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
        />
      </svg>
    </div>
  </button>
</div>
{/if}

<!-- Modal do carrinho -->
{#if showCart}
<div class="fixed inset-0 z-50 flex" onkeydown={handleKeydown} role="dialog" aria-modal="true" tabindex="0">
  <!-- Backdrop -->
  <button
    class="fixed inset-0 bg-neutral/50 cursor-default"
    onclick={handleBackdropClick}
    aria-label="Fechar carrinho"
    tabindex="-1"
  ></button>

  <!-- Painel do carrinho -->
  <div class="fixed right-0 top-0 h-full bg-base-100 shadow-2xl z-50 flex flex-col">
    <div class="flex-1 overflow-y-auto">
      <CartView on:close={closeCart} />
    </div>
  </div>
</div>
{/if}