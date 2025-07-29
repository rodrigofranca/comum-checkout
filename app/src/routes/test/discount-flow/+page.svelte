<script lang="ts">
	import CartView from '$lib/components/cart/CartView.svelte';
	import { clearCart, addItem, applyDiscount } from '$lib/cart.svelte';
	import type { Product } from '$lib/types';
	import { onMount } from 'svelte';

	// Produtos de exemplo para teste
	const sampleProducts: Product[] = [
		{
			id: 'p1',
			codigo: '001',
			nome: 'Produto A',
			descricao: 'Descrição do Produto A',
			preco: 50,
			status: 'disponivel',
			foto_url: 'https://via.placeholder.com/150'
		},
		{
			id: 'p2',
			codigo: '002',
			nome: 'Produto B',
			descricao: 'Descrição do Produto B',
			preco: 150,
			status: 'disponivel',
			foto_url: 'https://via.placeholder.com/150'
		}
	];

	// Função para inicializar o carrinho para os testes
	function initializeCart() {
		clearCart();
		addItem(sampleProducts[0]); // Produto A (R$ 50)
		addItem(sampleProducts[1]); // Produto B (R$ 150)
		// Subtotal = R$ 200
	}

	// Inicializa o carrinho ao carregar a página
	onMount(initializeCart);
</script>

<div class="container mx-auto p-8">
	<h1 class="text-3xl font-bold mb-6 text-primary">Página de Teste: Fluxo de Desconto</h1>

	<div class="card bg-base-100 shadow-xl border border-base-200 mb-8">
		<div class="card-body">
			<h2 class="card-title">Instruções de Teste</h2>
			<p>
				Use os botões abaixo para simular diferentes cenários de teste e observe o comportamento do
				componente <code class="bg-base-300 p-1 rounded-md">CartView</code> à direita.
			</p>
			<div class="mt-4 flex gap-2 flex-wrap">
				<button class="btn btn-secondary" onclick={initializeCart}>
					1. Reiniciar Carrinho (Subtotal R$ 200)
				</button>
			</div>
		</div>
	</div>

	<div class="grid grid-cols-1 md:grid-cols-2 gap-8">
		<!-- Coluna de Ações de Teste -->
		<div class="flex flex-col gap-4">
			<!-- Testes de Desconto Fixo -->
			<div class="card bg-base-100 shadow-xl border border-base-200">
				<div class="card-body">
					<h3 class="card-title text-lg">Testes de Desconto Fixo (R$)</h3>
					<div class="flex gap-2 flex-wrap">
						<button class="btn btn-outline" onclick={() => applyDiscount(20, 'fixed')}>
							Aplicar R$ 20
						</button>
						<button class="btn btn-outline" onclick={() => applyDiscount(250, 'fixed')}>
							Aplicar R$ 250 (Limite)
						</button>
						<button class="btn btn-outline" onclick={() => applyDiscount(0, 'fixed')}>
							Aplicar R$ 0
						</button>
					</div>
				</div>
			</div>

			<!-- Testes de Desconto Percentual -->
			<div class="card bg-base-100 shadow-xl border border-base-200">
				<div class="card-body">
					<h3 class="card-title text-lg">Testes de Desconto Percentual (%)</h3>
					<div class="flex gap-2 flex-wrap">
						<button class="btn btn-outline" onclick={() => applyDiscount(10, 'percentage')}>
							Aplicar 10%
						</button>
						<button class="btn btn-outline" onclick={() => applyDiscount(100, 'percentage')}>
							Aplicar 100%
						</button>
						<button class="btn btn-outline" onclick={() => applyDiscount(120, 'percentage')}>
							Aplicar 120% (Limite)
						</button>
					</div>
				</div>
			</div>

			<!-- Testes de Casos Extremos -->
			<div class="card bg-base-100 shadow-xl border border-base-200">
				<div class="card-body">
					<h3 class="card-title text-lg">Casos Extremos</h3>
					<div class="flex gap-2 flex-wrap">
						<button class="btn btn-outline" onclick={() => clearCart()}>
							Limpar Carrinho
						</button>
					</div>
				</div>
			</div>
		</div>

		<!-- Coluna de Visualização do Carrinho -->
		<div>
			<CartView />
		</div>
	</div>
</div>