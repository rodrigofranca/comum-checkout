import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import pb from '$lib/pocketbase';
import { adaptProduct } from '$lib/utils/product-adapter';

export const load: PageServerLoad = async ({ url }) => {
	try {
		// Carregar todo o inventory disponível inicialmente
		const filter = "status = 'disponível'";

		const pbProducts = await pb.collection('inventory').getFullList({
			filter: filter,
			fields: 'id,product_id,title,price,status,images,category,description,brand,size,collectionId',
			sort: '-created'
		});

		// Adaptar produtos para estrutura esperada
		const products = pbProducts.map(adaptProduct);

		return {
			products
		};
	} catch (err) {
		console.error('Erro ao buscar dados do PocketBase:', err);
		throw error(500, 'Failed to fetch products');
	}
};