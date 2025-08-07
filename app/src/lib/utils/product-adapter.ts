import type { Product } from '$lib/types';

/**
 * Adapta um produto da estrutura PocketBase real para a estrutura esperada pelo sistema
 */
export function adaptProduct(pbProduct: any): Product {
	return {
		// Campos principais da nova estrutura
		id: pbProduct.id,
		product_id: pbProduct.product_id,
		title: pbProduct.title,
		price: pbProduct.price,
		status: pbProduct.status,
		images: pbProduct.images || [],
		category: pbProduct.category,
		description: pbProduct.description,
		brand: pbProduct.brand,
		size: pbProduct.size,
		
		// Campos legacy para compatibilidade
		codigo: pbProduct.product_id,
		nome: pbProduct.title,
		preco: pbProduct.price,
		foto_url: pbProduct.images?.[0] ? `${pbProduct.collectionId}/${pbProduct.id}/${pbProduct.images[0]}` : undefined,
		categoria: pbProduct.category,
		descricao: pbProduct.description
	};
}

/**
 * Obtém o código/SKU do produto de forma compatível
 */
export function getProductCode(product: Product): string {
	return product.product_id || product.codigo || product.id;
}

/**
 * Obtém o nome do produto de forma compatível
 */
export function getProductName(product: Product): string {
	return product.title || product.nome || 'Produto sem nome';
}

/**
 * Obtém o preço do produto de forma compatível
 */
export function getProductPrice(product: Product): number {
	return product.price || product.preco || 0;
}

/**
 * Obtém a primeira imagem do produto de forma compatível
 */
export function getProductImage(product: Product): string | undefined {
	// Se tem images array, usar a primeira
	if (product.images && product.images.length > 0) {
		return product.images[0];
	}
	// Senão usar foto_url legacy
	return product.foto_url;
}

/**
 * Verifica se o produto está disponível para venda
 */
export function isProductAvailable(product: Product): boolean {
	return product.status === 'disponível';
}