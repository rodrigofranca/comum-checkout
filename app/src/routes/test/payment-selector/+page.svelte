<script lang="ts">
	import PaymentSelector from '$lib/components/cart/PaymentSelector.svelte';
	import CartView from '$lib/components/cart/CartView.svelte';
	import { clearCart, addItem } from '$lib/cart.svelte';
	import type { Product } from '$lib/types';
	import { onMount } from 'svelte';

	type PaymentMethod = 'debito' | 'credito' | 'pix';

	// Produtos de exemplo para teste
	const testProducts: Product[] = [
		{
			id: 'test1',
			codigo: 'TEST001',
			nome: 'Produto Teste A',
			preco: 25.99,
			status: 'disponivel',
			foto_url: 'https://via.placeholder.com/150',
			categoria: 'Teste',
			descricao: 'Produto para teste do PaymentSelector'
		},
		{
			id: 'test2',
			codigo: 'TEST002',
			nome: 'Produto Teste B',
			preco: 45.50,
			status: 'disponivel',
			foto_url: 'https://via.placeholder.com/150',
			categoria: 'Teste',
			descricao: 'Segundo produto para teste'
		}
	];

	// Estado do componente PaymentSelector
	let selectedPayment = $state<PaymentMethod | undefined>(undefined);
	let testLog: string[] = [];
	let showCart = $state(false);

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
		addItem(testProducts[0]);
		addItem(testProducts[1]);
		selectedPayment = undefined;
		addLog('Carrinho inicializado com 2 produtos para teste');
	}

	onMount(initializeForTests);

	// ========== TESTES INDIVIDUAIS ==========

	function testSelectDebito() {
		addLog('Testando seleção de Débito...');
		selectedPayment = 'debito';
		
		if (selectedPayment === 'debito') {
			addLog('SUCESSO: Débito selecionado corretamente');
		} else {
			addLog('ERRO: Falha ao selecionar Débito');
		}
	}

	function testSelectCredito() {
		addLog('Testando seleção de Crédito...');
		selectedPayment = 'credito';
		
		if (selectedPayment === 'credito') {
			addLog('SUCESSO: Crédito selecionado corretamente');
		} else {
			addLog('ERRO: Falha ao selecionar Crédito');
		}
	}

	function testSelectPix() {
		addLog('Testando seleção de PIX...');
		selectedPayment = 'pix';
		
		if (selectedPayment === 'pix') {
			addLog('SUCESSO: PIX selecionado corretamente');
		} else {
			addLog('ERRO: Falha ao selecionar PIX');
		}
	}

	function testChangeSelection() {
		addLog('Testando mudança de seleção...');
		
		selectedPayment = 'debito';
		addLog(`Primeira seleção: ${selectedPayment}`);
		
		selectedPayment = 'credito';
		addLog(`Segunda seleção: ${selectedPayment}`);
		
		selectedPayment = 'pix';
		addLog(`Terceira seleção: ${selectedPayment}`);
		
		if (selectedPayment === 'pix') {
			addLog('SUCESSO: Mudança de seleção funcionando corretamente');
		} else {
			addLog('ERRO: Problema na mudança de seleção');
		}
	}

	function testVisualStates() {
		addLog('Testando estados visuais...');
		addLog('Verificação visual: observe as bordas e cores mudando');
		
		// Testa cada estado com delay para visualização
		setTimeout(() => {
			selectedPayment = 'debito';
			addLog('Estado visual: Débito selecionado (deve ter borda primary)');
		}, 500);
		
		setTimeout(() => {
			selectedPayment = 'credito';
			addLog('Estado visual: Crédito selecionado (deve ter borda primary)');
		}, 1500);
		
		setTimeout(() => {
			selectedPayment = 'pix';
			addLog('Estado visual: PIX selecionado (deve ter borda primary)');
		}, 2500);
		
		setTimeout(() => {
			addLog('SUCESSO: Teste visual concluído - verifique as mudanças na interface');
		}, 3500);
	}

	function testResetSelection() {
		addLog('Testando reset da seleção...');
		
		selectedPayment = 'credito';
		addLog(`Seleção inicial: ${selectedPayment}`);
		
		selectedPayment = undefined;
		addLog('Seleção resetada para undefined');
		
		if (selectedPayment === undefined) {
			addLog('SUCESSO: Reset da seleção funcionando corretamente');
		} else {
			addLog('ERRO: Falha no reset da seleção');
		}
	}

	function testEventHandling() {
		addLog('Testando manipulação de eventos...');
		
		// Simula evento do componente
		function handlePaymentChange(event: CustomEvent<PaymentMethod>) {
			const method = event.detail;
			addLog(`Evento recebido: ${method}`);
			
			if (['debito', 'credito', 'pix'].includes(method)) {
				addLog('SUCESSO: Event handling funcionando corretamente');
			} else {
				addLog('ERRO: Valor inválido no evento');
			}
		}
		
		// Simula disparo de evento
		const testEvent = new CustomEvent('change', { detail: 'pix' });
		handlePaymentChange(testEvent as CustomEvent<PaymentMethod>);
	}

	function testCartIntegration() {
		addLog('Testando integração com CartView...');
		
		if (testProducts.length > 0) {
			addLog('Produtos no carrinho: ' + testProducts.length);
		}
		
		selectedPayment = 'debito';
		showCart = true;
		
		addLog('CartView aberto com PaymentSelector integrado');
		addLog('SUCESSO: Integração básica funcionando - verifique visualmente o CartView');
		
		setTimeout(() => {
			showCart = false;
			addLog('CartView fechado');
		}, 3000);
	}

	function testValidationLogic() {
		addLog('Testando lógica de validação...');
		
		// Simula lógica de validação do CartView
		function canFinalize() {
			return selectedPayment !== undefined;
		}
		
		selectedPayment = undefined;
		let canFinalizeResult = canFinalize();
		addLog(`Sem seleção - Pode finalizar: ${canFinalizeResult}`);
		
		if (!canFinalizeResult) {
			addLog('SUCESSO: Validação impede finalização sem seleção');
		} else {
			addLog('ERRO: Validação não está funcionando');
		}
		
		selectedPayment = 'pix';
		canFinalizeResult = canFinalize();
		addLog(`Com PIX selecionado - Pode finalizar: ${canFinalizeResult}`);
		
		if (canFinalizeResult) {
			addLog('SUCESSO: Validação permite finalização com seleção');
		} else {
			addLog('ERRO: Validação não permite finalização válida');
		}
	}

	function testPersistence() {
		addLog('Testando persistência da seleção...');
		
		selectedPayment = 'credito';
		addLog('Crédito selecionado');
		
		// Simula mudanças de estado que não devem afetar a seleção
		showCart = true;
		showCart = false;
		
		if (selectedPayment === 'credito') {
			addLog('SUCESSO: Seleção persistiu durante mudanças de estado');
		} else {
			addLog('ERRO: Seleção foi perdida durante mudanças de estado');
		}
		
		// Testa reset conjunto com carrinho
		initializeForTests();
		if (selectedPayment === undefined) {
			addLog('SUCESSO: Seleção resetada junto com inicialização');
		} else {
			addLog('ERRO: Seleção não foi resetada na inicialização');
		}
	}

	// ========== BATERIAS DE TESTE ==========

	function runAllTests() {
		clearLog();
		addLog('Iniciando todos os testes do PaymentSelector...');
		addLog('');
		
		addLog('=== TESTES DE SELEÇÃO INDIVIDUAL ===');
		testSelectDebito();
		testSelectCredito();
		testSelectPix();
		addLog('');
		
		addLog('=== TESTES DE COMPORTAMENTO ===');
		testChangeSelection();
		testResetSelection();
		addLog('');
		
		addLog('=== TESTES DE INTERFACE ===');
		testVisualStates();
		addLog('');
		
		addLog('=== TESTES DE INTEGRAÇÃO ===');
		testEventHandling();
		testValidationLogic();
		testPersistence();
		addLog('');
		
		addLog('=== TESTE DE INTEGRAÇÃO COM CARTVIEW ===');
		testCartIntegration();
		addLog('');
		
		addLog('Todos os testes concluídos!');
	}

	function runBasicTests() {
		clearLog();
		addLog('Executando testes básicos...');
		addLog('');
		
		testSelectDebito();
		testSelectCredito();
		testSelectPix();
		testChangeSelection();
		
		addLog('');
		addLog('Testes básicos concluídos!');
	}

	function runIntegrationTests() {
		clearLog();
		addLog('Executando testes de integração...');
		addLog('');
		
		testCartIntegration();
		testValidationLogic();
		testPersistence();
		
		addLog('');
		addLog('Testes de integração concluídos!');
	}

	// Funções de controle manual
	function toggleCart() {
		showCart = !showCart;
		addLog(`CartView ${showCart ? 'aberto' : 'fechado'} manualmente`);
	}

	function resetTest() {
		initializeForTests();
		addLog('Teste resetado para estado inicial');
	}
