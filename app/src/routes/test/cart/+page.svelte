<script lang="ts">
	import cart from '$lib/cart.svelte';
	import type { Product } from '$lib/types';

	// Produtos de exemplo para teste
	const testProducts: Product[] = [
		{
			id: 'prod1',
			codigo: 'PROD001',
			nome: 'Produto A',
			preco: 25.99,
			status: 'disponivel',
			foto_url: 'https://via.placeholder.com/150',
			categoria: 'Categoria A',
			descricao: 'Descrição do produto A'
		},
		{
			id: 'prod2',
			codigo: 'PROD002',
			nome: 'Produto B',
			preco: 45.50,
			status: 'disponivel',
			foto_url: 'https://via.placeholder.com/150',
			categoria: 'Categoria B',
			descricao: 'Descrição do produto B'
		},
		{
			id: 'prod3',
			codigo: 'PROD003',
			nome: 'Produto C',
			preco: 15.00,
			status: 'disponivel',
			foto_url: 'https://via.placeholder.com/150',
			categoria: 'Categoria A',
			descricao: 'Descrição do produto C'
		}
	];

	// Variáveis para logs de teste
	let testLog: string[] = [];

	function addLog(message: string) {
		testLog = [...testLog, `[${new Date().toLocaleTimeString()}] ${message}`];
	}

	function clearLog() {
		testLog = [];
	}

	// Testes das funcionalidades
	function testAddSingleItem() {
		addLog('Testando adicionar item único...');
		cart.addItem(testProducts[0]);
		addLog(`Item adicionado: ${testProducts[0].nome} - Quantidade: 1`);
		addLog(`Total do carrinho: R$ ${cart.state.total.toFixed(2)}`);
		addLog(`Itens no carrinho: ${cart.state.items.length}`);
	}

	function testAddSameItemMultipleTimes() {
		addLog('Testando adicionar o mesmo item múltiplas vezes...');
		cart.addItem(testProducts[0]);
		cart.addItem(testProducts[0]);

		const item = cart.state.items.find(i => i.product.id === testProducts[0].id);
		addLog(`Item ${testProducts[0].nome} - Quantidade: ${item?.quantity || 0}`);
		addLog(`Total do carrinho: R$ ${cart.state.total.toFixed(2)}`);
		addLog(`Itens no carrinho: ${cart.state.items.length}`);
	}

	function testAddDifferentItems() {
		addLog('Testando adicionar itens diferentes...');
		cart.addItem(testProducts[1]);
		cart.addItem(testProducts[2]);

		addLog(`Adicionados: ${testProducts[1].nome} e ${testProducts[2].nome}`);
		addLog(`Total do carrinho: R$ ${cart.state.total.toFixed(2)}`);
		addLog(`Itens no carrinho: ${cart.state.items.length}`);
	}

	function testTotalCalculation() {
		addLog('Testando cálculo do total...');

		// Calcular total esperado manualmente
		const expectedTotal = cart.state.items.reduce((sum, item) =>
			sum + (item.product.preco * item.quantity), 0
		);

		const actualTotal = cart.state.total;

		if (Math.abs(expectedTotal - actualTotal) < 0.01) {
			addLog(`SUCESSO: Cálculo do total está correto: R$ ${actualTotal.toFixed(2)}`);
		} else {
			addLog(`ERRO: Cálculo do total. Esperado: R$ ${expectedTotal.toFixed(2)}, Atual: R$ ${actualTotal.toFixed(2)}`);
		}
	}

	function runAllTests() {
		clearLog();
		addLog('Iniciando testes do módulo de carrinho...');
		addLog('');

		testAddSingleItem();
		addLog('');

		testAddSameItemMultipleTimes();
		addLog('');

		testAddDifferentItems();
		addLog('');

		testTotalCalculation();
		addLog('');

		addLog('Testes concluídos!');
	}

	function clearCart() {
		// Como não temos uma função clear implementada, vamos resetar manualmente
		cart.state.items.length = 0;
		cart.state.total = 0;
		addLog('Carrinho limpo!');
	}
</script>

