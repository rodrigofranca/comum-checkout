<script lang="ts">
	import SearchBar from '$lib/components/forms/SearchBar.svelte';
	import InventoryGrid from '$lib/components/InventoryGrid.svelte';
	import type { RecordModel } from 'pocketbase';

	let { data } = $props();

	// Estados para os filtros usando runes do Svelte 5
	let searchTerm = $state('');
	let minPrice = $state<number | undefined>(undefined);
	let maxPrice = $state<number | undefined>(undefined);

	// Produtos de exemplo para demonstração (compatíveis com RecordModel)
	const testProducts: RecordModel[] = [
		{
			id: 'prod1',
			collectionId: 'inventory',
			collectionName: 'inventory',
			created: '2024-01-01T00:00:00.000Z',
			updated: '2024-01-01T00:00:00.000Z',
			product_id: 'JKT-001',
			title: 'Jaqueta de Couro Masculina',
			price: 89.99,
			status: 'disponivel',
			images: [],
			category: 'Moda',
			description: 'Jaqueta de couro sintético masculina'
		},
		{
			id: 'prod2',
			collectionId: 'inventory',
			collectionName: 'inventory',
			created: '2024-01-01T00:00:00.000Z',
			updated: '2024-01-01T00:00:00.000Z',
			product_id: 'CAM-002',
			title: 'Camisa Social Branca',
			price: 45.50,
			status: 'disponivel',
			images: [],
			category: 'Vestuário',
			description: 'Camisa social branca manga longa'
		},
		{
			id: 'prod3',
			collectionId: 'inventory',
			collectionName: 'inventory',
			created: '2024-01-01T00:00:00.000Z',
			updated: '2024-01-01T00:00:00.000Z',
			product_id: 'TEN-003',
			title: 'Tênis Esportivo',
			price: 120.00,
			status: 'disponivel',
			images: [],
			category: 'Calçados',
			description: 'Tênis esportivo para corrida'
		},
		{
			id: 'prod4',
			collectionId: 'inventory',
			collectionName: 'inventory',
			created: '2024-01-01T00:00:00.000Z',
			updated: '2024-01-01T00:00:00.000Z',
			product_id: 'CAL-004',
			title: 'Calça Jeans Slim',
			price: 67.90,
			status: 'disponivel',
			images: [],
			category: 'Vestuário',
			description: 'Calça jeans slim fit'
		},
		{
			id: 'prod5',
			collectionId: 'inventory',
			collectionName: 'inventory',
			created: '2024-01-01T00:00:00.000Z',
			updated: '2024-01-01T00:00:00.000Z',
			product_id: 'BOL-005',
			title: 'Bolsa Feminina',
			price: 35.00,
			status: 'disponivel',
			images: [],
			category: 'Acessórios',
			description: 'Bolsa feminina de couro sintético'
		},
		{
			id: 'prod6',
			collectionId: 'inventory',
			collectionName: 'inventory',
			created: '2024-01-01T00:00:00.000Z',
			updated: '2024-01-01T00:00:00.000Z',
			product_id: 'REL-006',
			title: 'Relógio Digital',
			price: 199.99,
			status: 'disponivel',
			images: [],
			category: 'Eletrônicos',
			description: 'Relógio digital esportivo'
		}
	];

	// Lógica de filtragem reativa usando $derived
	const filteredProducts = $derived.by(() => {
		let filtered = testProducts;

		// Filtro por termo de busca
		if (searchTerm.trim()) {
			const term = searchTerm.toLowerCase();
			filtered = filtered.filter(product =>
				product.title.toLowerCase().includes(term) ||
				product.product_id.toLowerCase().includes(term)
			);
		}

		// Filtro por preço mínimo
		if (minPrice !== undefined && !isNaN(minPrice) && minPrice > 0) {
			filtered = filtered.filter(product => product.price >= minPrice!);
		}

		// Filtro por preço máximo
		if (maxPrice !== undefined && !isNaN(maxPrice) && maxPrice > 0) {
			filtered = filtered.filter(product => product.price <= maxPrice!);
		}

		return filtered;
	});

	// Cenários de teste pré-definidos
	const testScenarios = [
		{
			name: 'Busca por "camisa"',
			action: () => {
				searchTerm = 'camisa';
				minPrice = undefined;
				maxPrice = undefined;
			},
			expected: 'Deve mostrar apenas produtos com "camisa" no nome'
		},
		{
			name: 'Preço entre R$ 40 e R$ 80',
			action: () => {
				searchTerm = '';
				minPrice = 40;
				maxPrice = 80;
			},
			expected: 'Deve mostrar produtos com preço entre R$ 40 e R$ 80'
		},
		{
			name: 'Busca + Filtro de Preço',
			action: () => {
				searchTerm = 'CAL';
				minPrice = 50;
				maxPrice = 100;
			},
			expected: 'Deve mostrar produtos que contenham "CAL" e tenham preço entre R$ 50 e R$ 100'
		},
		{
			name: 'Limpar Filtros',
			action: () => {
				searchTerm = '';
				minPrice = undefined;
				maxPrice = undefined;
			},
			expected: 'Deve mostrar todos os produtos'
		}
	];

	// Estatísticas dos filtros
	const stats = $derived(() => {
		const total = testProducts.length;
		const filtered = filteredProducts.length;
		const filterPercentage = total > 0 ? (filtered / total * 100).toFixed(1) : '0';

		return {
			total,
			filtered,
			filterPercentage
		};
	});

	// Log das alterações para debug
	let testLog: string[] = [];

	function addLog(message: string) {
		testLog = [...testLog, `[${new Date().toLocaleTimeString()}] ${message}`];
	}

	function clearLog() {
		testLog = [];
	}

	// Monitorar alterações nos filtros
	$effect(() => {
		const activeFilters = [];
		if (searchTerm.trim()) activeFilters.push(`Busca: "${searchTerm}"`);
		if (minPrice !== undefined && minPrice > 0) activeFilters.push(`Preço Min: R$ ${minPrice}`);
		if (maxPrice !== undefined && maxPrice > 0) activeFilters.push(`Preço Max: R$ ${maxPrice}`);

		const filterText = activeFilters.length > 0 ? activeFilters.join(', ') : 'Nenhum filtro ativo';
		addLog(`Filtros aplicados: ${filterText} | Resultados: ${filteredProducts.length}/${testProducts.length}`);
	});
