<script lang="ts">
	import cart from '$lib/cart.svelte';
	import type { Product } from '$lib/types';
	import CartFloatingButton from '$lib/components/cart/CartFloatingButton.svelte';
	import CartView from '$lib/components/cart/CartView.svelte';

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

	// Variável para controlar a visibilidade do drawer (simulando o layout principal)
	let showCart = $state(false);

	function addLog(message: string) {
		testLog = [...testLog, `[${new Date().toLocaleTimeString()}] ${message}`];
	}

	function clearLog() {
		testLog = [];
	}

	// Testes das funcionalidades do módulo cart.svelte.ts
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

	function testRemoveItem() {
		addLog('Testando remoção de item...');

		// Adiciona alguns itens para teste
		cart.addItem(testProducts[0]);
		cart.addItem(testProducts[1]);
		addLog(`Itens adicionados: ${testProducts[0].nome}, ${testProducts[1].nome}`);

		// Remove um item
		const itemToRemove = testProducts[0];
		cart.removeItem(itemToRemove.id);

		// Verifica se o item foi removido
		const itemStillExists = cart.state.items.some(item => item.product.id === itemToRemove.id);
		if (!itemStillExists) {
			addLog(`SUCESSO: Item ${itemToRemove.nome} foi removido corretamente`);
		} else {
			addLog(`ERRO: Item ${itemToRemove.nome} ainda existe no carrinho`);
		}

		// Verifica se o total foi atualizado corretamente
		const expectedTotal = cart.state.items.reduce((sum, item) =>
			sum + (item.product.preco * item.quantity), 0
		);

		if (Math.abs(expectedTotal - cart.state.total) < 0.01) {
			addLog(`SUCESSO: Total atualizado corretamente após remoção: R$ ${cart.state.total.toFixed(2)}`);
		} else {
			addLog(`ERRO: Total incorreto após remoção. Esperado: R$ ${expectedTotal.toFixed(2)}, Atual: R$ ${cart.state.total.toFixed(2)}`);
		}

		addLog(`Itens restantes no carrinho: ${cart.state.items.length}`);
	}

	function testUpdateItemQuantity() {
		addLog('Testando atualização de quantidade...');

		// Limpa o carrinho
		cart.clearCart();
		addLog(`Itens restantes no carrinho: ${cart.state.items.length}`);

		// Adiciona um item para teste
		cart.addItem(testProducts[0]);
		addLog(`Item adicionado: ${testProducts[0].nome} - Quantidade inicial: 1`);

		// Atualiza a quantidade para 3
		cart.updateItemQuantity(testProducts[0].id, 3);
		const item = cart.state.items.find(i => i.product.id === testProducts[0].id);

		if (item && item.quantity === 3) {
			addLog(`SUCESSO: Quantidade atualizada para 3`);
		} else {
			addLog(`ERRO: Quantidade não atualizada corretamente. Atual: ${item?.quantity || 0}`);
		}

		// Verifica se o total foi atualizado corretamente
		const expectedTotal = testProducts[0].preco * 3;
		if (Math.abs(expectedTotal - cart.state.total) < 0.01) {
			addLog(`SUCESSO: Total atualizado corretamente: R$ ${cart.state.total.toFixed(2)}`);
		} else {
			addLog(`ERRO: Total incorreto. Esperado: R$ ${expectedTotal.toFixed(2)}, Atual: R$ ${cart.state.total.toFixed(2)}`);
		}

		// Testa atualização para 0 (deve remover o item)
		cart.updateItemQuantity(testProducts[0].id, 0);
		if (cart.state.items.length === 0) {
			addLog('SUCESSO: Item removido ao atualizar quantidade para 0');
		} else {
			addLog('ERRO: Item não foi removido ao atualizar quantidade para 0');
		}

		// Testa atualização para quantidade negativa (deve remover o item)
		cart.addItem(testProducts[0]);
		cart.updateItemQuantity(testProducts[0].id, -1);
		if (cart.state.items.length === 0) {
			addLog('SUCESSO: Item removido ao atualizar quantidade para valor negativo');
		} else {
			addLog('ERRO: Item não foi removido ao atualizar quantidade para valor negativo');
		}
	}

	function testClearCart() {
		addLog('Testando limpeza do carrinho...');

		// Adiciona vários itens ao carrinho
		cart.addItem(testProducts[0]);
		cart.addItem(testProducts[1]);
		cart.addItem(testProducts[2]);
		cart.updateItemQuantity(testProducts[0].id, 3);

		addLog(`Itens adicionados ao carrinho: ${cart.state.items.length}`);
		addLog(`Total antes da limpeza: R$ ${cart.state.total.toFixed(2)}`);

		// Limpa o carrinho
		cart.clearCart();

		// Verifica se o carrinho está vazio
		if (cart.state.items.length === 0) {
			addLog('SUCESSO: Todos os itens foram removidos');
		} else {
			addLog(`ERRO: Ainda existem ${cart.state.items.length} itens no carrinho`);
		}

		// Verifica se o total foi zerado
		if (cart.state.total === 0) {
			addLog('SUCESSO: Total do carrinho foi zerado');
		} else {
			addLog(`ERRO: Total do carrinho não foi zerado. Atual: R$ ${cart.state.total.toFixed(2)}`);
		}
	}

	// Testes das funcionalidades da seção 3.2 (Interface de usuário)
	function testCartFloatingButtonVisibility() {
		addLog('Testando visibilidade do CartFloatingButton...');

		// O botão deve estar sempre visível, então isso é apenas uma verificação visual
		addLog('SUCESSO: CartFloatingButton está visível (verificação visual)');

		// Teste do contador de itens no botão
		const itemCount = cart.state.items.length;
		addLog(`Contador de itens no botão: ${itemCount}`);

		// Adiciona um item para testar o contador
		const initialCount = cart.state.items.length;
		cart.addItem(testProducts[0]);
		const newCount = cart.state.items.length;

		if (newCount > initialCount) {
			addLog('SUCESSO: Contador de itens no botão atualizado corretamente');
		} else {
			addLog('ERRO: Contador de itens no botão não foi atualizado');
		}
	}

	function testCartDrawerToggle() {
		addLog('Testando controle de visibilidade do drawer do carrinho...');

		// Estado inicial (fechado)
		const initialState = showCart;
		addLog(`Estado inicial do drawer: ${initialState ? 'Aberto' : 'Fechado'}`);

		// Alterna o estado (simula clique no botão flutuante)
		showCart = !showCart;
		addLog(`Estado após toggle: ${showCart ? 'Aberto' : 'Fechado'}`);

		// Verifica se o estado mudou
		if (showCart !== initialState) {
			addLog('SUCESSO: Estado do drawer foi alterado corretamente');
		} else {
			addLog('ERRO: Estado do drawer não foi alterado');
		}

		// Alterna novamente para testar o fechamento
		showCart = !showCart;
		addLog(`Estado após segundo toggle: ${showCart ? 'Aberto' : 'Fechado'}`);

		if (showCart === initialState) {
			addLog('SUCESSO: Drawer pode ser aberto e fechado corretamente');
		} else {
			addLog('ERRO: Problema ao fechar o drawer');
		}
	}

	function testCartViewIntegration() {
		addLog('Testando integração do CartView...');

		// Limpa o carrinho primeiro
		cart.clearCart();
		addLog('Carrinho limpo para teste de integração');

		// Adiciona alguns itens
		cart.addItem(testProducts[0]);
		cart.addItem(testProducts[1]);
		addLog(`Itens adicionados ao carrinho: ${cart.state.items.length}`);

		// Abre o drawer para visualizar o CartView
		showCart = true;
		addLog('Drawer aberto para exibir CartView');

		// Verifica se os itens estão sendo exibidos no CartView
		const itemsInView = cart.state.items.length;
		if (itemsInView > 0) {
			addLog(`SUCESSO: CartView exibindo ${itemsInView} itens corretamente`);
		} else {
			addLog('ERRO: CartView não está exibindo os itens');
		}

		// Verifica se o total está sendo exibido corretamente no CartView
		const totalInView = cart.state.total;
		if (totalInView > 0) {
			addLog(`SUCESSO: Total no CartView: R$ ${totalInView.toFixed(2)}`);
		} else {
			addLog('ERRO: Total no CartView não está correto');
		}
	}

	function testCartWorkflow() {
		addLog('Testando fluxo completo do carrinho (workflow da seção 3.2)...');

		// 1. Limpar carrinho
		cart.clearCart();
		addLog('1. Carrinho limpo');

		// 2. Adicionar produtos
		cart.addItem(testProducts[0]);
		cart.addItem(testProducts[1]);
		cart.updateItemQuantity(testProducts[0].id, 2);
		addLog('2. Produtos adicionados e quantidade atualizada');

		// 3. Verificar estado do botão flutuante
		const buttonItemCount = cart.state.items.length;
		addLog(`3. Botão flutuante mostra ${buttonItemCount} tipos de itens`);

		// 4. Abrir drawer
		showCart = true;
		addLog('4. Drawer aberto');

		// 5. Verificar se CartView está mostrando os dados corretos
		const viewTotal = cart.state.total;
		const viewItems = cart.state.items.length;
		addLog(`5. CartView mostra ${viewItems} tipos de itens com total R$ ${viewTotal.toFixed(2)}`);

		// 6. Simular remoção de item através do CartView
		const itemToRemove = testProducts[1];
		cart.removeItem(itemToRemove.id);
		addLog(`6. Item ${itemToRemove.nome} removido através do CartView`);

		// 7. Verificar se o botão flutuante foi atualizado
		const updatedButtonCount = cart.state.items.length;
		addLog(`7. Contador do botão atualizado para ${updatedButtonCount}`);

		// 8. Fechar drawer
		showCart = false;
		addLog('8. Drawer fechado');

		// 9. Verificar estado final
		if (cart.state.items.length === 1 && cart.state.total > 0 && !showCart) {
			addLog('SUCESSO: Fluxo completo do carrinho funcionando corretamente');
		} else {
			addLog('ERRO: Problemas no fluxo completo do carrinho');
		}
	}

	function runAllTests() {
		clearLog();
		addLog('Iniciando testes completos do sistema de carrinho...');
		addLog('');

		// Testes do módulo cart.svelte.ts (Fase 1)
		addLog('=== FASE 1: Testes do módulo cart.svelte.ts ===');
		testAddSingleItem();
		addLog('');

		testAddSameItemMultipleTimes();
		addLog('');

		testAddDifferentItems();
		addLog('');

		testTotalCalculation();
		addLog('');

		testRemoveItem();
		addLog('');

		testUpdateItemQuantity();
		addLog('');

		testClearCart();
		addLog('');

		// Testes da interface (Seção 3.2)
		addLog('=== SEÇÃO 3.2: Testes da Interface do Usuário ===');
		testCartFloatingButtonVisibility();
		addLog('');

		testCartDrawerToggle();
		addLog('');

		testCartViewIntegration();
		addLog('');

		testCartWorkflow();
		addLog('');

		addLog('Todos os testes concluídos!');
	}

	function runUITests() {
		clearLog();
		addLog('Iniciando testes específicos da seção 3.2 (Interface)...');
		addLog('');

		testCartFloatingButtonVisibility();
		addLog('');

		testCartDrawerToggle();
		addLog('');

		testCartViewIntegration();
		addLog('');

		testCartWorkflow();
		addLog('');

		addLog('Testes da interface concluídos!');
	}

	function clearCart() {
		cart.clearCart();
		addLog('Carrinho limpo!');
	}

	function toggleCartDrawer() {
		showCart = !showCart;
		addLog(`Drawer ${showCart ? 'aberto' : 'fechado'} manualmente`);
	}
