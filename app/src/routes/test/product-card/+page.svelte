
<script lang="ts">
	import ProductCard from '$lib/components/ProductCard.svelte';
	export let data;
</script>

<div class="p-4">
	<h1 class="text-2xl font-bold mb-4">Página de Teste - ProductCard</h1>
	<div class="max-w-sm">
		<ProductCard product={data.product} />
	</div>
</div>