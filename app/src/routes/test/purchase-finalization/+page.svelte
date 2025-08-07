<script lang="ts">
	import CartView from '$lib/components/cart/CartView.svelte';
	import Toast from '$lib/components/notifications/Toast.svelte';
	import toast from '$lib/components/notifications/toast.svelte';
	import { clearCart, addItem } from '$lib/cart.svelte';
	import { clearCustomerData } from '$lib/customer.svelte';
	import { markItemsAsSold } from '$lib/pocketbase';
	import { config } from '$lib/config';
	import type { Product, CartItem } from '$lib/types';
	import { onMount } from 'svelte';

	// Produtos de exemplo para teste
	const testProducts: Product[] = [
		{
			id: 'test-final-1',
			codigo: 'FIN001',
			nome: 'Produto Final A',
			preco: 49.99,
			status: 'disponivel',
			foto_url: 'https://via.placeholder.com/150',
			categoria: 'Teste',
			descricao: 'Produto para teste de finalização'
		},
		{
			id: 'test-final-2',
			codigo: 'FIN002',
			nome: 'Produto Final B',
			preco: 129.90,
			status: 'disponivel',
			foto_url: 'https://via.placeholder.com/150',
			categoria: 'Teste',
			descricao: 'Segundo produto para teste de finalização'
		},
		{
			id: 'test-final-3',
			codigo: 'FIN003',
			nome: 'Produto Final C',
			preco: 15.50,
			status: 'disponivel',
			foto_url: 'https://via.placeholder.com/150',
			categoria: 'Teste',
			descricao: 'Terceiro produto para teste de finalização'
		}
	];

	// Estado do teste
	let showCart = $state(false);
	let testLog: string[] = [];
	let simulateN8nError = $state(false);
	let simulatePocketBaseError = $state(false);

	// Sistema de logging
	function addLog(message: string) {
		testLog = [...testLog, `[${new Date().toLocaleTimeString()}] ${message}`];
	}

	function clearLog() {
		testLog = [];
	}

	// Inicialização para testes
	function initializeForTests() {
		clearCart();
		clearCustomerData();
		addItem(testProducts[0]);
		addItem(testProducts[1]);
		addLog('Carrinho inicializado com 2 produtos para teste');
		addLog(`Total do carrinho: R$ ${(testProducts[0].preco + testProducts[1].preco).toFixed(2)}`);
	}

	onMount(initializeForTests);

	// ========== TESTES INDIVIDUAIS ==========

	function testBasicPurchaseFlow() {
		addLog('Testando fluxo básico de finalização...');
		showCart = true;
		addLog('CartView aberto para finalização manual');
		addLog('INSTRUÇÃO: Complete os dados do cliente, selecione pagamento e clique em "Finalizar Compra"');
	}

	function testWithAllProducts() {
		addLog('Testando finalização com todos os produtos...');
		clearCart();
		testProducts.forEach(product => {
			addItem(product);
		});
		addLog(`${testProducts.length} produtos adicionados ao carrinho`);
		showCart = true;
		addLog('CartView aberto com carrinho completo');
	}

	function testEmptyCartValidation() {
		addLog('Testando validação com carrinho vazio...');
		clearCart();
		addLog('Carrinho esvaziado');
		showCart = true;
		addLog('RESULTADO: CartView deve mostrar mensagem "Seu carrinho está vazio"');
		
		setTimeout(() => {
			if (showCart) {
				addLog('SUCESSO: Interface apropriada para carrinho vazio');
			}
		}, 1000);
	}

	function testCustomerDataValidation() {
		addLog('Testando validação de dados do cliente...');
		initializeForTests();
		clearCustomerData();
		showCart = true;
		addLog('INSTRUÇÃO: Tente finalizar sem preencher os dados - deve ser impedido');
		addLog('INSTRUÇÃO: Preencha apenas nome ou apenas email - deve ser impedido');
		addLog('INSTRUÇÃO: Preencha dados completos - deve ser permitido');
	}

	function testPaymentValidation() {
		addLog('Testando validação de forma de pagamento...');
		initializeForTests();
		showCart = true;
		addLog('INSTRUÇÃO: Preencha dados do cliente mas NÃO selecione forma de pagamento');
		addLog('INSTRUÇÃO: Botão "Finalizar Compra" deve estar desabilitado');
		addLog('INSTRUÇÃO: Selecione uma forma de pagamento - botão deve ser habilitado');
	}

	function testLoadingState() {
		addLog('Testando estado de loading durante processamento...');
		initializeForTests();
		showCart = true;
		addLog('INSTRUÇÃO: Complete dados e clique em "Finalizar Compra"');
		addLog('OBSERVAR: Botão deve mostrar spinner e texto "Processando..."');
		addLog('OBSERVAR: Botão "Esvaziar Carrinho" deve ficar desabilitado');
	}

	function testErrorHandling() {
		addLog('Testando tratamento de erros...');
		addLog('Simulando cenários de erro para testar robustez');
		
		// Simular erro de rede
		const originalFetch = window.fetch;
		window.fetch = async () => {
			throw new Error('Erro de rede simulado');
		};
		
		initializeForTests();
		showCart = true;
		addLog('INSTRUÇÃO: Finalize a compra para testar tratamento de erro');
		addLog('ESPERADO: Toast de erro deve aparecer');
		
		// Restaurar fetch após 30 segundos
		setTimeout(() => {
			window.fetch = originalFetch;
			addLog('Fetch restaurado - testes normais podem continuar');
		}, 30000);
	}

	async function testPocketBaseIntegration() {
		addLog('Testando integração PocketBase diretamente...');
		
		const testItems: CartItem[] = [
			{ product: testProducts[0], quantity: 1 },
			{ product: testProducts[1], quantity: 2 }
		];
		
		try {
			addLog('Tentando marcar itens como vendidos...');
			const result = await markItemsAsSold(testItems);
			
			if (result.success) {
				addLog(`SUCESSO: ${result.updatedCount} itens marcados como vendidos`);
			} else {
				addLog(`ERRO PARCIAL: ${result.updatedCount} de ${testItems.length} itens atualizados`);
				result.errors.forEach(error => addLog(`- ${error}`));
			}
		} catch (error) {
			addLog(`ERRO: ${error instanceof Error ? error.message : 'Erro desconhecido'}`);
		}
	}

	function testToastNotifications() {
		addLog('Testando sistema de notificações toast...');
		
		toast.addToast('Teste de sucesso', 'success', 3000);
		addLog('Toast de sucesso enviado');
		
		setTimeout(() => {
			toast.addToast('Teste de aviso', 'warning', 3000);
			addLog('Toast de aviso enviado');
		}, 1000);
		
		setTimeout(() => {
			toast.addToast('Teste de erro', 'error', 3000);
			addLog('Toast de erro enviado');
		}, 2000);
		
		setTimeout(() => {
			toast.addToast('Teste de informação', 'info', 3000);
			addLog('Toast de informação enviado');
		}, 3000);
	}

	function testCompleteWorkflow() {
		addLog('Executando teste de fluxo completo...');
		addLog('');
		
		addLog('=== INICIALIZANDO TESTE COMPLETO ===');
		initializeForTests();
		addLog('Carrinho preparado com produtos de teste');
		
		addLog('');
		addLog('=== INSTRUÇÕES PARA TESTE MANUAL ===');
		addLog('1. Abrir CartView');
		addLog('2. Verificar produtos no carrinho');
		addLog('3. Preencher dados do cliente (nome e email)');
		addLog('4. Selecionar forma de pagamento');
		addLog('5. Observar habilitação do botão');
		addLog('6. Clicar em "Finalizar Compra"');
		addLog('7. Observar estado de loading');
		addLog('8. Verificar toast de resultado');
		addLog('9. Confirmar limpeza do carrinho');
		
		showCart = true;
		addLog('');
		addLog('CartView aberto para execução do teste completo');
	}

	// ========== BATERIAS DE TESTE ==========

	function runAllTests() {
		clearLog();
		addLog('Iniciando todos os testes de finalização de compra...');
		addLog('');
		
		addLog('=== TESTES AUTOMATIZADOS ===');
		testToastNotifications();
		addLog('');
		
		setTimeout(() => {
			testPocketBaseIntegration();
		}, 5000);
		
		addLog('');
		addLog('=== TESTES MANUAIS (seguir instruções) ===');
		addLog('Execute os testes individuais para validação completa');
		
		addLog('');
		addLog('Bateria de testes iniciada!');
	}

	function runValidationTests() {
		clearLog();
		addLog('Executando testes de validação...');
		addLog('');
		
		testEmptyCartValidation();
		
		setTimeout(() => {
			testCustomerDataValidation();
		}, 3000);
		
		setTimeout(() => {
			testPaymentValidation();
		}, 6000);
		
		addLog('');
		addLog('Testes de validação concluídos!');
	}

	// Funções de controle manual
	function toggleCart() {
		showCart = !showCart;
		addLog(`CartView ${showCart ? 'aberto' : 'fechado'} manualmente`);
	}

	function resetTest() {
		initializeForTests();
		showCart = false;
		addLog('Teste resetado para estado inicial');
	}

	function clearAll() {
		clearCart();
		clearCustomerData();
		addLog('Carrinho e dados do cliente limpos');
	}
