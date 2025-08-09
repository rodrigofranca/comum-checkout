<script lang="ts">
	import type { ConfirmationData } from '$lib/types';

	interface Props {
		isOpen: boolean;
		purchaseData: ConfirmationData;
		onConfirm: () => void;
		onCancel: () => void;
	}

	let { isOpen, purchaseData, onConfirm, onCancel }: Props = $props();

	// Função para formatar moeda
	function formatCurrency(value: number): string {
		return new Intl.NumberFormat('pt-BR', {
			style: 'currency',
			currency: 'BRL'
		}).format(value);
	}

	// Calcular subtotal
	const subtotal = $derived(
		purchaseData.items.reduce((sum, item) => {
			const price = item.product.price || item.product.preco || 0;
			return sum + (price * item.quantity);
		}, 0)
	);

	// Mapear método de pagamento para texto amigável
	function getPaymentMethodText(method: string): string {
		const methods: Record<string, string> = {
			'debito': 'Cartão de Débito',
			'credito': 'Cartão de Crédito',
			'pix': 'PIX',
			'dinheiro': 'Dinheiro'
		};
		return methods[method] || method;
	}
</script>

{#if isOpen}
	<!-- Modal backdrop -->
	<div class="modal modal-open">
		<div class="modal-box w-11/12 max-w-2xl">
			<h3 class="font-bold text-lg mb-4">Confirmar Compra</h3>
			
			<!-- Seção de itens -->
			<div class="mb-6">
				<h4 class="font-semibold text-base mb-3">Itens da Compra</h4>
				<div class="space-y-2 max-h-40 overflow-y-auto">
					{#each purchaseData.items as item (item.product.id)}
						<div class="flex justify-between items-center p-2 bg-base-200 rounded">
							<div class="flex-1">
								<p class="font-medium">{item.product.title || item.product.nome}</p>
								<p class="text-sm text-base-content/60">
									{formatCurrency(item.product.price || item.product.preco || 0)} × {item.quantity}
								</p>
							</div>
							<div class="text-right">
								<p class="font-medium">
									{formatCurrency((item.product.price || item.product.preco || 0) * item.quantity)}
								</p>
							</div>
						</div>
					{/each}
				</div>
			</div>

			<!-- Seção de totais -->
			<div class="mb-6">
				<div class="space-y-2">
					<div class="flex justify-between text-base-content/70">
						<span>Subtotal:</span>
						<span>{formatCurrency(subtotal)}</span>
					</div>
					{#if subtotal !== purchaseData.total}
						<div class="flex justify-between text-base-content/70">
							<span>Desconto:</span>
							<span class="text-success">
								- {formatCurrency(subtotal - purchaseData.total)}
							</span>
						</div>
					{/if}
					<div class="divider my-2"></div>
					<div class="flex justify-between font-bold text-lg text-primary">
						<span>Total:</span>
						<span>{formatCurrency(purchaseData.total)}</span>
					</div>
				</div>
			</div>

			<!-- Seção de cliente -->
			<div class="mb-6">
				<h4 class="font-semibold text-base mb-3">Dados do Cliente</h4>
				<div class="bg-base-200 p-3 rounded space-y-1">
					<p><span class="font-medium">Nome:</span> {purchaseData.customer.name}</p>
					<p><span class="font-medium">Email:</span> {purchaseData.customer.email}</p>
					<p>
						<span class="font-medium">Recibo:</span> 
						{purchaseData.customer.wantsReceipt ? 'Sim, enviar por email' : 'Não solicitado'}
					</p>
				</div>
			</div>

			<!-- Seção de pagamento -->
			<div class="mb-6">
				<h4 class="font-semibold text-base mb-3">Forma de Pagamento</h4>
				<div class="bg-base-200 p-3 rounded">
					<p class="font-medium">{getPaymentMethodText(purchaseData.paymentMethod)}</p>
				</div>
			</div>

			<!-- Botões de ação -->
			<div class="modal-action">
				<button class="btn btn-ghost" onclick={onCancel}>
					Voltar para Editar
				</button>
				<button class="btn btn-primary" onclick={onConfirm}>
					💳 Confirmar Compra
				</button>
			</div>
		</div>
	</div>
{/if}