<script lang="ts">
	import pb from '$lib/pocketbase';
	import { findItem, addItem } from '$lib/cart.svelte';
	import toast from '$lib/components/notifications/toast.svelte';
	import type { Product } from '$lib/types';

	const { product: pbProduct }: { product: any } = $props();

	const isInCart = $derived(!!findItem(pbProduct.id));

	// Mapeia o RecordModel do PocketBase para o tipo Product do carrinho
	const productForCart: Product = {
		id: pbProduct.id,
		codigo: pbProduct.product_id || 'N/A',
		nome: pbProduct.title,
		descricao: pbProduct.description || '',
		preco: Number(pbProduct.price || 0), // Garante que o preço seja um número
		status: pbProduct.status,
		foto_url: getImageUrl(pbProduct)
	};

	function getImageUrl(product: any) {
		if (product.images && product.images.length > 0) {
			return pb.files.getURL(product, product.images[0]);
		}
		// Fallback para um campo único de imagem, se existir
		if (product.image) {
			return pb.files.getURL(product, product.image);
		}
		return 'https://placehold.co/300x400?text=Sem+Imagem';
	}
</script>

<div class="card bg-base-100 shadow-md transition-shadow hover:shadow-lg">
	<figure class="aspect-square bg-base-200">
		<img
			src={getImageUrl(pbProduct)}
			alt={pbProduct.title}
			class="h-full w-full object-cover"
			loading="lazy"
		/>
	</figure>
	<div class="card-body p-4">
		<h2 class="card-title text-base-content">{pbProduct.title}</h2>
		<div class="badge badge-secondary">{pbProduct.status}</div>
		<div class="card-actions items-center justify-between">
			<div class="text-xl font-bold text-primary">R$ {productForCart.preco.toFixed(2)}</div>
			<button
				class="btn btn-primary btn-sm transition-transform active:scale-95"
				onclick={() => {
					addItem(productForCart);
					toast.addToast(`${productForCart.nome} foi adicionado ao carrinho!`, 'success');
				}}
				disabled={pbProduct.status === 'vendido' || isInCart}
			>
				{isInCart ? 'No Carrinho' : 'Adicionar'}
			</button>
		</div>
	</div>
</div>