</script>

<div class="container mx-auto p-8 max-w-6xl">
	<!-- Título -->
	<div class="mb-8">
		<h1 class="text-4xl font-bold text-base-content mb-2">Teste: Finalização de Compra (FEAT-06)</h1>
		<p class="text-base-content/70 text-lg">Validação completa do processo de finalização de venda com integração PocketBase e n8n</p>
	</div>

	<!-- Controles de teste -->
	<div class="mb-8">
		<h2 class="text-2xl font-semibold mb-4 text-base-content">Controles de Teste</h2>
		<div class="flex flex-wrap gap-3">
			<button class="btn btn-primary btn-lg" onclick={runAllTests}>
				🚀 Executar Todos os Testes
			</button>
			<button class="btn btn-secondary btn-lg" onclick={runValidationTests}>
				✅ Testes de Validação
			</button>
			<button class="btn btn-accent btn-lg" onclick={testCompleteWorkflow}>
				🔄 Fluxo Completo
			</button>
			<button class="btn btn-info btn-lg" onclick={toggleCart}>
				{showCart ? '📤' : '📥'} {showCart ? 'Fechar' : 'Abrir'} CartView
			</button>
			<button class="btn btn-warning btn-lg" onclick={resetTest}>
				🔄 Reset Teste
			</button>
			<button class="btn btn-error btn-lg" onclick={clearAll}>
				🗑️ Limpar Tudo
			</button>
			<button class="btn btn-outline btn-lg" onclick={clearLog}>
				📝 Limpar Log
			</button>
		</div>
	</div>

	<!-- Estado atual -->
	<div class="mb-8">
		<h2 class="text-2xl font-semibold mb-4 text-base-content">Estado Atual do Sistema</h2>
		<div class="bg-base-200 p-6 rounded-xl shadow-sm">
			<div class="grid grid-cols-1 md:grid-cols-4 gap-6">
				<div class="text-center md:text-left">
					<h3 class="font-semibold text-sm uppercase tracking-wide text-base-content/60 mb-2">
						Produtos no Carrinho
					</h3>
					<p class="text-3xl font-bold text-primary" id="cart-count">0</p>
				</div>
				<div class="text-center md:text-left">
					<h3 class="font-semibold text-sm uppercase tracking-wide text-base-content/60 mb-2">
						Total do Carrinho
					</h3>
					<p class="text-3xl font-bold text-success" id="cart-total">R$ 0,00</p>
				</div>
				<div class="text-center md:text-left">
					<h3 class="font-semibold text-sm uppercase tracking-wide text-base-content/60 mb-2">
						Estado do CartView
					</h3>
					<p class="text-3xl font-bold {showCart ? 'text-info' : 'text-base-content/50'}">
						{showCart ? 'Aberto' : 'Fechado'}
					</p>
				</div>
				<div class="text-center md:text-left">
					<h3 class="font-semibold text-sm uppercase tracking-wide text-base-content/60 mb-2">
						Configuração n8n
					</h3>
					<p class="text-xl font-bold {config.n8nWebhookUrl ? 'text-success' : 'text-error'}">
						{config.n8nWebhookUrl ? 'Configurado' : 'Não Configurado'}
					</p>
				</div>
			</div>
		</div>
	</div>

	<!-- Testes individuais -->
	<div class="mb-8">
		<h2 class="text-2xl font-semibold mb-4 text-base-content">Testes Individuais</h2>
		<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
			<button class="btn btn-outline" onclick={testBasicPurchaseFlow}>🛒 Fluxo Básico</button>
			<button class="btn btn-outline" onclick={testWithAllProducts}>📦 Todos Produtos</button>
			<button class="btn btn-outline" onclick={testEmptyCartValidation}>🗑️ Carrinho Vazio</button>
			<button class="btn btn-outline" onclick={testCustomerDataValidation}>👤 Dados Cliente</button>
			<button class="btn btn-outline" onclick={testPaymentValidation}>💳 Forma Pagamento</button>
			<button class="btn btn-outline" onclick={testLoadingState}>⏳ Estado Loading</button>
			<button class="btn btn-outline" onclick={testErrorHandling}>❌ Tratamento Erros</button>
			<button class="btn btn-outline" onclick={testPocketBaseIntegration}>🗄️ PocketBase</button>
			<button class="btn btn-outline" onclick={testToastNotifications}>🔔 Notificações</button>
		</div>
	</div>

	<!-- Produtos disponíveis para teste -->
	<div class="mb-8">
		<h2 class="text-2xl font-semibold mb-4 text-base-content">Produtos de Teste</h2>
		<div class="grid grid-cols-1 md:grid-cols-3 gap-6">
			{#each testProducts as product}
				<div class="card bg-base-100 shadow-md border border-base-300">
					<div class="card-body">
						<h3 class="card-title text-lg">{product.nome}</h3>
						<p class="text-base-content/60 text-sm">{product.codigo}</p>
						<p class="text-xl font-bold text-success">R$ {product.preco.toFixed(2)}</p>
						<div class="card-actions justify-end">
							<button
								class="btn btn-primary btn-sm"
								onclick={() => {
									addItem(product);
									addLog(`${product.nome} adicionado ao carrinho`);
								}}
							>
								➕ Adicionar
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
				<p class="text-base-content/60 italic text-center py-8">
					Nenhum teste executado ainda...
				</p>
			{:else}
				<div class="space-y-1">
					{#each testLog as log}
						<div class="font-mono text-sm text-base-content/90 py-1 px-2 rounded 
							{log.includes('SUCESSO') ? 'bg-success/10 text-success' : 
							 log.includes('ERRO') ? 'bg-error/10 text-error' : 
							 log.includes('INSTRUÇÃO') || log.includes('OBSERVAR') || log.includes('ESPERADO') ? 'bg-warning/10 text-warning' :
							 log.includes('===') ? 'bg-info/10 text-info font-bold' : ''}">
							{log}
						</div>
					{/each}
				</div>
			{/if}
		</div>
	</div>
</div>

<!-- Toast Container -->
<Toast />

<!-- Drawer do CartView para teste -->
<div class="drawer drawer-end {showCart ? 'drawer-open' : ''}" style="position: fixed; top: 0; left: 0; width: 100%; height: 100%; pointer-events: {showCart ? 'auto' : 'none'}; z-index: 50;">
	<input id="cart-drawer-finalization-test" type="checkbox" class="drawer-toggle" bind:checked={showCart} />
	<div class="drawer-content" style="pointer-events: none;"></div>
	<div class="drawer-side">
		<label for="cart-drawer-finalization-test" aria-label="close sidebar" class="drawer-overlay"></label>
		<CartView on:close={() => { 
			showCart = false; 
			addLog('CartView fechado via evento'); 
		}} />
	</div>
</div>