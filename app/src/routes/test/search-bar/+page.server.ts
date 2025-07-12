import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import pb from '$lib/pocketbase';

export const load: PageServerLoad = async ({ url }) => {
	try {
		const searchQuery = url.searchParams.get('q') || '';

		let products = [];

		if (searchQuery) {
			// Buscar produtos que contenham o termo de busca no nome ou código
			const filter = `title ~ "${searchQuery}" || product_id ~ "${searchQuery}"`;
			const records = await pb.collection('inventory').getList(1, 50, {
				filter: filter,
				sort: '-created'
			});
			products = records.items;
		} else {
			// Carregar alguns produtos de exemplo para demonstração
			const records = await pb.collection('inventory').getList(1, 12, {
				sort: '-created'
			});
			products = records.items;
		}

		return {
			products,
			searchQuery
		};
	} catch (err) {
		console.error('Error fetching products:', err);
		throw error(500, 'Failed to fetch products');
	}
};