<script lang="ts">
	import ProductCard from '$lib/components/ProductCard.svelte';
	import type { RecordModel } from 'pocketbase';

	export let products: RecordModel[] = [];
</script>

{#if products.length > 0}
	<div class="grid grid-cols-1 gap-4 p-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
		{#each products as product (product.id)}
			<ProductCard {product} />
		{/each}
	</div>
{:else}
	<div class="text-center py-16">
		<p class="text-xl">Nenhum produto encontrado.</p>
		<p class="text-base-content opacity-70">Tente ajustar seus termos de busca.</p>
	</div>
{/if}