<script lang="ts">
	import pb from '$lib/pocketbase';
	import cart from '$lib/cart.svelte';

	export let product: any;

	function getImageUrl(product: any) {
		// Verifica se o produto tem imagens e se o array não está vazio
		if (product.images && product.images.length > 0) {
			// Pega a primeira imagem do array
			return pb.files.getURL(product, product.images[0]);
		}
		return 'https://placehold.co/300x400?text=Sem+Imagem'; // Placeholder melhorado
	}
</script>

<div class="card bg-base-100 shadow-md transition-shadow hover:shadow-lg">
	<figure>
		<img
			src={getImageUrl(product)}
			alt={product.title}
			class="h-64 w-full rounded-box object-cover"
			loading="lazy"
		/>
	</figure>
	<div class="card-body p-4">
		<h2 class="card-title text-base-content">{product.title}</h2>
		<div class="card-actions items-center justify-between">
			<div class="text-xl font-bold text-primary">R$ {product.price.toFixed(2)}</div>
			<button class="btn btn-circle btn-primary btn-sm" onclick={() => cart.addItem(product)}>+</button>
		</div>
	</div>
</div>