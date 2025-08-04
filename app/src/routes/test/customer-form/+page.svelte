<script lang="ts">
	import { addItem, items, clearCart } from '$lib/cart.svelte.ts';
	import { clearCustomerData } from '$lib/customer.svelte.ts';
	import CartFloating from '$lib/components/CartFloating.svelte';

	// Produtos de teste
	const testProducts = [
		{
			id: 'test-1',
			codigo: 'BR001',
			nome: 'Camisa Jeans Vintage',
			preco: 50,
			status: 'disponivel' as const,
			foto_url: ''
		},
		{
			id: 'test-2',
			codigo: 'BR002',
			nome: 'Bolsa de Couro',
			preco: 80,
			status: 'disponivel' as const,
			foto_url: ''
		}
	];

	function addTestItem(product: any) {
		addItem(product);
	}

	function resetTest() {
		clearCart();
		clearCustomerData();
	}

	const cartCount = $derived(items.length);
</script>

<div class="container mx-auto p-4">
	<div class="flex justify-between items-center mb-8">
		<h1 class="text-3xl font-bold text-primary">Teste - FEAT-04: Coleta de Dados do Cliente</h1>
		<div class="badge badge-info">Fase 3 - Integração</div>
	</div>

	<!-- Status do teste -->
	<div class="alert alert-info mb-6">
		<svg class="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
			<path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd"></path>
		</svg>
		<div>
			<strong>Teste de Integração:</strong> Adicione produtos ao carrinho e teste o fluxo completo de coleta de dados do cliente e finalização da compra.
		</div>
	</div>

	<!-- Produtos de teste -->
	<div class="card bg-base-100 shadow-lg mb-6">
		<div class="card-body">
			<h2 class="card-title text-secondary">Produtos de Teste</h2>
			<div class="grid grid-cols-1 md:grid-cols-2 gap-4">
				{#each testProducts as product}
					<div class="card bg-base-200 compact">
						<div class="card-body">
							<h3 class="font-semibold">{product.nome}</h3>
							<p class="text-sm text-base-content/70">Código: {product.codigo}</p>
							<div class="flex justify-between items-center">
								<span class="text-lg font-bold text-primary">R$ {product.preco.toFixed(2)}</span>
								<button 
									class="btn btn-primary btn-sm"
									onclick={() => addTestItem(product)}
								>
									Adicionar
								</button>
							</div>
						</div>
					</div>
				{/each}
			</div>
		</div>
	</div>

	<!-- Informações do carrinho -->
	<div class="card bg-base-100 shadow-lg mb-6">
		<div class="card-body">
			<h2 class="card-title text-secondary">Status do Carrinho</h2>
			<div class="stats stats-horizontal shadow">
				<div class="stat">
					<div class="stat-title">Itens no Carrinho</div>
					<div class="stat-value text-primary">{cartCount}</div>
				</div>
			</div>
		</div>
	</div>

	<!-- Instruções do teste -->
	<div class="card bg-base-100 shadow-lg mb-6">
		<div class="card-body">
			<h2 class="card-title text-secondary">Como Testar</h2>
			<div class="space-y-4">
				<div class="steps steps-vertical lg:steps-horizontal">
					<div class="step step-primary">Adicione produtos ao carrinho</div>
					<div class="step">Clique no carrinho flutuante</div>
					<div class="step">Preencha os dados do cliente</div>
					<div class="step">Teste com/sem recibo por email</div>
					<div class="step">Finalize a compra</div>
				</div>
			</div>
		</div>
	</div>

	<!-- Cenários de teste -->
	<div class="card bg-base-100 shadow-lg mb-6">
		<div class="card-body">
			<h2 class="card-title text-secondary">Cenários de Teste</h2>
			<div class="grid grid-cols-1 md:grid-cols-2 gap-4">
				<div class="card bg-accent/10 border border-accent/20">
					<div class="card-body">
						<h3 class="font-semibold text-accent">🔸 Sem Recibo</h3>
						<ul class="text-sm space-y-1">
							<li>• Nome opcional pode ficar vazio</li>
							<li>• Não marcar checkbox de recibo</li>
							<li>• Botão deve ficar habilitado</li>
							<li>• Finalização deve funcionar</li>
						</ul>
					</div>
				</div>

				<div class="card bg-secondary/10 border border-secondary/20">
					<div class="card-body">
						<h3 class="font-semibold text-secondary">📧 Com Recibo</h3>
						<ul class="text-sm space-y-1">
							<li>• Marcar checkbox de recibo</li>
							<li>• Campo email deve aparecer</li>
							<li>• Email deve ser obrigatório</li>
							<li>• Validação em tempo real</li>
						</ul>
					</div>
				</div>
			</div>
		</div>
	</div>

	<!-- Botões de controle -->
	<div class="flex gap-4 justify-center">
		<button class="btn btn-outline" onclick={resetTest}>
			🔄 Resetar Teste
		</button>
	</div>
</div>

<!-- Carrinho flutuante -->
<CartFloating />