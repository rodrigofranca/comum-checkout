<script lang="ts">
	import { items, getTotal, getSubtotal, clearCart } from '$lib/cart.svelte';
	import { customerState, clearCustomerData, clearLocalStorage, getCustomerData } from '$lib/customer.svelte';
	import { config } from '$lib/config';
	import { markItemsAsSold, saveSale } from '$lib/pocketbase';
	import CartItem from './CartItem.svelte';
	import DiscountInput from '../DiscountInput.svelte';
	import CustomerForm from '../forms/CustomerForm.svelte';
	import PaymentSelector from './PaymentSelector.svelte';
	import toast from '../notifications/toast.svelte';
	import { createEventDispatcher } from 'svelte';

	type PaymentMethod = 'debito' | 'credito' | 'pix';

	const dispatch = createEventDispatcher<{ close: void }>();

	const subtotal = $derived(getSubtotal());
	const total = $derived(getTotal());
	
	let selectedPayment = $state<PaymentMethod | undefined>(undefined);
	let isProcessing = $state(false);
	const canFinalize = $derived(customerState.isValid && selectedPayment !== undefined && !isProcessing);

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
		selectedPayment = undefined;
	}

	// Função para finalizar compra
	async function finalizePurchase() {
		if (!canFinalize) return;

		isProcessing = true;

		try {
			// Coletar dados da compra
			const customerData = getCustomerData();
			const purchaseData = {
				items: items.map(item => ({
					id: item.product.id,
					product_id: item.product.product_id || item.product.codigo,
					title: item.product.title || item.product.nome,
					price: item.product.price || item.product.preco,
					quantity: item.quantity
				})),
				subtotal: subtotal,
				total: total,
				customer: customerData,
				timestamp: new Date().toISOString(),
				paymentMethod: selectedPayment || 'pendente'
			};

			// Estrutura de dados para salvar no PocketBase
			const saleData = {
				items: purchaseData.items,
				subtotal: purchaseData.subtotal,
				total: purchaseData.total,
				customer_name: customerData.name,
				customer_email: customerData.email,
				wants_receipt: customerData.wantsReceipt,
				payment_method: selectedPayment || 'pendente',
				sale_timestamp: purchaseData.timestamp
			};

			console.log('Finalizando compra:', purchaseData);

			let n8nSuccess = true;
			let pocketbaseSuccess = true;
			let saleId: string | undefined;

			// Salvar a venda no PocketBase primeiro
			try {
				const saleResult = await saveSale(saleData);
				
				if (saleResult.success) {
					saleId = saleResult.saleId;
					console.log('Venda salva com ID:', saleId);
				} else {
					pocketbaseSuccess = false;
					console.error('Erro ao salvar venda:', saleResult.error);
				}
			} catch (error) {
				pocketbaseSuccess = false;
				console.error('Erro ao salvar venda:', error);
			}

			// Integração com n8n para processar a venda
			if (config.n8nWebhookUrl) {
				try {
					const response = await fetch(config.n8nWebhookUrl, {
						method: 'POST',
						headers: {
							'Content-Type': 'application/json',
						},
						body: JSON.stringify({
							action: 'process_sale',
							data: { ...purchaseData, saleId }
						})
					});

					if (!response.ok) {
						throw new Error(`Erro HTTP ${response.status}: ${response.statusText}`);
					}

					const result = await response.json();
					console.log('Resposta n8n:', result);
				} catch (error) {
					n8nSuccess = false;
					console.error('Erro na integração n8n:', error);
					// Continua o processo mesmo com erro do n8n
				}
			}

			// Marcar itens como vendidos no PocketBase
			try {
				const updateResult = await markItemsAsSold(items);
				
				if (!updateResult.success) {
					pocketbaseSuccess = false;
					console.warn('Alguns itens não foram marcados como vendidos:', updateResult.errors);
				}
				
				console.log(`${updateResult.updatedCount}/${items.length} itens marcados como vendidos`);
			} catch (error) {
				pocketbaseSuccess = false;
				console.error('Erro na atualização PocketBase:', error);
			}

			// Notificação de sucesso baseada no resultado das operações
			if (n8nSuccess && pocketbaseSuccess) {
				toast.addToast('Compra finalizada com sucesso! Recibo enviado e inventário atualizado.', 'success', 5000);
			} else if (n8nSuccess && !pocketbaseSuccess) {
				toast.addToast('Compra registrada com sucesso! Recibo enviado, mas houve problemas ao atualizar o inventário.', 'warning', 6000);
			} else if (!n8nSuccess && pocketbaseSuccess) {
				toast.addToast('Compra finalizada! Inventário atualizado, mas houve problemas no envio do recibo.', 'warning', 6000);
			} else {
				toast.addToast('Compra processada com problemas. Verifique o inventário e entre em contato se necessário.', 'error', 8000);
			}

			// Limpar carrinho e dados após sucesso (mesmo com erros parciais)
			clearAll();

		} catch (error) {
			console.error('Erro crítico ao finalizar compra:', error);
			if (error instanceof Error) {
				toast.addToast(`Erro ao finalizar compra: ${error.message}. Tente novamente.`, 'error', 8000);
			} else {
				toast.addToast('Erro desconhecido ao finalizar compra. Tente novamente.', 'error', 8000);
			}
		} finally {
			isProcessing = false;
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

		<!-- Seleção de forma de pagamento -->
		<div class="mt-4">
			<PaymentSelector bind:selected={selectedPayment} />
		</div>

		<!-- Botões de ação -->
		<div class="space-y-2 mt-6">
			<button
				class="btn btn-primary w-full {!canFinalize ? 'btn-disabled' : ''} {isProcessing ? 'loading' : ''}"
				disabled={!canFinalize}
				title={!canFinalize ? (isProcessing ? 'Processando compra...' : 'Preencha os dados obrigatórios e selecione a forma de pagamento para finalizar') : ''}
				aria-label="Finalizar compra"
				onclick={finalizePurchase}
			>
				{#if isProcessing}
					<span class="loading loading-spinner loading-sm"></span>
					Processando...
				{:else}
					💳 Finalizar Compra
				{/if}
			</button>
			<button class="btn btn-ghost w-full" disabled={isProcessing} onclick={clearAll} aria-label="Esvaziar carrinho">
				🗑️ Esvaziar Carrinho
			</button>
		</div>
	{/if}
</div>