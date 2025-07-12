<script lang="ts">
	import { page } from '$app/stores';

	let searchQuery = $page.url.searchParams.get('q') ?? '';

	// Usa a rota atual em vez de sempre redirecionar para '/'
	$: currentPath = $page.url.pathname;
</script>

<div class="mb-8">
	<form action={currentPath} method="GET" class="join w-full">
		<input
			type="text"
			name="q"
			bind:value={searchQuery}
			placeholder="Buscar por nome ou código..."
			class="input input-bordered join-item w-full"
		/>
		<button type="submit" class="btn btn-primary join-item">
			<svg
				xmlns="http://www.w3.org/2000/svg"
				class="h-6 w-6"
				fill="none"
				viewBox="0 0 24 24"
				stroke="currentColor"
			>
				<path
					stroke-linecap="round"
					stroke-linejoin="round"
					stroke-width="2"
					d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
				/>
			</svg>
			Buscar
		</button>
	</form>
</div>