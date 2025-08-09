<script lang="ts">
	import { createEventDispatcher } from 'svelte';

	type PaymentMethod = 'debito' | 'credito' | 'pix';

	interface Props {
		selected?: PaymentMethod;
		disabled?: boolean;
	}

	let { selected = $bindable(), disabled = false }: Props = $props();

	const dispatch = createEventDispatcher<{ change: PaymentMethod }>();

	function handleSelection(method: PaymentMethod) {
		if (disabled) return;
		selected = method;
		dispatch('change', method);
	}
</script>

<div class="space-y-3">
	<h3 class="text-sm font-medium text-base-content">Forma de Pagamento</h3>
	
	<div class="grid grid-cols-1 gap-2">
		<!-- Débito -->
		<label class="{disabled ? 'cursor-not-allowed opacity-60' : 'cursor-pointer'}">
			<input
				type="radio"
				name="payment"
				value="debito"
				class="sr-only"
				onchange={() => handleSelection('debito')}
				disabled={disabled}
			/>
			<div
				class="flex items-center gap-3 p-3 rounded-lg border-2 transition-all
				{selected === 'debito' 
					? 'border-primary bg-primary/10 text-primary' 
					: disabled ? 'border-base-300 bg-base-200/50' : 'border-base-300 hover:border-primary/50'}"
			>
				<div class="text-xl">💳</div>
				<span class="font-medium">Cartão de Débito</span>
			</div>
		</label>

		<!-- Crédito -->
		<label class="{disabled ? 'cursor-not-allowed opacity-60' : 'cursor-pointer'}">
			<input
				type="radio"
				name="payment"
				value="credito"
				class="sr-only"
				onchange={() => handleSelection('credito')}
				disabled={disabled}
			/>
			<div
				class="flex items-center gap-3 p-3 rounded-lg border-2 transition-all
				{selected === 'credito' 
					? 'border-primary bg-primary/10 text-primary' 
					: disabled ? 'border-base-300 bg-base-200/50' : 'border-base-300 hover:border-primary/50'}"
			>
				<div class="text-xl">💎</div>
				<span class="font-medium">Cartão de Crédito</span>
			</div>
		</label>

		<!-- PIX -->
		<label class="{disabled ? 'cursor-not-allowed opacity-60' : 'cursor-pointer'}">
			<input
				type="radio"
				name="payment"
				value="pix"
				class="sr-only"
				onchange={() => handleSelection('pix')}
				disabled={disabled}
			/>
			<div
				class="flex items-center gap-3 p-3 rounded-lg border-2 transition-all
				{selected === 'pix' 
					? 'border-primary bg-primary/10 text-primary' 
					: disabled ? 'border-base-300 bg-base-200/50' : 'border-base-300 hover:border-primary/50'}"
			>
				<div class="text-xl">⚡</div>
				<span class="font-medium">PIX</span>
			</div>
		</label>
	</div>
</div>