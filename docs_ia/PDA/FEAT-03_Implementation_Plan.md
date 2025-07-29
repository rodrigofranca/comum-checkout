### **Plano de Ação: Aplicação de Desconto (FEAT-03) - v2**

Este plano detalha os passos para implementar a funcionalidade que permite aplicar desconto sobre o subtotal da compra, conforme especificado no requisito **FEAT-03** e expansão aprovada no **ADR-002**.

**Atualização v2 (ADR-002):** Expandida para incluir duas modalidades de desconto: valor fixo (R$) e porcentagem (%), com interface de toggle para alternar entre os tipos.

---

#### **Fase 1: Estrutura e Lógica de Estado** ✅ **CONCLUÍDA**

Nesta fase, preparamos o estado da aplicação para gerenciar o valor do desconto.

1.  **Análise do Estado do Carrinho:** ✅
    *   Localizado o arquivo `app/src/lib/cart.svelte.ts` onde o estado do carrinho é gerenciado.
    *   Analisada a função `recalculateTotal()` que calcula o subtotal dos itens.

2.  **Criação do Estado de Desconto:** ✅
    *   Adicionado `let discount = $state(0);` para armazenar o valor do desconto.
    *   Criados estados derivados `subtotal` e `total` usando `$derived`.
    *   Implementadas funções `applyDiscount()`, `getDiscount()` e `getSubtotal()`.

3.  **Extensão para Desconto Percentual (ADR-002):** 🔄 **EM ANDAMENTO**
    *   Adicionar `let discountType = $state<'fixed' | 'percentage'>('fixed');` para controlar o tipo.
    *   Modificar função `applyDiscount()` para aceitar tipo e valor.
    *   Implementar lógica de cálculo específica para cada modalidade.

---

#### **Fase 2: Desenvolvimento dos Componentes da Interface (UI)** ✅ **CONCLUÍDA**

O foco aqui foi construir os elementos visuais que permitirão ao usuário aplicar o desconto.

1.  **Componente `DiscountInput.svelte`:** ✅
    *   Criado o arquivo `app/src/lib/components/DiscountInput.svelte`.
    *   Implementada interface com input numérico, botões e validações.
    *   Aplicada estilização seguindo o `tropical-theme` com daisyUI.

2.  **Integração com a View do Carrinho:** ✅
    *   Localizado o componente `CartView.svelte` que renderiza o fluxo de checkout.
    *   Integrado o `DiscountInput` na posição correta do fluxo de checkout.
    *   Reorganizada a estrutura para mostrar subtotal → desconto → total.

3.  **Extensão da Interface (ADR-002):** 🔄 **PENDENTE**
    *   Adicionar toggle de modalidade (R$ / %) no `DiscountInput.svelte`.
    *   Implementar mudança dinâmica de placeholder, validações e step do input.
    *   Atualizar labels e feedback visual conforme o tipo selecionado.

---

#### **Fase 3: Lógica de Negócio e Integração** 🔄 **EM ANDAMENTO**

Esta é a fase final, onde a UI é conectada à lógica de negócio expandida.

1.  **Implementação da Lógica de Aplicação:** 🔄 **PARCIALMENTE CONCLUÍDA**
    *   ✅ Função básica `applyDiscount` já funciona para valor fixo.
    *   🔄 **Expandir** para suportar ambas as modalidades (fixo e percentual).
    *   🔄 **Implementar** função `calculateDiscount(value, type, subtotal)`.
    *   🔄 **Atualizar** validações específicas para cada tipo.

2.  **Atualização da Exibição do Carrinho:** 🔄 **PARCIALMENTE CONCLUÍDA**
    *   ✅ Exibição de subtotal, desconto e total já implementada.
    *   ✅ Reatividade funcionando corretamente.
    *   🔄 **Adicionar** indicador visual do tipo de desconto aplicado.
    *   🔄 **Melhorar** feedback para mostrar "R$ 10,00" vs "10% (R$ 13,00)".

---

#### **Fase 4: Testes e Validação (ADR-002)** 🆕 **NOVA FASE**

Fase adicional para garantir que ambas as modalidades funcionem perfeitamente.

1.  **Testes de Cálculo:**
    *   Validar cálculos para desconto fixo em diferentes cenários.
    *   Validar cálculos para desconto percentual (0% a 100%).
    *   Testar casos extremos (desconto maior que subtotal, porcentagens inválidas).

2.  **Testes de Interface:**
    *   Verificar usabilidade do toggle entre modalidades.
    *   Confirmar feedback visual apropriado para cada tipo.
    *   Testar fluxo completo de aplicação/remoção de desconto.

3.  **Validação de Regras de Negócio:**
    *   Desconto fixo não pode exceder subtotal.
    *   Desconto percentual limitado a 0-100%.
    *   Interface impede inserção de valores inválidos.

---

#### **Especificações Técnicas Atualizadas (ADR-002)**

### **Estados Expandidos no `cart.svelte.ts`:**
```typescript
// Estados existentes (✅ implementados)
let discount = $state(0);
let subtotal = $derived(/* cálculo atual */);
let total = $derived(Math.max(0, subtotal - discount));

// Novos estados (🔄 pendentes)
let discountType = $state<'fixed' | 'percentage'>('fixed');

// Função expandida
function applyDiscount(value: number, type: 'fixed' | 'percentage' = 'fixed') {
  const calculatedDiscount = calculateDiscount(value, type, subtotal);
  discount = calculatedDiscount;
  discountType = type;
  recalculateTotal();
}

function calculateDiscount(value: number, type: 'fixed' | 'percentage', subtotal: number): number {
  if (type === 'fixed') {
    return Math.min(Math.max(0, value), subtotal);
  } else {
    const percentage = Math.min(Math.max(0, value), 100);
    return (subtotal * percentage) / 100;
  }
}
```

### **Interface Expandida no `DiscountInput.svelte`:**
```svelte
<!-- Toggle para tipo de desconto -->
<div class="tabs tabs-boxed mb-2">
  <button class="tab {discountType === 'fixed' ? 'tab-active' : ''}" 
          onclick={() => setDiscountType('fixed')}>
    R$
  </button>
  <button class="tab {discountType === 'percentage' ? 'tab-active' : ''}" 
          onclick={() => setDiscountType('percentage')}>
    %
  </button>
</div>

<!-- Input dinâmico baseado no tipo -->
<input 
  type="number" 
  placeholder={discountType === 'fixed' ? '0,00' : '0'}
  max={discountType === 'fixed' ? subtotal : 100}
  step={discountType === 'fixed' ? '0.01' : '1'}
  bind:value={discountValue}
/>
``` 