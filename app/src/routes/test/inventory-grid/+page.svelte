<script lang="ts">
	import InventoryGrid from '$lib/components/InventoryGrid.svelte';
	export let data;
</script>

<div class="p-4">
	<h1 class="text-2xl font-bold mb-4">Página de Teste - InventoryGrid</h1>

	<div class="mb-8">
		<p class="text-gray-600 mb-4">
			Testando diferentes cenários do grid de produtos. Total de produtos no banco: {data.totalProducts}
		</p>
	</div>

	<!-- Cenário 1: Grid completo -->
	<div class="mb-8">
		<h2 class="text-xl font-semibold mb-4">Cenário 1: Grid Completo ({data.scenarios.fullGrid.length} produtos)</h2>
		<p class="text-gray-600 mb-4">
			Testando a responsividade do grid com muitos produtos.
			O grid deve adaptar-se automaticamente ao tamanho da tela.
		</p>
		<InventoryGrid products={data.scenarios.fullGrid} />
	</div>

	<div class="divider"></div>

	<!-- Cenário 2: Poucos produtos -->
	<div class="mb-8">
		<h2 class="text-xl font-semibold mb-4">Cenário 2: Poucos Produtos ({data.scenarios.fewProducts.length} produtos)</h2>
		<p class="text-gray-600 mb-4">
			Testando como o grid se comporta com poucos produtos.
		</p>
		<InventoryGrid products={data.scenarios.fewProducts} />
	</div>

	<div class="divider"></div>

	<!-- Cenário 3: Um produto apenas -->
	<div class="mb-8">
		<h2 class="text-xl font-semibold mb-4">Cenário 3: Um Produto Apenas ({data.scenarios.singleProduct.length} produto)</h2>
		<p class="text-gray-600 mb-4">
			Testando o grid com apenas um produto.
		</p>
		<InventoryGrid products={data.scenarios.singleProduct} />
	</div>

	<div class="divider"></div>

	<!-- Cenário 4: Nenhum produto -->
	<div class="mb-8">
		<h2 class="text-xl font-semibold mb-4">Cenário 4: Nenhum Produto ({data.scenarios.noProducts.length} produtos)</h2>
		<p class="text-gray-600 mb-4">
			Testando o estado vazio do grid quando não há produtos para exibir.
		</p>
		<InventoryGrid products={data.scenarios.noProducts} />
	</div>
</div>