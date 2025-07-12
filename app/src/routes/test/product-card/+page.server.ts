
import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import pb from '$lib/pocketbase';

export const load: PageServerLoad = async () => {
	try {
		const product = await pb.collection('inventory').getFirstListItem("product_id='skd-2149s9'", {
			fields: 'collectionId,id,images,title,product_id,price'
		});
		return {
			product
		};
	} catch (err) {
		console.error('Error fetching product:', err);
		throw error(500, 'Failed to fetch product');
	}
};