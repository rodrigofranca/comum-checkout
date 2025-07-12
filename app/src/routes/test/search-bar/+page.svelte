<script lang="ts">
	import SearchBar from '$lib/components/SearchBar.svelte';
	import InventoryGrid from '$lib/components/InventoryGrid.svelte';
	export let data;
</script>

<div class="p-4">
	<h1 class="text-2xl font-bold mb-4">Página de Teste - SearchBar</h1>

	<div class="mb-6">
		<h2 class="text-lg font-semibold mb-2">Teste da Barra de Busca</h2>
		<p class="text-gray-600 mb-4">
			Digite um termo de busca para filtrar produtos por nome ou código.
			{#if data.searchQuery}
				Buscando por: <strong>"{data.searchQuery}"</strong>
			{:else}
				Mostrando produtos mais recentes.
			{/if}
		</p>

		<SearchBar />
	</div>

	<div class="mb-6">
		<h2 class="text-lg font-semibold mb-2">Resultados da Busca</h2>
		<p class="text-sm text-gray-500 mb-4">
			{data.products.length} produto(s) encontrado(s)
		</p>

		<InventoryGrid products={data.products} />
	</div>
</div>