<script lang="ts">
	import {
		getSubtotal,
		getTotal,
		discount,
		applyDiscount,
		setDiscountType
	} from '$lib/cart.svelte';

	// Recriar reatividade para valores derivados
	const subtotal = $derived(getSubtotal());
	const total = $derived(getTotal());

	// Função para aplicar o desconto
	function handleApplyDiscount() {
		const valueToApply = discount.type === 'fixed' ? discount.value : discount.percentage;
		applyDiscount(valueToApply);
	}

	// Função para limpar o desconto
	function clearDiscount() {
		applyDiscount(0);
	}

	// Função para formatar moeda
	function formatCurrency(value: number): string {
		return new Intl.NumberFormat('pt-BR', {
			style: 'currency',
			currency: 'BRL'
		}).format(value);
	}

	// Lógica para desabilitar o botão de aplicar
	const isApplyDisabled = $derived(
		(discount.type === 'fixed' && (discount.value <= 0 || discount.value > subtotal)) ||
			(discount.type === 'percentage' && (discount.percentage <= 0 || discount.percentage > 100))
	);

	// Lógica para exibir o valor do desconto
	const discountDisplay = $derived(
		(() => {
			if (discount.value <= 0) return '';
			if (discount.type === 'fixed') {
				return formatCurrency(discount.value);
			} else {
				// Calcula a porcentagem com base no valor do desconto e no subtotal
				const percentageValue = subtotal > 0 ? (discount.value / subtotal) * 100 : 0;
				return `${percentageValue.toFixed(0)}% (${formatCurrency(discount.value)})`;
			}
		})()
	);
</script>

<!-- Container do desconto -->
<div class="card bg-base-100 shadow-sm border border-base-300">
	<div class="card-body p-4">
		<h3 class="card-title text-base font-semibold text-base-content mb-3">
			💰 Aplicar Desconto
		</h3>

		<!-- Mostrar subtotal -->
		<div class="text-sm text-base-content/70 mb-2">
			Subtotal: <span class="font-medium">{formatCurrency(subtotal)}</span>
		</div>

		<!-- Seletor de tipo de desconto -->
		<div class="tabs tabs-boxed mb-3">
			<button
				class="tab flex-1"
				class:tab-active={discount.type === 'fixed'}
				onclick={() => setDiscountType('fixed')}
			>
				R$
			</button>
			<button
				class="tab flex-1"
				class:tab-active={discount.type === 'percentage'}
				onclick={() => setDiscountType('percentage')}
			>
				%
			</button>
		</div>

		<!-- Input e botão para aplicar desconto -->
		<div class="flex gap-2 mb-3">
			<div class="form-control flex-1">
				<label class="label pb-1">
					<span class="label-text text-xs">
						{discount.type === 'fixed' ? 'Valor do desconto (R$)' : 'Percentual de desconto (%)'}
					</span>
				</label>
				{#if discount.type === 'fixed'}
					<input
						type="number"
						class="input input-bordered input-sm"
						placeholder="0,00"
						step="0.01"
						min="0"
						max={subtotal}
						bind:value={discount.value}
					/>
				{:else}
					<input
						type="number"
						class="input input-bordered input-sm"
						placeholder="0"
						step="1"
						min="0"
						max="100"
						bind:value={discount.percentage}
					/>
				{/if}
			</div>
			<div class="flex flex-col justify-end">
				<button
					class="btn btn-primary btn-sm"
					onclick={handleApplyDiscount}
					disabled={isApplyDisabled}
				>
					Aplicar
				</button>
			</div>
		</div>

		<!-- Mostrar desconto atual se houver -->
		{#if discount.value > 0}
			<div class="alert alert-success py-2 px-3 text-sm">
				<svg
					xmlns="http://www.w3.org/2000/svg"
					class="stroke-current shrink-0 h-4 w-4"
					fill="none"
					viewBox="0 0 24 24"
				>
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="2"
						d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
					/>
				</svg>
				<div>
					<span class="font-medium">Desconto aplicado:</span>
					{discountDisplay}
				</div>
				<button class="btn btn-ghost btn-xs" onclick={clearDiscount} title="Remover desconto">
					✕
				</button>
			</div>
		{/if}

		<!-- Total final -->
		<div class="divider my-2"></div>
		<div class="flex justify-between items-center">
			<span class="text-base font-semibold text-base-content">Total:</span>
			<span class="text-lg font-bold text-primary">
				{formatCurrency(total)}
			</span>
		</div>
	</div>
</div>