<script lang="ts">
	import { createEventDispatcher } from 'svelte';

	type PaymentMethod = 'debito' | 'credito' | 'pix';

	interface Props {
		selected?: PaymentMethod;
	}

	let { selected = $bindable() }: Props = $props();

	const dispatch = createEventDispatcher<{ change: PaymentMethod }>();

	function handleSelection(method: PaymentMethod) {
		selected = method;
		dispatch('change', method);
	}
</script>

<div class="space-y-3">
	<h3 class="text-sm font-medium text-base-content">Forma de Pagamento</h3>
	
	<div class="grid grid-cols-1 gap-2">
		<!-- Débito -->
		<label class="cursor-pointer">
			<input
				type="radio"
				name="payment"
				value="debito"
				class="sr-only"
				onchange={() => handleSelection('debito')}
			/>
			<div
				class="flex items-center gap-3 p-3 rounded-lg border-2 transition-all
				{selected === 'debito' 
					? 'border-primary bg-primary/10 text-primary' 
					: 'border-base-300 hover:border-primary/50'}"
			>
				<div class="text-xl">💳</div>
				<span class="font-medium">Cartão de Débito</span>
			</div>
		</label>

		<!-- Crédito -->
		<label class="cursor-pointer">
			<input
				type="radio"
				name="payment"
				value="credito"
				class="sr-only"
				onchange={() => handleSelection('credito')}
			/>
			<div
				class="flex items-center gap-3 p-3 rounded-lg border-2 transition-all
				{selected === 'credito' 
					? 'border-primary bg-primary/10 text-primary' 
					: 'border-base-300 hover:border-primary/50'}"
			>
				<div class="text-xl">💎</div>
				<span class="font-medium">Cartão de Crédito</span>
			</div>
		</label>

		<!-- PIX -->
		<label class="cursor-pointer">
			<input
				type="radio"
				name="payment"
				value="pix"
				class="sr-only"
				onchange={() => handleSelection('pix')}
			/>
			<div
				class="flex items-center gap-3 p-3 rounded-lg border-2 transition-all
				{selected === 'pix' 
					? 'border-primary bg-primary/10 text-primary' 
					: 'border-base-300 hover:border-primary/50'}"
			>
				<div class="text-xl">⚡</div>
				<span class="font-medium">PIX</span>
			</div>
		</label>
	</div>
</div>