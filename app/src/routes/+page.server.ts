import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import pb from '$lib/pocketbase';

export const load: PageServerLoad = async ({ url }) => {
	try {
		// Carregar todo o inventory disponível inicialmente
		const filter = "status = 'disponível'";

		const products = await pb.collection('inventory').getFullList({
			filter: filter,
			fields: 'collectionId,id,images,title,product_id,price',
			sort: '-created'
		});

		return {
			products
		};
	} catch (err) {
		console.error('Erro ao buscar dados do PocketBase:', err);
		throw error(500, 'Failed to fetch products');
	}
};