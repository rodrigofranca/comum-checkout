<script lang="ts">
	import pb from '$lib/pocketbase';
	import { findItem, addItem } from '$lib/cart.svelte';
	import toast from '$lib/components/notifications/toast.svelte';
	import type { Product } from '$lib/types';

	const { product }: { product: Product } = $props();

	const isInCart = $derived(!!findItem(product.id));

	function getImageUrl(product: Product) {
		if (product.images && product.images.length > 0) {
			// Create a fake record-like object for pb.files.getURL
			const recordLike = {
				id: product.id,
				collectionId: 'pbc_1475816973', // inventory collection ID
				collectionName: 'inventory'
			};
			
			return pb.files.getURL(recordLike, product.images[0]);
		}
		
		return 'https://placehold.co/300x400?text=Sem+Imagem';
	}
</script>

<div class="card bg-base-100 shadow-md transition-shadow hover:shadow-lg">
	<figure class="aspect-square bg-base-200">
		<img
			src={getImageUrl(product)}
			alt={product.title}
			class="h-full w-full object-cover"
			loading="lazy"
		/>
	</figure>
	<div class="card-body p-4">
		<h2 class="card-title text-base-content">{product.title}</h2>
		<div class="badge badge-secondary">{product.status}</div>
		<div class="card-actions items-center justify-between">
			<div class="text-xl font-bold text-primary">R$ {product.price.toFixed(2)}</div>
			<button
				class="btn btn-primary btn-sm transition-transform active:scale-95"
				onclick={() => {
					addItem(product);
					toast.addToast(`${product.title} foi adicionado ao carrinho!`, 'success');
				}}
				disabled={product.status === 'vendido' || isInCart}
			>
				{isInCart ? 'No Carrinho' : 'Adicionar'}
			</button>
		</div>
	</div>
</div>