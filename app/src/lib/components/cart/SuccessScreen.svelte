<script lang="ts">
	import type { CompletedSale } from '$lib/types';

	interface Props {
		isOpen: boolean;
		saleData: CompletedSale;
		onNewSale: () => void;
	}

	let { isOpen, saleData, onNewSale }: Props = $props();

	// Função para formatar moeda
	function formatCurrency(value: number): string {
		return new Intl.NumberFormat('pt-BR', {
			style: 'currency',
			currency: 'BRL'
		}).format(value);
	}

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

	// Função para formatar data e hora
	function formatDateTime(isoString: string): string {
		const date = new Date(isoString);
		return date.toLocaleString('pt-BR', {
			day: '2-digit',
			month: '2-digit',
			year: 'numeric',
			hour: '2-digit',
			minute: '2-digit'
		});
	}

	// Auto-dismiss após 10 segundos
	let autoCloseTimer: ReturnType<typeof setTimeout>;
	$effect(() => {
		if (isOpen) {
			autoCloseTimer = setTimeout(() => {
				onNewSale();
			}, 10000);
		}
		
		return () => {
			if (autoCloseTimer) {
				clearTimeout(autoCloseTimer);
			}
		};
	});
</script>

{#if isOpen}
	<!-- Modal backdrop -->
	<div class="modal modal-open">
		<div class="modal-box w-11/12 max-w-md text-center">
			<!-- Ícone de sucesso com animação -->
			<div class="mb-6">
				<div class="mx-auto w-16 h-16 bg-success/20 rounded-full flex items-center justify-center mb-4">
					<svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 text-success" fill="none" viewBox="0 0 24 24" stroke="currentColor">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
					</svg>
				</div>
				<h3 class="text-2xl font-bold text-success">Compra Finalizada!</h3>
				<p class="text-base-content/60 mt-2">Venda processada com sucesso</p>
			</div>

			<!-- Resumo da venda -->
			<div class="bg-base-200 p-4 rounded-lg mb-6 text-left">
				<h4 class="font-semibold mb-3 text-center">Resumo da Venda</h4>
				<div class="space-y-2 text-sm">
					<div class="flex justify-between">
						<span>ID da Venda:</span>
						<span class="font-mono text-xs">{saleData.id.slice(-8)}</span>
					</div>
					<div class="flex justify-between">
						<span>Total:</span>
						<span class="font-bold text-primary">{formatCurrency(saleData.total)}</span>
					</div>
					<div class="flex justify-between">
						<span>Pagamento:</span>
						<span>{getPaymentMethodText(saleData.paymentMethod)}</span>
					</div>
					<div class="flex justify-between">
						<span>Data/Hora:</span>
						<span>{formatDateTime(saleData.timestamp)}</span>
					</div>
				</div>
			</div>

			<!-- Status do recibo -->
			<div class="mb-6">
				{#if saleData.receiptSent}
					<div class="alert alert-success">
						<svg xmlns="http://www.w3.org/2000/svg" class="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
						</svg>
						<span>Recibo enviado para {saleData.customer.email}</span>
					</div>
				{:else}
					<div class="alert alert-warning">
						<svg xmlns="http://www.w3.org/2000/svg" class="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.864-.833-2.634 0L5.098 17.5c-.77.833.192 2.5 1.732 2.5z"/>
						</svg>
						<span>Venda salva - recibo não enviado</span>
					</div>
				{/if}
			</div>

			<!-- Ações -->
			<div class="modal-action justify-center">
				<button class="btn btn-primary btn-lg" onclick={onNewSale}>
					🛍️ Nova Venda
				</button>
			</div>

			<!-- Timer visual -->
			<div class="mt-4">
				<p class="text-xs text-base-content/40">Esta tela será fechada automaticamente em 10 segundos</p>
			</div>
		</div>
	</div>
{/if}