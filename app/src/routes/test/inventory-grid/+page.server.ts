import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import pb from '$lib/pocketbase';

export const load: PageServerLoad = async () => {
	try {
		// Carregar produtos para testar diferentes cenários do grid
		const allProducts = await pb.collection('inventory').getList(1, 50, {
			sort: '-created',
			fields: 'collectionId,id,images,title,product_id,price'
		});

		// Diferentes conjuntos de produtos para testar o grid
		const scenarios = {
			// Cenário 1: Grid completo com muitos produtos
			fullGrid: allProducts.items,

			// Cenário 2: Poucos produtos (1-3)
			fewProducts: allProducts.items.slice(0, 3),

			// Cenário 3: Um produto apenas
			singleProduct: allProducts.items.slice(0, 1),

			// Cenário 4: Nenhum produto (array vazio)
			noProducts: []
		};

		return {
			scenarios,
			totalProducts: allProducts.items.length
		};
	} catch (err) {
		console.error('Error fetching products:', err);
		throw error(500, 'Failed to fetch products');
	}
};