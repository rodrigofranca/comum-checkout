<script lang="ts">
	const tests = [
		{
			name: 'ProductCard',
			path: '/test/product-card',
			description: 'Testa o componente de cartão de produto individual',
			phase: 'Fase 2.1'
		},
		{
			name: 'SearchBar',
			path: '/test/search-bar',
			description: 'Testa o componente de barra de busca com funcionalidade de filtro',
			phase: 'Fase 2.2'
		},
		{
			name: 'InventoryGrid',
			path: '/test/inventory-grid',
			description: 'Testa o componente de grid de produtos em diferentes cenários',
			phase: 'Fase 2.3'
		},
		{
			name: 'Data Fetching',
			path: '/test/data-fetching',
			description: 'Testa a implementação do data fetching da rota principal com filtros dinâmicos',
			phase: 'Fase 3.1'
		},
		{
			name: 'Cart',
			path: '/test/cart',
			description: 'Testa o módulo de estado do carrinho com runes do Svelte 5',
			phase: 'Fase 1.2'
		}
	];
</script>

<div class="p-4">
	<h1 class="text-3xl font-bold mb-6">Página de Testes - Componentes</h1>

	<div class="mb-8">
		<p class="text-gray-600">
			Esta página centraliza todos os testes dos componentes implementados no projeto.
			Cada teste é executado em um ambiente isolado para verificar o funcionamento correto dos componentes.
		</p>
	</div>

	<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
		{#each tests as test}
			<div class="card bg-base-100 shadow-xl">
				<div class="card-body">
					<h2 class="card-title">
						{test.name}
						<div class="badge badge-secondary">{test.phase}</div>
					</h2>
					<p class="text-sm text-gray-600 mb-4">{test.description}</p>
					<div class="card-actions justify-end">
						<a href={test.path} class="btn btn-primary">
							Executar Teste
						</a>
					</div>
				</div>
			</div>
		{/each}
	</div>

	<div class="mt-8 p-4 bg-info bg-opacity-10 rounded-lg">
		<h3 class="text-lg font-semibold mb-2">Como usar os testes:</h3>
		<ul class="list-disc list-inside text-sm text-gray-600 space-y-1">
			<li><strong>ProductCard:</strong> Testa a exibição de um produto individual</li>
			<li><strong>SearchBar:</strong> Testa a funcionalidade de busca com filtros em tempo real</li>
			<li><strong>InventoryGrid:</strong> Testa a responsividade do grid em diferentes cenários</li>
			<li><strong>Data Fetching:</strong> Testa a implementação do servidor de busca de dados com filtros</li>
			<li><strong>Cart:</strong> Testa o módulo de estado do carrinho com funcionalidades de adicionar itens e calcular totais</li>
		</ul>
	</div>
</div>