import type { Product, CartItem } from '$lib/types';

export const items = $state<CartItem[]>([]);

export const discount = $state({
	value: 0,
	type: 'fixed' as 'fixed' | 'percentage',
	percentage: 0
});

// Estado derivado para o subtotal (soma dos itens sem desconto)
const subtotal = $derived(
	items.reduce((sum, item) => sum + Number(item.product.preco || 0) * item.quantity, 0)
);

// Estado derivado para o total (subtotal - desconto)
const total = $derived(Math.max(0, subtotal - discount.value));

export function addItem(product: Product) {
	// Garante que o preço seja um número
	const numericPrice = Number(product.preco);
	const productWithNumericPrice = {
		...product,
		preco: isNaN(numericPrice) ? 0 : numericPrice
	};

	const existingItem = items.find((item) => item.product.id === productWithNumericPrice.id);

	if (existingItem) {
		existingItem.quantity++;
	} else {
		items.push({ product: productWithNumericPrice, quantity: 1 });
	}
}

export function removeItem(productId: string) {
	const itemIndex = items.findIndex((item) => item.product.id === productId);
	if (itemIndex !== -1) {
		items.splice(itemIndex, 1);
	}
}

export function updateItemQuantity(productId: string, quantity: number) {
	const item = items.find((item) => item.product.id === productId);
	if (item) {
		if (quantity <= 0) {
			removeItem(productId);
		} else {
			item.quantity = quantity;
		}
	}
}

export function clearCart() {
	items.length = 0;
	discount.value = 0;
	discount.type = 'fixed';
	discount.percentage = 0;
}

export function findItem(productId: string) {
	return items.find((item) => item.product.id === productId);
}

function calculateDiscount(
	value: number,
	type: 'fixed' | 'percentage',
	currentSubtotal: number
): number {
	if (type === 'fixed') {
		// Garante que o desconto não seja maior que o subtotal nem menor que zero
		return Math.min(Math.max(0, value), currentSubtotal);
	} else {
		// Garante que a porcentagem esteja entre 0 e 100
		const percentage = Math.min(Math.max(0, value), 100);
		discount.percentage = percentage; // Armazena a porcentagem bruta
		return (currentSubtotal * percentage) / 100;
	}
}

export function applyDiscount(value: number, type: 'fixed' | 'percentage' | undefined = undefined) {
	const finalType = type ?? discount.type;
	if (finalType === 'fixed') {
		discount.percentage = 0; // Zera a porcentagem se o desconto for fixo
	}
	discount.value = calculateDiscount(value, finalType, subtotal);
	discount.type = finalType;
}

export function setDiscountType(type: 'fixed' | 'percentage') {
	discount.type = type;
	discount.value = 0; // Reseta o desconto ao mudar o tipo
	discount.percentage = 0; // Reseta a porcentagem ao mudar o tipo
}

// Expor valores derivados através de funções
export function getSubtotal() {
	return subtotal;
}

export function getTotal() {
	return total;
}