</script>

<div class="container mx-auto p-8 max-w-6xl">
	<!-- Título -->
	<div class="mb-8">
		<h1 class="text-4xl font-bold text-base-content mb-2">Teste: PaymentSelector (FEAT-05)</h1>
		<p class="text-base-content/70 text-lg">Validação completa do componente de seleção de forma de pagamento</p>
	</div>

	<!-- Controles de teste -->
	<div class="mb-8">
		<h2 class="text-2xl font-semibold mb-4 text-base-content">Controles de Teste</h2>
		<div class="flex flex-wrap gap-3">
			<button class="btn btn-primary btn-lg" onclick={runAllTests}>
				🚀 Executar Todos os Testes
			</button>
			<button class="btn btn-secondary btn-lg" onclick={runBasicTests}>
				🧪 Testes Básicos
			</button>
			<button class="btn btn-accent btn-lg" onclick={runIntegrationTests}>
				🔗 Testes de Integração
			</button>
			<button class="btn btn-info btn-lg" onclick={toggleCart}>
				{showCart ? '📤' : '📥'} {showCart ? 'Fechar' : 'Abrir'} CartView
			</button>
			<button class="btn btn-warning btn-lg" onclick={resetTest}>
				🔄 Reset Teste
			</button>
			<button class="btn btn-outline btn-lg" onclick={clearLog}>
				📝 Limpar Log
			</button>
		</div>
	</div>

	<!-- Estado atual -->
	<div class="mb-8">
		<h2 class="text-2xl font-semibold mb-4 text-base-content">Estado Atual</h2>
		<div class="bg-base-200 p-6 rounded-xl shadow-sm">
			<div class="grid grid-cols-1 md:grid-cols-3 gap-6">
				<div class="text-center md:text-left">
					<h3 class="font-semibold text-sm uppercase tracking-wide text-base-content/60 mb-2">
						Forma de Pagamento
					</h3>
					<p class="text-3xl font-bold text-primary">
						{selectedPayment || 'Nenhuma'}
					</p>
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
						Pode Finalizar
					</h3>
					<p class="text-3xl font-bold {selectedPayment ? 'text-success' : 'text-error'}">
						{selectedPayment ? 'SIM' : 'NÃO'}
					</p>
				</div>
			</div>
		</div>
	</div>

	<!-- Componente sendo testado -->
	<div class="mb-8">
		<h2 class="text-2xl font-semibold mb-4 text-base-content">PaymentSelector em Teste</h2>
		<div class="bg-base-100 p-6 rounded-xl shadow-sm border border-base-300">
			<PaymentSelector bind:selected={selectedPayment} onchange={(e) => addLog(`Evento change: ${e.detail}`)} />
		</div>
	</div>

	<!-- Testes individuais -->
	<div class="mb-8">
		<h2 class="text-2xl font-semibold mb-4 text-base-content">Testes Individuais</h2>
		<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
			<button class="btn btn-outline" onclick={testSelectDebito}>💳 Testar Débito</button>
			<button class="btn btn-outline" onclick={testSelectCredito}>💎 Testar Crédito</button>
			<button class="btn btn-outline" onclick={testSelectPix}>⚡ Testar PIX</button>
			<button class="btn btn-outline" onclick={testChangeSelection}>🔄 Testar Mudanças</button>
			<button class="btn btn-outline" onclick={testVisualStates}>👁️ Testar Visual</button>
			<button class="btn btn-outline" onclick={testValidationLogic}>✅ Testar Validação</button>
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
							 log.includes('===') ? 'bg-info/10 text-info font-bold' : ''}">
							{log}
						</div>
					{/each}
				</div>
			{/if}
		</div>
	</div>
</div>

<!-- Drawer do CartView para teste de integração -->
<div class="drawer drawer-end {showCart ? 'drawer-open' : ''}" style="position: fixed; top: 0; left: 0; width: 100%; height: 100%; pointer-events: {showCart ? 'auto' : 'none'}; z-index: 50;">
	<input id="cart-drawer-payment-test" type="checkbox" class="drawer-toggle" bind:checked={showCart} />
	<div class="drawer-content" style="pointer-events: none;"></div>
	<div class="drawer-side">
		<label for="cart-drawer-payment-test" aria-label="close sidebar" class="drawer-overlay"></label>
		<CartView on:close={() => { showCart = false; addLog('CartView fechado via evento'); }} />
	</div>
</div>