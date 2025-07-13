<script lang="ts">
	import '../app.css';
	import CartFloating from '$lib/components/CartFloating.svelte';
</script>

<div class="flex min-h-screen flex-col">
	<header class="navbar bg-base-100 shadow-lg">
		<div class="flex-1">
			<a href="/" class="btn btn-ghost text-xl">
				Tropical<span class="text-primary">POS</span>
			</a>
		</div>
		<div class="flex-none"><!-- O contador do carrinho será adicionado aqui posteriormente --></div>
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

<CartFloating />