<script lang="ts">
	import pb from '$lib/pocketbase';

	export let product: any;

	function getImageUrl(product: any) {
		// Verifica se o produto tem imagens e se o array não está vazio
		if (product.images && product.images.length > 0) {
			// Pega a primeira imagem do array
			return pb.files.getURL(product, product.images[0]);
		}
		return 'https://via.placeholder.com/300x400?text=Sem+Imagem'; // Placeholder melhorado
	}
</script>

<div class="card bg-base-100 shadow-xl">
	<figure>
		<img src={getImageUrl(product)} alt={product.title} class="h-64 w-full object-cover" />
	</figure>
	<div class="card-body">
		<h2 class="card-title">{product.title}</h2>
		<p>Código: {product.product_id}</p>
		<div class="card-actions justify-end">
			<div class="badge badge-outline">R$ {product.price.toFixed(2)}</div>
		</div>
	</div>
</div>