<div class="container mx-auto p-8 max-w-6xl">
	<div class="mb-8">
		<h1 class="text-4xl font-bold text-base-content mb-2">Teste do Módulo de Carrinho</h1>
		<p class="text-base-content/70 text-lg">Validação das funcionalidades do sistema de carrinho</p>
	</div>

	<!-- Botões de teste -->
	<div class="mb-8">
		<h2 class="text-2xl font-semibold mb-4 text-base-content">Controles de Teste</h2>
		<div class="flex flex-wrap gap-3">
			<button class="btn btn-primary btn-lg" onclick={runAllTests}>
				🚀 Executar Todos os Testes
			</button>
			<button class="btn btn-secondary btn-lg" onclick={clearCart}>
				🗑️ Limpar Carrinho
			</button>
			<button class="btn btn-outline btn-lg" onclick={clearLog}>
				📝 Limpar Log
			</button>
		</div>
	</div>

	<!-- Estado atual do carrinho -->
	<div class="mb-8">
		<h2 class="text-2xl font-semibold mb-4 text-base-content">Estado Atual do Carrinho</h2>
		<div class="bg-base-200 p-6 rounded-xl shadow-sm">
			<div class="grid grid-cols-1 md:grid-cols-2 gap-6">
				<div class="text-center md:text-left">
					<h3 class="font-semibold text-sm uppercase tracking-wide text-base-content/60 mb-2">
						Total de Itens
					</h3>
					<p class="text-3xl font-bold text-primary">{cart.state.items.length}</p>
				</div>
				<div class="text-center md:text-left">
					<h3 class="font-semibold text-sm uppercase tracking-wide text-base-content/60 mb-2">
						Total do Carrinho
					</h3>
					<p class="text-3xl font-bold text-success">R$ {cart.state.total.toFixed(2)}</p>
				</div>
			</div>
		</div>
	</div>

	<!-- Itens do carrinho -->
	{#if cart.state.items.length > 0}
		<div class="mb-8">
			<h2 class="text-2xl font-semibold mb-4 text-base-content">Itens no Carrinho</h2>
			<div class="space-y-3">
				{#each cart.state.items as item}
					<div class="bg-base-100 p-4 rounded-lg shadow-sm border border-base-300 hover:shadow-md transition-shadow">
						<div class="flex justify-between items-center">
							<div>
								<h3 class="font-semibold text-lg text-base-content">{item.product.nome}</h3>
								<p class="text-base-content/60 text-sm">{item.product.codigo}</p>
							</div>
							<div class="text-right">
								<div class="font-bold text-lg text-primary">Qtd: {item.quantity}</div>
								<div class="text-sm text-base-content/70">
									R$ {item.product.preco.toFixed(2)} cada
								</div>
								<div class="font-semibold text-lg text-success">
									Subtotal: R$ {(item.product.preco * item.quantity).toFixed(2)}
								</div>
							</div>
						</div>
					</div>
				{/each}
			</div>
		</div>
	{/if}

	<!-- Produtos de teste -->
	<div class="mb-8">
		<h2 class="text-2xl font-semibold mb-4 text-base-content">Produtos de Teste</h2>
		<div class="grid grid-cols-1 md:grid-cols-3 gap-6">
			{#each testProducts as product}
				<div class="card bg-base-100 shadow-md hover:shadow-lg transition-shadow border border-base-300">
					<div class="card-body p-6">
						<h3 class="card-title text-xl mb-2">{product.nome}</h3>
						<p class="text-base-content/60 text-sm mb-3">{product.codigo}</p>
						<p class="text-2xl font-bold text-success mb-4">R$ {product.preco.toFixed(2)}</p>
						<div class="card-actions justify-end">
							<button
								class="btn btn-primary btn-wide"
								onclick={() => cart.addItem(product)}
							>
								➕ Adicionar ao Carrinho
							</button>
						</div>
					</div>
				</div>
			{/each}
		</div>
	</div>

	<!-- Log de testes -->
	<div class="mb-8">
		<h2 class="text-2xl font-semibold mb-4 text-base-content">Log de Testes</h2>
		<div class="bg-base-300 p-6 rounded-xl shadow-sm max-h-96 overflow-y-auto">
			{#if testLog.length === 0}
				<p class="text-base-content/60 italic text-center py-8">Nenhum teste executado ainda...</p>
			{:else}
				<div class="space-y-1">
					{#each testLog as log}
						<div class="font-mono text-sm text-base-content/90 py-1 px-2 rounded {log.includes('SUCESSO') ? 'bg-success/10 text-success' : log.includes('ERRO') ? 'bg-error/10 text-error' : ''}">{log}</div>
					{/each}
				</div>
			{/if}
		</div>
	</div>
</div>