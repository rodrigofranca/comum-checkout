import type { Cart, Product } from '$lib/types';

const cart = $state<Cart>({ items: [], total: 0 });

function recalculateTotal() {
	cart.total = cart.items.reduce((sum, item) => sum + item.product.preco * item.quantity, 0);
}

function addItem(product: Product) {
	const existingItem = cart.items.find((item) => item.product.id === product.id);

	if (existingItem) {
		existingItem.quantity++;
	} else {
		cart.items.push({ product, quantity: 1 });
	}
	recalculateTotal();
}

export default {
	get state() {
		return cart;
	},
	addItem
};