import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import pb from '$lib/pocketbase';

export const load: PageServerLoad = async ({ url }) => {
	try {
		const q = url.searchParams.get('q');

		console.log(`[TESTE 3.1] Buscando por: ${q || '(sem filtro)'}`);

		// Implementação exata da Fase 3.1
		const filter = ["status = 'disponível'"];
		const params: { q?: string } = {};

		if (q) {
			filter.push(`(title ~ {:q} || product_id ~ {:q})`);
			params.q = q;
		}

		const finalFilter = filter.join(' && ');
		console.log(`[TESTE 3.1] Filtro aplicado: ${finalFilter}`);
		console.log(`[TESTE 3.1] Parâmetros: ${JSON.stringify(params)}`);

		const products = await pb.collection('inventory').getFullList({
			filter: finalFilter,
			filterParams: params,
			fields: 'collectionId,id,images,title,product_id,price',
			sort: '-created'
		});

		console.log(`[TESTE 3.1] Produtos encontrados: ${products.length}`);

		// Log dos primeiros produtos para debug
		if (products.length > 0) {
			console.log(`[TESTE 3.1] Primeira entrada:`, {
				id: products[0].id,
				title: products[0].title,
				product_id: products[0].product_id,
				price: products[0].price,
				images: products[0].images,
				collectionId: products[0].collectionId
			});
		}

		// Dados de teste para demonstração
		const testScenarios = [
			{
				name: 'Sem filtro',
				description: 'Busca todos os produtos disponíveis',
				url: '/test/data-fetching',
				expected: 'Todos os produtos com status = "disponível"'
			},
			{
				name: 'Com filtro de texto',
				description: 'Busca produtos por nome ou código',
				url: '/test/data-fetching?q=camisa',
				expected: 'Produtos que contenham "camisa" no título ou código'
			},
			{
				name: 'Filtro não encontrado',
				description: 'Busca que não retorna resultados',
				url: '/test/data-fetching?q=produto-inexistente',
				expected: 'Lista vazia de produtos'
			}
		];

		return {
			q,
			products,
			testScenarios,
			filterUsed: finalFilter,
			totalProducts: products.length,
			// Dados de debug
			debug: {
				pocketbaseUrl: pb.baseURL,
				hasImages: products.filter(p => p.images && p.images.length > 0).length,
				sampleProduct: products[0] || null,
				currentPath: url.pathname
			}
		};
	} catch (err) {
		console.error('[TESTE 3.1] Erro ao buscar dados do PocketBase:', err);
		throw error(500, `Erro no teste 3.1: ${err}`);
	}
};