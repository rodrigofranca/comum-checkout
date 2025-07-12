import type { PageServerLoad } from './$types';
import pb from '$lib/pocketbase';

export const load: PageServerLoad = async ({ url }) => {
	const q = url.searchParams.get('q');

	console.log(`Buscando por: ${q || '...'}`);

	try {
		const filter = ["status = 'disponível'"];
		const params: { q?: string } = {};

		if (q) {
			filter.push(`(title ~ {:q} || product_id ~ {:q})`);
			params.q = q;
		}

		const products = await pb.collection('inventory').getFullList({
			filter: filter.join(' && '),
			filterParams: params,
			fields: 'collectionId,id,images,title,product_id,price',
			sort: '-created'
		});

		return {
			q,
			products
		};
	} catch (err) {
		console.error('Erro ao buscar dados do PocketBase:', err);
		return {
			q,
			products: []
		};
	}
};