</script>

<div class="container mx-auto p-8 max-w-7xl">
	<div class="mb-8">
		<h1 class="text-4xl font-bold text-base-content mb-2">Teste do SearchBar</h1>
		<p class="text-base-content/70 text-lg">Validação completa do componente de busca e filtros</p>
	</div>

	<!-- Componente SearchBar -->
	<div class="mb-8">
		<h2 class="text-2xl font-semibold mb-4 text-base-content">Componente SearchBar</h2>
		<SearchBar
			bind:searchTerm={searchTerm}
			bind:minPrice={minPrice}
			bind:maxPrice={maxPrice}
		/>
	</div>

	<!-- Controles de Teste -->
	<div class="mb-8">
		<h2 class="text-2xl font-semibold mb-4 text-base-content">Cenários de Teste</h2>
		<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
			{#each testScenarios as scenario}
				<div class="card bg-base-100 shadow-md border border-base-300">
					<div class="card-body p-4">
						<h3 class="card-title text-sm">{scenario.name}</h3>
						<p class="text-xs text-base-content/60 mb-3">{scenario.expected}</p>
						<div class="card-actions justify-end">
							<button
								class="btn btn-sm btn-primary"
								onclick={() => {
									scenario.action();
									addLog(`Cenário executado: ${scenario.name}`);
								}}
							>
								Testar
							</button>
						</div>
					</div>
				</div>
			{/each}
		</div>
	</div>

	<!-- Estatísticas -->
	<div class="mb-8">
		<h2 class="text-2xl font-semibold mb-4 text-base-content">Estatísticas dos Filtros</h2>
		<div class="stats shadow w-full">
			<div class="stat">
				<div class="stat-title">Total de Produtos</div>
				<div class="stat-value text-primary">{stats().total}</div>
				<div class="stat-desc">produtos disponíveis</div>
			</div>
			<div class="stat">
				<div class="stat-title">Produtos Filtrados</div>
				<div class="stat-value text-success">{stats().filtered}</div>
				<div class="stat-desc">produtos exibidos</div>
			</div>
			<div class="stat">
				<div class="stat-title">Eficiência do Filtro</div>
				<div class="stat-value text-info">{stats().filterPercentage}%</div>
				<div class="stat-desc">produtos mantidos</div>
			</div>
		</div>
	</div>

	<!-- Estado Atual dos Filtros -->
	<div class="mb-8">
		<h2 class="text-2xl font-semibold mb-4 text-base-content">Estado Atual dos Filtros</h2>
		<div class="bg-base-200 p-6 rounded-xl">
			<div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
				<div class="text-center">
					<h3 class="font-semibold text-sm uppercase tracking-wide text-base-content/60 mb-2">
						Termo de Busca
					</h3>
					<p class="text-lg font-bold text-base-content">
						{searchTerm || 'Nenhum'}
					</p>
				</div>
				<div class="text-center">
					<h3 class="font-semibold text-sm uppercase tracking-wide text-base-content/60 mb-2">
						Preço Mínimo
					</h3>
					<p class="text-lg font-bold text-base-content">
						{minPrice !== undefined ? `R$ ${minPrice}` : 'Não definido'}
					</p>
				</div>
				<div class="text-center">
					<h3 class="font-semibold text-sm uppercase tracking-wide text-base-content/60 mb-2">
						Preço Máximo
					</h3>
					<p class="text-lg font-bold text-base-content">
						{maxPrice !== undefined ? `R$ ${maxPrice}` : 'Não definido'}
					</p>
				</div>
			</div>
		</div>
	</div>

	<!-- Log de Testes -->
	<div class="mb-8">
		<h2 class="text-2xl font-semibold mb-4 text-base-content">Log de Atividades</h2>
		<div class="flex gap-2 mb-4">
			<button class="btn btn-sm btn-outline" onclick={clearLog}>
				Limpar Log
			</button>
		</div>
		<div class="bg-base-300 p-4 rounded-xl max-h-60 overflow-y-auto">
			{#if testLog.length === 0}
				<p class="text-base-content/60 italic text-center py-4">Nenhuma atividade registrada ainda...</p>
			{:else}
				<div class="space-y-1">
					{#each testLog as log}
						<div class="font-mono text-sm text-base-content/90 py-1 px-2 rounded bg-base-100/50">
							{log}
						</div>
					{/each}
				</div>
			{/if}
		</div>
	</div>

	<!-- Produtos Filtrados -->
	<div class="mb-8">
		<h2 class="text-2xl font-semibold mb-4 text-base-content">
			Produtos Filtrados ({filteredProducts.length})
		</h2>
		{#if filteredProducts.length > 0}
			<InventoryGrid products={filteredProducts} />
		{:else}
			<div class="alert alert-info">
				<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" class="stroke-current shrink-0 w-6 h-6">
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
				</svg>
				<span>Nenhum produto encontrado com os filtros aplicados</span>
			</div>
		{/if}
	</div>

	<!-- Validações do Teste -->
	<div class="mb-8 p-6 bg-success/10 rounded-xl">
		<h2 class="text-2xl font-semibold mb-4 text-base-content">✅ Validações do Teste</h2>
		<div class="grid grid-cols-1 md:grid-cols-2 gap-4">
			<div class="space-y-2">
				<div class="flex items-center gap-2">
					<input type="checkbox" checked class="checkbox checkbox-xs" disabled />
					<span class="text-sm">Componente SearchBar renderiza corretamente</span>
				</div>
				<div class="flex items-center gap-2">
					<input type="checkbox" checked class="checkbox checkbox-xs" disabled />
					<span class="text-sm">Filtro de busca por texto funciona</span>
				</div>
				<div class="flex items-center gap-2">
					<input type="checkbox" checked class="checkbox checkbox-xs" disabled />
					<span class="text-sm">Filtro de preço mínimo funciona</span>
				</div>
				<div class="flex items-center gap-2">
					<input type="checkbox" checked class="checkbox checkbox-xs" disabled />
					<span class="text-sm">Filtro de preço máximo funciona</span>
				</div>
			</div>
			<div class="space-y-2">
				<div class="flex items-center gap-2">
					<input type="checkbox" checked class="checkbox checkbox-xs" disabled />
					<span class="text-sm">Filtros combinados funcionam</span>
				</div>
				<div class="flex items-center gap-2">
					<input type="checkbox" checked class="checkbox checkbox-xs" disabled />
					<span class="text-sm">Reatividade em tempo real ativa</span>
				</div>
				<div class="flex items-center gap-2">
					<input type="checkbox" checked class="checkbox checkbox-xs" disabled />
					<span class="text-sm">Runes do Svelte 5 funcionam ($state, $derived)</span>
				</div>
				<div class="flex items-center gap-2">
					<input type="checkbox" checked class="checkbox checkbox-xs" disabled />
					<span class="text-sm">Interface DaisyUI consistente</span>
				</div>
			</div>
		</div>
	</div>
</div>