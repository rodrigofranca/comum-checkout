<script lang="ts">
	import { onMount } from 'svelte';
	import { customerState, setCustomerData, saveToLocalStorage, loadFromLocalStorage } from '$lib/customer.svelte';
	
	interface Props {
		disabled?: boolean;
	}

	let { disabled = false }: Props = $props();
	
	// Estado derivado para facilitar o acesso
	const data = $derived(customerState.data);
	const emailError = $derived(customerState.emailError);
	
	// Carregar dados salvos ao inicializar
	onMount(() => {
		loadFromLocalStorage();
	});
	
	// Função para atualizar nome
	function updateName(event: Event) {
		const target = event.target as HTMLInputElement;
		setCustomerData('name', target.value);
		saveToLocalStorage();
	}
	
	// Função para atualizar email
	function updateEmail(event: Event) {
		const target = event.target as HTMLInputElement;
		setCustomerData('email', target.value);
		saveToLocalStorage();
	}
	
	// Função para toggle do checkbox de recibo
	function toggleReceipt(event: Event) {
		const target = event.target as HTMLInputElement;
		setCustomerData('wantsReceipt', target.checked);
		saveToLocalStorage();
	}
</script>

<div class="card bg-base-100 border border-base-300 p-4 space-y-4">
	<h3 class="text-lg font-semibold text-base-content flex items-center gap-2">
		<span class="text-primary">👤</span>
		Dados do Cliente
	</h3>
	
	<!-- Campo Nome (sempre opcional) -->
	<div class="form-control">
		<label class="label" for="customer-name">
			<span class="label-text">Nome (opcional)</span>
		</label>
		<input
			id="customer-name"
			type="text"
			placeholder="Digite o nome do cliente"
			class="input input-bordered focus:input-primary"
			value={data.name}
			oninput={updateName}
			disabled={disabled}
		/>
	</div>
	
	<!-- Checkbox para recibo por email -->
	<div class="form-control">
		<label class="label cursor-pointer justify-start gap-3">
			<input
				type="checkbox"
				class="checkbox checkbox-primary"
				checked={data.wantsReceipt}
				onchange={toggleReceipt}
				disabled={disabled}
			/>
			<span class="label-text">Deseja receber recibo por email?</span>
		</label>
	</div>
	
	<!-- Campo Email (condicional) -->
	{#if data.wantsReceipt}
		<div class="form-control">
			<label class="label" for="customer-email">
				<span class="label-text">
					Email <span class="text-error">*</span>
				</span>
			</label>
			<input
				id="customer-email"
				type="email"
				placeholder="exemplo@email.com"
				class="input input-bordered focus:input-primary {emailError ? 'input-error' : ''}"
				value={data.email}
				oninput={updateEmail}
				required
				disabled={disabled}
			/>
			{#if emailError}
				<div class="label">
					<span class="label-text-alt text-error">{emailError}</span>
				</div>
			{/if}
		</div>
		
		<!-- Indicador visual de validade -->
		<div class="flex items-center gap-2 text-sm">
			{#if data.email && !emailError}
				<span class="text-success flex items-center gap-1">
					<svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
						<path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"></path>
					</svg>
					Email válido
				</span>
			{:else if data.email && emailError}
				<span class="text-error flex items-center gap-1">
					<svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
						<path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd"></path>
					</svg>
					Email inválido
				</span>
			{/if}
		</div>
	{/if}
	
	<!-- Informações contextuais -->
	<div class="alert alert-info text-sm">
		<svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
			<path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd"></path>
		</svg>
		<div>
			{#if data.wantsReceipt}
				<strong>Recibo por email:</strong> Um recibo detalhado será enviado para o email informado.
			{:else}
				<strong>Sem recibo:</strong> A compra será finalizada sem envio de recibo por email.
			{/if}
		</div>
	</div>
</div>