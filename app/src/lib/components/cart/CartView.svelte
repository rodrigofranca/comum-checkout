<script lang="ts">
	import { items, getTotal, getSubtotal, clearCart } from '$lib/cart.svelte';
	import { customerState, clearCustomerData, clearLocalStorage, getCustomerData } from '$lib/customer.svelte';
	import { config } from '$lib/config';
	import { markItemsAsSold, saveSale } from '$lib/pocketbase';
	import type { ConfirmationData, CompletedSale } from '$lib/types';
	import CartItem from './CartItem.svelte';
	import DiscountInput from '../DiscountInput.svelte';
	import CustomerForm from '../forms/CustomerForm.svelte';
	import PaymentSelector from './PaymentSelector.svelte';
	import PurchaseConfirmationModal from './PurchaseConfirmationModal.svelte';
	import SuccessScreen from './SuccessScreen.svelte';
	import toast from '../notifications/toast.svelte';
	import { createEventDispatcher } from 'svelte';

	type PaymentMethod = 'debito' | 'credito' | 'pix';

	const dispatch = createEventDispatcher<{ close: void }>();

	const subtotal = $derived(getSubtotal());
	const total = $derived(getTotal());
	
	let selectedPayment = $state<PaymentMethod | undefined>(undefined);
	let isProcessing = $state(false);
	let showConfirmationModal = $state(false);
	let lastError = $state<string | null>(null);
	let showRetryButton = $state(false);
	let currentProcessingStep = $state<string>('');
	let showSuccessScreen = $state(false);
	let completedSaleData = $state<CompletedSale | null>(null);
	const canFinalize = $derived(customerState.isValid && selectedPayment !== undefined && !isProcessing);

	// Dados para o modal de confirmação
	const confirmationData = $derived<ConfirmationData>({
		items: items,
		total: total,
		customer: getCustomerData(),
		paymentMethod: selectedPayment || ''
	});

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
		lastError = null;
		showRetryButton = false;
		currentProcessingStep = '';
		showSuccessScreen = false;
		completedSaleData = null;
	}

	// Função para limpar erros
	function clearError() {
		lastError = null;
		showRetryButton = false;
		currentProcessingStep = '';
	}

	// Função para iniciar nova venda (callback do success screen)
	function startNewSale() {
		showSuccessScreen = false;
		clearAll();
	}

	// Função para iniciar processo de finalização (mostra modal)
	function initiatePurchase() {
		if (!canFinalize) return;
		clearError(); // Limpar erros anteriores
		showConfirmationModal = true;
	}

	// Função para cancelar confirmação
	function cancelConfirmation() {
		showConfirmationModal = false;
	}

	// Função para confirmar e processar compra
	async function confirmPurchase() {
		showConfirmationModal = false;
		await processPurchase();
	}

	// Função para processar compra (lógica existente)
	async function processPurchase() {
		if (!canFinalize) return;

		// Validações básicas
		if (items.length === 0) {
			lastError = 'Carrinho está vazio. Adicione produtos antes de finalizar.';
			toast.addToast(lastError, 'error', 5000);
			return;
		}

		if (!selectedPayment) {
			lastError = 'Selecione uma forma de pagamento para continuar.';
			toast.addToast(lastError, 'error', 5000);
			return;
		}

		if (!customerState.isValid) {
			lastError = 'Preencha corretamente os dados do cliente.';
			toast.addToast(lastError, 'error', 5000);
			return;
		}

		isProcessing = true;
		currentProcessingStep = 'Validando dados...';

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
			let inventorySuccess = true;

			// Etapa 1: Salvar a venda no PocketBase
			currentProcessingStep = 'Salvando venda...';
			try {
				const saleResult = await saveSale(saleData);
				
				if (saleResult.success) {
					saleId = saleResult.saleId;
					console.log('✅ Venda salva com ID:', saleId);
				} else {
					throw new Error(saleResult.error || 'Erro desconhecido ao salvar venda');
				}
			} catch (error) {
				pocketbaseSuccess = false;
				console.error('❌ Erro ao salvar venda no PocketBase:', error);
				toast.addToast('Erro ao salvar venda no sistema. Tente novamente.', 'error', 8000);
				throw error; // Falha crítica - para o processo
			}

			// Etapa 2: Integração com n8n para processar a venda (recibo)
			currentProcessingStep = 'Enviando recibo...';
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
					console.log('✅ Recibo processado via n8n:', result);
				} catch (error) {
					n8nSuccess = false;
					console.error('❌ Erro no processamento do recibo:', error);
					// Continua o processo - erro do n8n não é crítico
				}
			} else {
				n8nSuccess = false;
				console.warn('⚠️ URL do webhook n8n não configurada');
			}

			// Etapa 3: Marcar itens como vendidos no PocketBase
			currentProcessingStep = 'Atualizando inventário...';
			try {
				const updateResult = await markItemsAsSold(items);
				
				if (!updateResult.success) {
					inventorySuccess = false;
					console.warn('❌ Alguns itens não foram marcados como vendidos:', updateResult.errors);
				} else {
					console.log(`✅ ${updateResult.updatedCount}/${items.length} itens marcados como vendidos`);
				}
			} catch (error) {
				inventorySuccess = false;
				console.error('❌ Erro ao atualizar inventário:', error);
				// Não é crítico - venda já foi salva
			}

			// Etapa final
			currentProcessingStep = 'Finalizando...';
			
			// Notificação de sucesso baseada no resultado das operações
			if (pocketbaseSuccess && n8nSuccess && inventorySuccess) {
				toast.addToast('✅ Compra finalizada com sucesso! Recibo enviado e inventário atualizado.', 'success', 5000);
			} else if (pocketbaseSuccess && n8nSuccess && !inventorySuccess) {
				toast.addToast('✅ Compra finalizada! Recibo enviado, mas alguns itens do inventário não foram atualizados.', 'warning', 6000);
			} else if (pocketbaseSuccess && !n8nSuccess && inventorySuccess) {
				toast.addToast('✅ Compra finalizada! Inventário atualizado, mas houve problemas no envio do recibo.', 'warning', 6000);
			} else if (pocketbaseSuccess && !n8nSuccess && !inventorySuccess) {
				toast.addToast('✅ Compra salva! Houve problemas com recibo e inventário, mas venda foi registrada.', 'warning', 7000);
			} else {
				// Não deveria chegar aqui por causa do throw, mas por segurança
				toast.addToast('❌ Erro crítico no processamento. Entre em contato com suporte.', 'error', 8000);
			}

			// Preparar dados para tela de sucesso
			completedSaleData = {
				id: saleId || 'unknown',
				total: total,
				paymentMethod: selectedPayment || 'pendente',
				customer: customerData,
				timestamp: purchaseData.timestamp,
				receiptSent: n8nSuccess
			};

			// Mostrar tela de sucesso
			showSuccessScreen = true;

		} catch (error) {
			console.error('❌ Erro crítico ao finalizar compra:', error);
			
			// Definir erro específico e mostrar botão retry
			if (error instanceof Error) {
				lastError = `Erro ao salvar venda: ${error.message}`;
			} else {
				lastError = 'Erro de conexão ao salvar venda';
			}
			
			showRetryButton = true;
			toast.addToast(lastError + '. Seus dados foram preservados.', 'error', 10000);
			
		} finally {
			isProcessing = false;
		}
	}
