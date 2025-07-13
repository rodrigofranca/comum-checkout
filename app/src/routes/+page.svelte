<script lang="ts">
	import InventoryGrid from '$lib/components/InventoryGrid.svelte';
	import SearchBar from '$lib/components/forms/SearchBar.svelte';
	let { data } = $props();

	let searchTerm = $state('');
	let minPrice = $state<number>();
	let maxPrice = $state<number>();

	// Função para filtrar os produtos
	function filterProducts() {
		let filtered = data.products || [];

		if (searchTerm) {
			const lowerCaseSearchTerm = searchTerm.toLowerCase();
			filtered = filtered.filter(
				(item) =>
					item.title?.toLowerCase().includes(lowerCaseSearchTerm) ||
					item.product_id?.toLowerCase().includes(lowerCaseSearchTerm)
			);
		}

		if (minPrice != null) {
			filtered = filtered.filter((item) => item.price >= Number(minPrice));
		}

		if (maxPrice != null) {
			filtered = filtered.filter((item) => item.price <= Number(maxPrice));
		}

		return filtered;
	}

	// Lista filtrada reativa
	let filteredInventory = $state(data.products || []);

	// Atualizar quando os filtros mudarem
	$effect(() => {
		filteredInventory = filterProducts();
	});

	// Inicializar com todos os produtos
	$effect(() => {
		if (data.products) {
			filteredInventory = filterProducts();
		}
	});
</script>

<SearchBar bind:searchTerm bind:minPrice bind:maxPrice />
<InventoryGrid products={filteredInventory} />
