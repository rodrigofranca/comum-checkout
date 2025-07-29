### **FEAT-03: Aplicação de Desconto - v2 (ADR-002)**

**Atualização:** Expandida para incluir duas modalidades de desconto conforme ADR-002: valor fixo (R$) e porcentagem (%).

---

#### **Fase 1: Estrutura e Lógica de Estado** ✅ **CONCLUÍDA BASE / 🔄 EXTENSÃO PENDENTE**

### **TODOs: 1.1 Análise e Criação do Estado de Desconto**
- [x] **Analisar o Estado do Carrinho:** Localizar o arquivo `Cart.svelte.ts` e entender como o `subtotal` é calculado.
- [x] **Criar Estado para Desconto:** No arquivo `Cart.svelte.ts`, declarar `let discount = $state(0);` para armazenar o valor do desconto.
- [x] **Criar Estado Derivado para Total:** No mesmo arquivo, criar uma `rune` derivada (ex: `let total = $derived(subtotal - discount);`) para calcular o total da compra.

### **TODOs: 1.2 Extensão para Desconto Percentual (ADR-002)**
- [x] **Adicionar Estado do Tipo de Desconto:** No `cart.svelte.ts`, declarar `let discountType = $state<'fixed' | 'percentage'>('fixed');`.
- [x] **Expandir Função applyDiscount:** Modificar para aceitar `applyDiscount(value: number, type: 'fixed' | 'percentage')`.
- [x] **Implementar Função calculateDiscount:** Criar lógica de cálculo específica para cada modalidade.
- [x] **Adicionar Getter para Tipo:** Exportar função `getDiscountType()` para acessar o tipo atual.

---

#### **Fase 2: Desenvolvimento dos Componentes da Interface (UI)** ✅ **BASE CONCLUÍDA / 🔄 EXTENSÃO PENDENTE**

### **TODOs: 2.1 Componente `DiscountInput.svelte`**
- [x] **Criar o arquivo do componente:** `src/lib/components/DiscountInput.svelte`.
- [x] **Estruturar o layout:** Adicionar um `<input type="number">`, um `<button>`, e utilizar classes do `daisyUI` seguindo o `tropical-theme`.

### **TODOs: 2.2 Integração com a View do Carrinho**
- [x] **Localizar o Componente do Carrinho:** Identificar o componente que renderiza o fluxo de checkout (CartView.svelte).
- [x] **Renderizar o Componente de Desconto:** Importar e adicionar o `<DiscountInput />` na view do carrinho, próximo ao subtotal.

### **TODOs: 2.3 Extensão da Interface (ADR-002)**
- [x] **Adicionar Toggle de Modalidade:** Implementar tabs/toggle para alternar entre "R$" e "%" no `DiscountInput.svelte`.
- [x] **Implementar Input Dinâmico:** Fazer o input mudar `placeholder`, `max`, `step` baseado no tipo selecionado.
- [x] **Atualizar Labels e Feedback:** Adaptar textos e validações visuais para cada modalidade.
- [x] **Melhorar Exibição do Desconto Aplicado:** Mostrar "R$ 10,00" para fixo ou "10% (R$ 13,00)" para percentual.

---

#### **Fase 3: Lógica de Negócio e Integração** 🔄 **PARCIALMENTE CONCLUÍDA**

### **TODOs: 3.1 Implementação da Lógica de Aplicação**
- [x] **Criar a função de aplicação:** No `DiscountInput.svelte`, criar a função `applyDiscount` *(funcional para valor fixo)*.
- [x] **Vincular a função ao botão:** Chamar `applyDiscount` no evento `onclick` do botão.
- [x] **Atualizar o estado global:** Dentro de `applyDiscount`, importar o estado do carrinho e atualizar o valor da `rune` `discount` com o valor do input.
- [x] **Implementar Regra de Negócio:** Adicionar lógica para garantir que o desconto não exceda o subtotal da compra *(para valor fixo)*.

### **TODOs: 3.2 Atualização da Exibição do Carrinho**
- [x] **Exibir valores no carrinho:** No componente do carrinho, exibir o `subtotal`, o `discount` e o `total`.
- [x] **Garantir Reatividade:** Confirmar que os valores na tela são atualizados automaticamente sempre que o desconto for aplicado.

### **TODOs: 3.3 Extensão da Lógica (ADR-002)**
- [x] **Adaptar Função applyDiscount:** Modificar no `DiscountInput.svelte` para enviar tipo junto com valor.
- [x] **Implementar Validações por Tipo:** Adicionar validações específicas para desconto fixo (≤ subtotal) e percentual (≤ 100%).
- [x] **Atualizar Estado do Tipo:** Garantir que o tipo de desconto seja persistido e exibido corretamente.
- [x] **Implementar Limpeza Inteligente:** Ao mudar tipo, limpar ou converter valor atual se aplicável.

---

#### **Fase 4: Testes e Validação (ADR-002)** 🆕 **NOVA FASE**

### **TODOs: 4.1 Testes de Cálculo**
- [x] **Testar Desconto Fixo:** Validar cálculos em cenários: R$ 10 de R$ 100, R$ 150 de R$ 100 (limitado), R$ 0.
- [x] **Testar Desconto Percentual:** Validar cálculos: 10% de R$ 100 = R$ 10, 100% = R$ 100, 150% (limitado a 100%).
- [x] **Testar Casos Extremos:** Carrinho vazio, valores negativos, valores decimais em porcentagem.

### **TODOs: 4.2 Testes de Interface**
- [x] **Testar Toggle de Modalidade:** Verificar se mudança entre R$ e % funciona corretamente.
- [x] **Testar Validações Visuais:** Confirmar que input mostra erro para valores inválidos em cada modalidade.
- [x] **Testar Feedback de Desconto:** Verificar se desconto aplicado mostra formato correto ("R$ 10,00" vs "10% (R$ 10,00)").
- [x] **Testar Responsividade:** Garantir que interface funciona bem em diferentes tamanhos de tela.

### **TODOs: 4.3 Validação de Regras de Negócio**
- [x] **Validar Limite Fixo:** Confirmar que desconto fixo não pode exceder subtotal.
- [x] **Validar Limite Percentual:** Confirmar que porcentagem está limitada a 0-100%.
- [x] **Validar Persistência:** Verificar se tipo e valor persistem durante a sessão.
- [x] **Validar Limpeza de Carrinho:** Confirmar que desconto é zerado quando carrinho é limpo.

---

#### **Resumo de Status:**

- ✅ **Fase 1:** Concluída
- ✅ **Fase 2:** Concluída
- ✅ **Fase 3:** Concluída
- ✅ **Fase 4:** Concluída

**Próximo:** Feature finalizada e validada. 