</script>

<div class="menu bg-base-200 text-base-content min-h-full w-80 p-4 flex flex-col">
	<div class="flex items-center justify-between mb-4">
		<h2 class="text-xl font-bold">Meu Carrinho</h2>
		<button class="btn btn-sm btn-circle btn-ghost" aria-label="Fechar carrinho" onclick={() => dispatch('close')
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
				<CartItem {item} disabled={isProcessing} />
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
			<CustomerForm disabled={isProcessing} />
		</div>

		<!-- Seleção de forma de pagamento -->
		<div class="mt-4">
			<PaymentSelector bind:selected={selectedPayment} disabled={isProcessing} />
		</div>

		<!-- Mensagem de erro com botão retry -->
		{#if lastError && showRetryButton}
			<div class="alert alert-error mt-4">
				<svg xmlns="http://www.w3.org/2000/svg" class="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
				</svg>
				<div>
					<h3 class="font-bold">Erro ao finalizar compra</h3>
					<div class="text-sm">{lastError}</div>
				</div>
			</div>
			<button 
				class="btn btn-warning w-full mt-2" 
				disabled={isProcessing}
				onclick={initiatePurchase}
				aria-label="Tentar finalizar compra novamente"
			>
				🔄 Tentar Novamente
			</button>
		{/if}

		<!-- Botões de ação -->
		<div class="space-y-2 mt-6">
			<button
				class="btn btn-primary w-full {!canFinalize ? 'btn-disabled' : ''} {isProcessing ? 'loading' : ''}"
				disabled={!canFinalize}
				title={!canFinalize ? (isProcessing ? 'Processando compra...' : 'Preencha os dados obrigatórios e selecione a forma de pagamento para finalizar') : ''}
				aria-label="Finalizar compra"
				onclick={initiatePurchase}
			>
				{#if isProcessing}
					<span class="loading loading-spinner loading-sm"></span>
					{currentProcessingStep || 'Processando...'}
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

<!-- Modal de confirmação -->
<PurchaseConfirmationModal 
	isOpen={showConfirmationModal}
	purchaseData={confirmationData}
	onConfirm={confirmPurchase}
	onCancel={cancelConfirmation}
/>

<!-- Tela de sucesso -->
{#if completedSaleData}
<SuccessScreen 
	isOpen={showSuccessScreen}
	saleData={completedSaleData}
	onNewSale={startNewSale}
/>
{/if}