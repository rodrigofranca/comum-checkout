# Padrão de Estrutura de Testes - Checkout Comum

Este documento define o padrão estabelecido para criação de testes de componentes no projeto Checkout Comum.

## Estrutura de Diretórios

```
app/src/routes/test/
├── +page.svelte                    # Dashboard principal de testes
├── [nome-componente]/
│   ├── +page.svelte               # Página de teste do componente
│   └── +page.server.ts            # Dados de teste (quando necessário)
```

## Página Principal de Testes (`/test/+page.svelte`)

### Características:
- **Dashboard centralizado** com cards para cada teste
- **Organização por fases/features** (ex: "Fase 2.1", "FEAT-03")
- **Descrições claras** do que cada teste valida
- **Design consistente** usando DaisyUI (cards, badges, botões)

### Estrutura do Array de Testes:
```typescript
const tests = [
    {
        name: 'NomeDoComponente',
        path: '/test/nome-componente',
        description: 'Descrição clara do que é testado',
        phase: 'FEAT-XX' // ou 'Fase X.Y'
    }
];
```

### Template Visual:
```svelte
<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
    {#each tests as test}
        <div class="card bg-base-100 shadow-xl">
            <div class="card-body">
                <h2 class="card-title">
                    {test.name}
                    <div class="badge badge-secondary">{test.phase}</div>
                </h2>
                <p class="text-sm text-gray-600 mb-4">{test.description}</p>
                <div class="card-actions justify-end">
                    <a href={test.path} class="btn btn-primary">
                        Executar Teste
                    </a>
                </div>
            </div>
        </div>
    {/each}
</div>
```

## Páginas de Teste Individuais

### Elementos Obrigatórios:

1. **Dados Mock**
   - Produtos de exemplo hardcoded para isolamento
   - Dados consistentes entre testes
   - Estado inicial controlado

2. **Sistema de Logging**
   ```typescript
   let testLog: string[] = [];
   
   function addLog(message: string) {
       testLog = [...testLog, `[${new Date().toLocaleTimeString()}] ${message}`];
   }
   ```

3. **Testes Automatizados**
   - Funções de teste individuais para cada cenário
   - Validação programática com mensagens SUCESSO/ERRO
   - Bateria completa executável com um clique

4. **Interface Interativa**
   - Botões para cenários específicos
   - Controles manuais para testes visuais
   - Estado atual visível em tempo real

5. **Validação Visual**
   - Logs coloridos (verde=sucesso, vermelho=erro, azul=info)
   - Estado dos componentes em tempo real
   - Métricas e contadores atualizados

### Template Base de Teste:

```svelte
<script lang="ts">
    // 1. Dados mock
    const testData = [...];
    
    // 2. Sistema de logging
    let testLog: string[] = [];
    
    function addLog(message: string) {
        testLog = [...testLog, `[${new Date().toLocaleTimeString()}] ${message}`];
    }
    
    function clearLog() {
        testLog = [];
    }
    
    // 3. Testes individuais
    function testScenario1() {
        addLog('Testando cenário 1...');
        // Lógica de teste
        if (condition) {
            addLog('SUCESSO: Cenário 1 funcionando corretamente');
        } else {
            addLog('ERRO: Problema no cenário 1');
        }
    }
    
    // 4. Bateria completa
    function runAllTests() {
        clearLog();
        addLog('Iniciando todos os testes...');
        testScenario1();
        // ... outros testes
        addLog('Todos os testes concluídos!');
    }
</script>

<div class="container mx-auto p-8 max-w-6xl">
    <!-- Título -->
    <div class="mb-8">
        <h1 class="text-4xl font-bold text-base-content mb-2">Teste: [Nome do Componente]</h1>
        <p class="text-base-content/70 text-lg">Descrição do que está sendo testado</p>
    </div>

    <!-- Controles de teste -->
    <div class="mb-8">
        <h2 class="text-2xl font-semibold mb-4">Controles de Teste</h2>
        <div class="flex flex-wrap gap-3">
            <button class="btn btn-primary btn-lg" onclick={runAllTests}>
                🚀 Executar Todos os Testes
            </button>
            <button class="btn btn-secondary btn-lg" onclick={testScenario1}>
                🧪 Testar Cenário Específico
            </button>
            <button class="btn btn-outline btn-lg" onclick={clearLog}>
                📝 Limpar Log
            </button>
        </div>
    </div>

    <!-- Estado atual -->
    <div class="mb-8">
        <h2 class="text-2xl font-semibold mb-4">Estado Atual</h2>
        <div class="bg-base-200 p-6 rounded-xl shadow-sm">
            <!-- Métricas e estado visível -->
        </div>
    </div>

    <!-- Componente sendo testado -->
    <div class="mb-8">
        <h2 class="text-2xl font-semibold mb-4">Componente em Teste</h2>
        <!-- Renderizar o componente aqui -->
    </div>

    <!-- Log de testes -->
    <div class="mb-8">
        <h2 class="text-2xl font-semibold mb-4">Log de Testes</h2>
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
```

## Padrões de Nomenclatura

### Funções de Teste:
- `testScenarioName()` - testa um cenário específico
- `runAllTests()` - executa bateria completa
- `clearLog()` - limpa o log
- `addLog(message)` - adiciona entrada no log

### Mensagens de Log:
- `SUCESSO: Descrição do que funcionou`
- `ERRO: Descrição do problema`
- `=== FASE X: Descrição da fase ===` (para separar seções)

### Classes CSS:
- `bg-success/10 text-success` - mensagens de sucesso
- `bg-error/10 text-error` - mensagens de erro
- `bg-info/10 text-info font-bold` - cabeçalhos de fase

## Exemplo de Implementação

### Para FEAT-05 (PaymentSelector):

```
/test/payment-selector/
└── +page.svelte
```

**Testes necessários:**
1. **Seleção Individual**: Cada opção (Débito, Crédito, PIX)
2. **Estado Visual**: Verificar styling das opções selecionadas
3. **Integração**: Teste com CartView
4. **Validação**: Verificar se impede finalização sem seleção
5. **Persistência**: Estado mantido durante navegação
6. **Reset**: Limpeza junto com carrinho

## Vantagens do Padrão

1. **Consistência**: Todos os testes seguem a mesma estrutura
2. **Isolamento**: Cada teste roda independentemente
3. **Visibilidade**: Estado e resultados sempre visíveis
4. **Interatividade**: Permite teste manual e automatizado
5. **Debugging**: Logs detalhados facilitam identificação de problemas
6. **Manutenibilidade**: Estrutura clara e reutilizável

## Integração com o Desenvolvimento

- **Durante implementação**: Criar teste junto com o componente
- **Validação**: Usar testes para validar funcionalidades
- **Debugging**: Logs ajudam a identificar problemas
- **Documentação viva**: Testes servem como documentação prática