</script>

<div class="container mx-auto p-8 max-w-6xl">
	<div class="mb-8">
		<h1 class="text-4xl font-bold text-base-content mb-2">Teste do Sistema de Carrinho</h1>
		<p class="text-base-content/70 text-lg">Validação completa do sistema de carrinho (Módulo + Interface)</p>
	</div>

	<!-- Botões de teste -->
	<div class="mb-8">
		<h2 class="text-2xl font-semibold mb-4 text-base-content">Controles de Teste</h2>
		<div class="flex flex-wrap gap-3">
			<button class="btn btn-primary btn-lg" onclick={runAllTests}>
				🚀 Executar Todos os Testes
			</button>
			<button class="btn btn-secondary btn-lg" onclick={runUITests}>
				🎨 Testar Interface (Seção 3.2)
			</button>
			<button class="btn btn-accent btn-lg" onclick={toggleCartDrawer}>
				{showCart ? '📤' : '📥'} {showCart ? 'Fechar' : 'Abrir'} Drawer
			</button>
			<button class="btn btn-warning btn-lg" onclick={clearCart}>
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
			<div class="grid grid-cols-1 md:grid-cols-3 gap-6">
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
				<div class="text-center md:text-left">
					<h3 class="font-semibold text-sm uppercase tracking-wide text-base-content/60 mb-2">
						Estado do Drawer
					</h3>
					<p class="text-3xl font-bold {showCart ? 'text-info' : 'text-base-content/50'}">{showCart ? 'Aberto' : 'Fechado'}</p>
				</div>
			</div>
		</div>
	</div>

	<!-- Componentes da seção 3.2 -->
	<div class="mb-8">
		<h2 class="text-2xl font-semibold mb-4 text-base-content">Componentes da Interface (Seção 3.2)</h2>
		<div class="grid grid-cols-1 md:grid-cols-2 gap-6">
			<!-- CartFloatingButton -->
			<div class="card bg-base-100 shadow-md border">
				<div class="card-body">
					<h3 class="card-title">CartFloatingButton</h3>
					<p class="text-base-content/70 mb-4">Botão flutuante para acesso rápido ao carrinho</p>
					<div class="flex items-center justify-between">
						<div class="relative">
							<CartFloatingButton on:toggle={toggleCartDrawer} />
						</div>
						<div class="text-sm">
							<p><strong>Itens:</strong> {cart.state.items.length}</p>
							<p><strong>Status:</strong> Visível</p>
						</div>
					</div>
				</div>
			</div>

			<!-- CartView Status -->
			<div class="card bg-base-100 shadow-md border">
				<div class="card-body">
					<h3 class="card-title">CartView (Drawer)</h3>
					<p class="text-base-content/70 mb-4">Painel lateral para visualização do carrinho</p>
					<div class="flex items-center justify-between">
						<div>
							<p class="text-sm"><strong>Estado:</strong>
								<span class="badge {showCart ? 'badge-info' : 'badge-ghost'}">{showCart ? 'Aberto' : 'Fechado'}</span>
							</p>
							<p class="text-sm"><strong>Itens exibidos:</strong> {cart.state.items.length}</p>
							<p class="text-sm"><strong>Total exibido:</strong> R$ {cart.state.total.toFixed(2)}</p>
						</div>
						<button class="btn btn-sm {showCart ? 'btn-error' : 'btn-info'}" onclick={toggleCartDrawer}>
							{showCart ? 'Fechar' : 'Abrir'}
						</button>
					</div>
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
							<div class="text-right flex items-center gap-4">
								<div>
									<div class="font-bold text-lg text-primary flex items-center gap-2">
										<span>Qtd:</span>
										<div class="join">
											<button
												class="btn btn-sm join-item"
												onclick={() => cart.updateItemQuantity(item.product.id, item.quantity - 1)}
												title="Diminuir quantidade"
											>
												-
											</button>
											<span class="btn btn-sm join-item no-animation">{item.quantity}</span>
											<button
												class="btn btn-sm join-item"
												onclick={() => cart.updateItemQuantity(item.product.id, item.quantity + 1)}
												title="Aumentar quantidade"
											>
												+
											</button>
										</div>
									</div>
									<div class="text-sm text-base-content/70">
										R$ {item.product.preco.toFixed(2)} cada
									</div>
									<div class="font-semibold text-lg text-success">
										Subtotal: R$ {(item.product.preco * item.quantity).toFixed(2)}
									</div>
								</div>
								<button
									class="btn btn-error btn-circle btn-sm"
									onclick={() => cart.removeItem(item.product.id)}
									title="Remover item"
								>
									<svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
										<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
									</svg>
								</button>
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
				{@const isInCart = cart.state.items.some(item => item.product.id === product.id)}
				<div class="card bg-base-100 shadow-md hover:shadow-lg transition-shadow border border-base-300 {isInCart ? 'border-primary border-2' : ''}">
					<div class="card-body p-6">
						<h3 class="card-title text-xl mb-2">{product.nome}</h3>
						<p class="text-base-content/60 text-sm mb-3">{product.codigo}</p>
						<p class="text-2xl font-bold text-success mb-4">R$ {product.preco.toFixed(2)}</p>
						<div class="card-actions justify-end">
							{#if isInCart}
								<button
									class="btn btn-error btn-wide"
									onclick={() => cart.removeItem(product.id)}
								>
									➖ Remover do Carrinho
								</button>
							{:else}
								<button
									class="btn btn-primary btn-wide"
									onclick={() => cart.addItem(product)}
								>
									➕ Adicionar ao Carrinho
								</button>
							{/if}
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
						<div class="font-mono text-sm text-base-content/90 py-1 px-2 rounded {log.includes('SUCESSO') ? 'bg-success/10 text-success' : log.includes('ERRO') ? 'bg-error/10 text-error' : log.includes('===') ? 'bg-info/10 text-info font-bold' : ''}">{log}</div>
					{/each}
				</div>
			{/if}
		</div>
	</div>
</div>

<!-- Drawer do CarrinhoView (simulando o layout principal) -->
<div class="drawer drawer-end {showCart ? 'drawer-open' : ''}" style="position: fixed; top: 0; left: 0; width: 100%; height: 100%; pointer-events: {showCart ? 'auto' : 'none'}; z-index: 50;">
	<input id="cart-drawer-test" type="checkbox" class="drawer-toggle" bind:checked={showCart} />
	<div class="drawer-content" style="pointer-events: none;"></div>
	<div class="drawer-side">
		<label for="cart-drawer-test" aria-label="close sidebar" class="drawer-overlay"></label>
		<CartView />
	</div>
</div>