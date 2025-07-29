<script lang="ts">
	import '../app.css';
	import CartFloatingButton from '$lib/components/cart/CartFloatingButton.svelte';
	import CartView from '$lib/components/cart/CartView.svelte';
	import Toast from '$lib/components/notifications/Toast.svelte';
	import { fly } from 'svelte/transition';

	let showCart = $state(false);

	function closeCart() {
		showCart = false;
	}
</script>

<div class="drawer drawer-end">
	<input id="cart-drawer" type="checkbox" class="drawer-toggle" bind:checked={showCart} />
	<div class="drawer-content flex min-h-screen flex-col">
		<header class="navbar bg-base-100 shadow-lg">
			<div class="flex-1">
				<a href="/" class="btn btn-ghost text-xl">
					Tropical<span class="text-primary">POS</span>
				</a>
			</div>
			<div class="flex-none" />
		</header>

		<main class="flex-grow">
			<div class="container mx-auto p-4">
				<slot />
			</div>
		</main>

		<footer class="footer footer-center bg-base-300 p-4 text-base-content">
			<aside>
				<p>Copyright © 2024 - Todos os direitos reservados</p>
			</aside>
		</footer>
	</div>
	{#if showCart}
		<div class="drawer-side" style="position: fixed; top: 0; right: 0; height: 100%;">
			<label
				for="cart-drawer"
				aria-label="close sidebar"
				class="drawer-overlay"
				onclick={closeCart}
			></label>
			<div transition:fly={{ duration: 250, x: '100%' }} class="h-full">
				<CartView on:close={closeCart} />
			</div>
		</div>
	{/if}
</div>

<CartFloatingButton on:toggle={() => (showCart = !showCart)} />
<Toast />