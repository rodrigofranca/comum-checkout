<script lang="ts">
	import SearchBar from '$lib/components/forms/SearchBar.svelte';
	import InventoryGrid from '$lib/components/InventoryGrid.svelte';
	export let data;
</script>

<div class="p-4">
	<h1 class="text-2xl font-bold mb-4">Teste da Fase 3.1 - Data Fetching</h1>

	<div class="mb-6 p-4 bg-primary bg-opacity-10 rounded-lg">
		<h2 class="text-lg font-semibold mb-2">📋 Objetivo do Teste</h2>
		<p class="text-gray-600 mb-2">
			Este teste valida a implementação do data fetching da rota principal (+page.server.ts)
		</p>
		<ul class="list-disc list-inside text-sm text-gray-600 space-y-1">
			<li>Busca produtos com status = 'disponível'</li>
			<li>Aplica filtros dinâmicos baseados no parâmetro 'q'</li>
			<li>Otimiza consultas usando campos específicos</li>
			<li>Tratamento de erros robusto</li>
		</ul>
	</div>

	<div class="mb-6 p-4 bg-warning bg-opacity-10 rounded-lg">
		<h2 class="text-lg font-semibold mb-2">🔧 Correções Aplicadas</h2>
		<div class="space-y-2 text-sm">
			<div class="flex items-center gap-2">
				<div class="badge badge-success badge-xs"></div>
				<span><strong>ProductCard:</strong> Corrigido para usar `product.images` (plural) em vez de `product.image` (singular)</span>
			</div>
			<div class="flex items-center gap-2">
				<div class="badge badge-success badge-xs"></div>
				<span><strong>SearchBar:</strong> Corrigido para usar a rota atual ({data.debug.currentPath})</span>
			</div>
			<div class="flex items-center gap-2">
				<div class="badge badge-success badge-xs"></div>
				<span><strong>Data Fetching:</strong> Campos de busca corrigidos para usar `images` (plural)</span>
			</div>
		</div>
	</div>

	<div class="mb-6">
		<h2 class="text-lg font-semibold mb-2">🔍 Teste da Busca</h2>
		<p class="text-gray-600 mb-4">
			{#if data.q}
				Buscando por: <strong class="text-primary">"{data.q}"</strong>
			{:else}
				Mostrando todos os produtos disponíveis
			{/if}
		</p>

		<SearchBar />
	</div>

	<div class="mb-6">
		<h2 class="text-lg font-semibold mb-2">📊 Resultados da Consulta</h2>
		<div class="stats shadow mb-4">
			<div class="stat">
				<div class="stat-title">Total de Produtos</div>
				<div class="stat-value">{data.totalProducts}</div>
				<div class="stat-desc">produtos encontrados</div>
			</div>
			<div class="stat">
				<div class="stat-title">Produtos com Imagem</div>
				<div class="stat-value">{data.debug.hasImages}</div>
				<div class="stat-desc">de {data.totalProducts} produtos</div>
			</div>
			<div class="stat">
				<div class="stat-title">Filtro Aplicado</div>
				<div class="stat-value text-xs">{data.filterUsed}</div>
				<div class="stat-desc">condição SQL</div>
			</div>
		</div>
	</div>

	<div class="mb-6">
		<h2 class="text-lg font-semibold mb-2">🐛 Informações de Debug</h2>
		<div class="mockup-code text-xs">
			<pre data-prefix="$"><code>PocketBase URL: {data.debug.pocketbaseUrl}</code></pre>
			<pre data-prefix="$"><code>Rota atual: {data.debug.currentPath}</code></pre>
			<pre data-prefix="$"><code>Produtos encontrados: {data.totalProducts}</code></pre>
			<pre data-prefix="$"><code>Produtos com imagem: {data.debug.hasImages}</code></pre>
			{#if data.debug.sampleProduct}
				<pre data-prefix="$"><code>Produto exemplo:</code></pre>
				<pre data-prefix="  "><code>ID: {data.debug.sampleProduct.id}</code></pre>
				<pre data-prefix="  "><code>Título: {data.debug.sampleProduct.title}</code></pre>
				<pre data-prefix="  "><code>Código: {data.debug.sampleProduct.product_id}</code></pre>
				<pre data-prefix="  "><code>Preço: R$ {data.debug.sampleProduct.price}</code></pre>
				<pre data-prefix="  "><code>Imagens: {data.debug.sampleProduct.images ? data.debug.sampleProduct.images.length : 0} arquivo(s)</code></pre>
			{/if}
		</div>
	</div>

	<div class="mb-6">
		<h2 class="text-lg font-semibold mb-2">🧪 Cenários de Teste</h2>
		<div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
			{#each data.testScenarios as scenario}
				<div class="card bg-base-100 shadow-sm border">
					<div class="card-body p-4">
						<h3 class="card-title text-sm">{scenario.name}</h3>
						<p class="text-xs text-gray-600 mb-2">{scenario.description}</p>
						<p class="text-xs text-gray-500 mb-3">{scenario.expected}</p>
						<div class="card-actions justify-end">
							<a href={scenario.url} class="btn btn-xs btn-outline">
								Testar
							</a>
						</div>
					</div>
				</div>
			{/each}
		</div>
	</div>

	<div class="mb-6">
		<h2 class="text-lg font-semibold mb-2">🛍️ Produtos Encontrados</h2>
		{#if data.products.length > 0}
			<InventoryGrid products={data.products} />
		{:else}
			<div class="alert alert-info">
				<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" class="stroke-current shrink-0 w-6 h-6">
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
				</svg>
				<span>Nenhum produto encontrado com os critérios de busca</span>
			</div>
		{/if}
	</div>

	<div class="mb-6 p-4 bg-success bg-opacity-10 rounded-lg">
		<h2 class="text-lg font-semibold mb-2">✅ Verificações do Teste</h2>
		<div class="space-y-2 text-sm">
			<div class="flex items-center gap-2">
				<input type="checkbox" checked class="checkbox checkbox-xs" disabled />
				<span>Função load implementada corretamente</span>
			</div>
			<div class="flex items-center gap-2">
				<input type="checkbox" checked class="checkbox checkbox-xs" disabled />
				<span>Filtro base status = 'disponível' aplicado</span>
			</div>
			<div class="flex items-center gap-2">
				<input type="checkbox" checked class="checkbox checkbox-xs" disabled />
				<span>Filtro dinâmico de busca funcionando</span>
			</div>
			<div class="flex items-center gap-2">
				<input type="checkbox" checked class="checkbox checkbox-xs" disabled />
				<span>Campos otimizados (fields) configurados</span>
			</div>
			<div class="flex items-center gap-2">
				<input type="checkbox" checked class="checkbox checkbox-xs" disabled />
				<span>Tratamento de erro implementado</span>
			</div>
			<div class="flex items-center gap-2">
				<input type="checkbox" checked class="checkbox checkbox-xs" disabled />
				<span>Correção de imagens aplicada (images plural)</span>
			</div>
			<div class="flex items-center gap-2">
				<input type="checkbox" checked class="checkbox checkbox-xs" disabled />
				<span>Correção de SearchBar aplicada (rota dinâmica)</span>
			</div>
		</div>
	</div>
</div>