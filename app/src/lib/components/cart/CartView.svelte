<script lang="ts">
	import { items, getTotal, getSubtotal, clearCart } from '$lib/cart.svelte';
	import { customerState, clearCustomerData, clearLocalStorage, getCustomerData } from '$lib/customer.svelte';
	import { config } from '$lib/config';
	import CartItem from './CartItem.svelte';
	import DiscountInput from '../DiscountInput.svelte';
	import CustomerForm from '../forms/CustomerForm.svelte';
	import { createEventDispatcher } from 'svelte';

	const dispatch = createEventDispatcher<{ close: void }>();

	const subtotal = $derived(getSubtotal());
	const total = $derived(getTotal());
	const canFinalize = $derived(customerState.isValid);

	// Função para formatar moeda
	function formatCurrency(value: number): string {
		return new Intl.NumberFormat('pt-BR', {
			style: 'currency',
			currency: 'BRL'
		}).format(value);
	}

	// Função para limpar carrinho e dados do cliente
	function clearAll() {
		clearCart();
		clearCustomerData();
		clearLocalStorage();
	}

	// Função para finalizar compra
	async function finalizePurchase() {
		if (!canFinalize) return;

		try {
			// Coletar dados da compra
			const customerData = getCustomerData();
			const purchaseData = {
				items: items.map(item => ({
					id: item.product.id,
					codigo: item.product.codigo,
					nome: item.product.nome,
					preco: item.product.preco,
					quantity: item.quantity
				})),
				subtotal: subtotal,
				total: total,
				customer: customerData,
				timestamp: new Date().toISOString(),
				paymentMethod: 'pendente' // TODO: Implementar seleção de forma de pagamento
			};

			console.log('Finalizando compra:', purchaseData);

			// Integração com n8n para processar a venda
			if (config.n8nWebhookUrl) {
				const response = await fetch(config.n8nWebhookUrl, {
					method: 'POST',
					headers: {
						'Content-Type': 'application/json',
					},
					body: JSON.stringify({
						action: 'process_sale',
						data: purchaseData
					})
				});

				if (!response.ok) {
					throw new Error(`Erro na integração: ${response.status}`);
				}

				const result = await response.json();
				console.log('Resposta n8n:', result);
			}

			// Simular marcação de itens como vendidos no PocketBase
			// TODO: Implementar integração real com PocketBase
			for (const item of items) {
				console.log(`Marcando item ${item.product.codigo} como vendido`);
			}

			alert('Compra finalizada com sucesso!');

			// Limpar carrinho e dados após sucesso
			clearAll();

		} catch (error) {
			console.error('Erro ao finalizar compra:', error);
			alert('Erro ao finalizar compra. Tente novamente.');
		}
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
		<div class="flex flex-grow flex-col gap-y-2 overflow-y-auto mb-4">
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

		<!-- Formulário de dados do cliente -->
		<div class="mt-4">
			<CustomerForm />
		</div>

		<!-- Botões de ação -->
		<div class="space-y-2 mt-6">
			<button
				class="btn btn-primary w-full {!canFinalize ? 'btn-disabled' : ''}"
				disabled={!canFinalize}
				title={!canFinalize ? 'Preencha os dados obrigatórios para finalizar' : ''}
				aria-label="Finalizar compra"
				onclick={finalizePurchase}
			>
				💳 Finalizar Compra
			</button>
			<button class="btn btn-ghost w-full" onclick={clearAll} aria-label="Esvaziar carrinho">
				🗑️ Esvaziar Carrinho
			</button>
		</div>
	{/if}
</div>