import PocketBase from 'pocketbase';
import { config } from './config';
import type { CartItem, Sale } from './types';

const pb = new PocketBase(config.pocketbaseUrl);

// Autenticar automaticamente como admin quando necessário
async function ensureAdminAuth() {
	if (!pb.authStore.isValid || pb.authStore.model?.collectionId !== 'pbc_3142635823') {
		try {
			await pb.admins.authWithPassword('rodrigofranca@gmail.com', 'ac258vbn');
		} catch (error) {
			console.error('Erro na autenticação admin:', error);
			throw error;
		}
	}
}

/**
 * Atualiza o status de múltiplos itens do inventário para "vendido"
 * @param items - Array de itens do carrinho que foram vendidos
 * @returns Promise com resultado da operação
 */
export async function markItemsAsSold(items: CartItem[]): Promise<{
	success: boolean;
	errors: string[];
	updatedCount: number;
}> {
	const errors: string[] = [];
	let updatedCount = 0;

	// Garantir autenticação antes de atualizar
	try {
		await ensureAdminAuth();
	} catch (error) {
		return {
			success: false,
			errors: ['Erro na autenticação: ' + (error instanceof Error ? error.message : 'Erro desconhecido')],
			updatedCount: 0
		};
	}

	for (const item of items) {
		try {
			await pb.collection('inventory').update(item.product.id, {
				status: 'vendido'
			});
			updatedCount++;
		} catch (error) {
			const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido';
			const productCode = item.product.product_id || item.product.codigo || item.product.id;
			errors.push(`Erro ao marcar item ${productCode} como vendido: ${errorMessage}`);
		}
	}

	return {
		success: errors.length === 0,
		errors,
		updatedCount
	};
}

/**
 * Salva uma venda na coleção sales do PocketBase
 */
export async function saveSale(sale: Omit<Sale, 'id'>): Promise<{
	success: boolean;
	saleId?: string;
	error?: string;
}> {
	try {
		// Garantir autenticação antes de salvar
		await ensureAdminAuth();
		
		const result = await pb.collection('sales').create(sale);
		
		return {
			success: true,
			saleId: result.id
		};
	} catch (error) {
		const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido';
		console.error('Erro ao salvar venda:', error);
		
		return {
			success: false,
			error: errorMessage
		};
	}
}

export default pb;