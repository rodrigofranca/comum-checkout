<script lang="ts">
	import { items, getTotal, getSubtotal, clearCart } from '$lib/cart.svelte';
	import CartItem from './CartItem.svelte';
	import DiscountInput from '../DiscountInput.svelte';
	import { createEventDispatcher } from 'svelte';

	const dispatch = createEventDispatcher<{ close: void }>();

	const subtotal = $derived(getSubtotal());
	const total = $derived(getTotal());

	// Função para formatar moeda
	function formatCurrency(value: number): string {
		return new Intl.NumberFormat('pt-BR', {
			style: 'currency',
			currency: 'BRL'
		}).format(value);
	}
</script>

<div class="menu bg-base-200 text-base-content min-h-full w-80 p-4 flex flex-col">
	<div class="flex items-center justify-between mb-4">
		<h2 class="text-xl font-bold">Meu Carrinho</h2>
		<button class="btn btn-sm btn-circle btn-ghost" onclick={() => dispatch('close')
		}>
			<svg
				xmlns="http://www.w3.org/2000/svg"
				fill="none"
				viewBox="0 0 24 24"
				stroke-width="1.5"
				stroke="currentColor"
				class="h-6 w-6"
			>
				<path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
			</svg>
		</button>
	</div>
	{#if items.length === 0}
		<p class="text-center text-base-content/60 py-8 flex-grow flex items-center justify-center">
			Seu carrinho está vazio.
		</p>
	{:else}
		<!-- Lista de itens do carrinho -->
		<div class="flex-grow overflow-y-auto mb-4">
			{#each items as item (item.product.id)}
				<CartItem {item} />
			{/each}
		</div>

		<!-- Resumo de valores -->
		<div class="space-y-4">
			<!-- Subtotal -->
			<div class="flex justify-between text-base-content/70">
				<span>Subtotal:</span>
				<span>{formatCurrency(subtotal)}</span>
			</div>

			<!-- Componente de desconto -->
			{#if subtotal > 0}
				<DiscountInput />
			{/if}

			<!-- Total final -->
			<div class="divider my-2"></div>
			<div class="flex justify-between font-bold text-lg text-primary">
				<span>Total:</span>
				<span>{formatCurrency(total)}</span>
			</div>
		</div>

		<!-- Botões de ação -->
		<div class="space-y-2 mt-6">
			<button class="btn btn-primary w-full">
				💳 Finalizar Compra
			</button>
			<button class="btn btn-ghost w-full" onclick={() => clearCart()}>
				🗑️ Esvaziar Carrinho
			</button>
		</div>
	{/if}
</div>