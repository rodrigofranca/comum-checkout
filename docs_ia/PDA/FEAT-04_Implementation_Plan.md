### **Plano de Ação: Coleta de Dados do Cliente (FEAT-04)**

Este plano detalha os passos para implementar a funcionalidade de coleta de dados do cliente, conforme especificado no requisito **FEAT-04** do PRD.

**Requisito do PRD:** "O usuário deve poder inserir o nome e/ou o e-mail do comprador. O campo de e-mail é obrigatório apenas para o envio do recibo."

---

#### **Fase 1: Análise e Estrutura de Dados**

Nesta fase, definimos o modelo de dados e analisamos a integração com o fluxo de checkout existente.

1. **Análise do Estado Atual:**
   - Verificar o estado atual do carrinho em `app/src/lib/cart.svelte.ts`
   - Analisar a estrutura do `CartView.svelte` para identificar onde integrar o formulário
   - Revisar os tipos existentes em `app/src/lib/types.ts`

2. **Definição do Modelo de Dados:**
   - Criar interface `CustomerData` com campos para nome e email
   - Adicionar estado de dados do cliente ao carrinho ou criar módulo separado
   - Definir estrutura de validação para email

3. **Planejamento da Integração:**
   - Identificar o ponto no fluxo onde coletar os dados (após desconto, antes de finalizar)
   - Planejar persistência temporária dos dados durante a sessão
   - Definir como limpar os dados ao finalizar ou limpar carrinho

---

#### **Fase 2: Desenvolvimento dos Componentes da Interface**

O foco aqui é construir os elementos visuais seguindo o tema tropical e padrões DaisyUI.

1. **Componente `CustomerForm.svelte`:**
   - **Função:** Coletar nome e email do cliente com validação adequada
   - **Implementação:**
     - Criar formulário com campos de nome (opcional) e email (condicional)
     - Implementar validação de email usando regex ou API nativa
     - Aplicar estilização DaisyUI com tema tropical
     - Adicionar feedback visual para estados de validação
     - Implementar lógica para tornar email obrigatório apenas se usuário quiser recibo

2. **Estados e Validação:**
   - **Estados:** `customerName`, `customerEmail`, `emailValid`, `wantsReceipt`
   - **Validação:** Email válido quando `wantsReceipt` é verdadeiro
   - **UX:** Checkbox "Deseja receber recibo por email?" que condiciona obrigatoriedade do email

3. **Integração Visual:**
   - Integrar o componente no `CartView.svelte` entre desconto e finalização
   - Seguir padrão visual existente (espaçamento, cores, tipografia)
   - Adicionar animações suaves para melhor UX

---

#### **Fase 3: Lógica de Negócio e Gerenciamento de Estado**

Esta fase implementa o gerenciamento de estado e integração com o fluxo de checkout.

1. **Gerenciamento de Estado:**
   - **Opção A:** Adicionar ao `cart.svelte.ts` existente
   - **Opção B:** Criar `customer.svelte.ts` separado para maior modularidade
   - Implementar funções: `setCustomerData()`, `clearCustomerData()`, `getCustomerData()`
   - Garantir reatividade com Svelte 5 runes (`$state`, `$derived`)

2. **Validação Implementada:**
   ```typescript
   // Exemplo de estrutura de validação
   function validateEmail(email: string): boolean {
     const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
     return emailRegex.test(email);
   }
   
   function validateCustomerData(data: CustomerData, wantsReceipt: boolean): boolean {
     if (wantsReceipt && !data.email) return false;
     if (data.email && !validateEmail(data.email)) return false;
     return true;
   }
   ```

3. **Integração com Checkout:**
   - Modificar botão "Finalizar Compra" para verificar dados do cliente
   - Implementar feedback de erro se validação falhar
   - Garantir que dados sejam incluídos na finalização da venda

---

#### **Fase 4: Persistência e Integração com Sistema**

Esta fase garante que os dados coletados sejam adequadamente persistidos e integrados.

1. **Persistência Temporária:**
   - Armazenar dados do cliente na sessão durante o checkout
   - Limpar dados automaticamente após finalização ou ao limpar carrinho
   - Implementar persistência no localStorage para casos de recarga acidental

2. **Integração com Finalização:**
   - Modificar função de finalização para incluir dados do cliente
   - Preparar dados para envio ao backend (PocketBase + n8n)
   - Garantir que email seja incluído apenas se fornecido e válido

3. **Limpeza de Dados:**
   - Limpar dados do cliente ao finalizar venda
   - Limpar dados ao esvaziar carrinho
   - Implementar função para limpar dados manualmente se necessário

---

#### **Fase 5: Experiência do Usuário e Refinamentos**

Fase final para polimento da UX e garantia de usabilidade.

1. **Melhorias de UX:**
   - Implementar auto-foco nos campos apropriados
   - Adicionar placeholder text informativo
   - Implementar validação em tempo real (debounced)
   - Adicionar feedback visual para estados de loading/success/error

2. **Acessibilidade:**
   - Adicionar labels adequados para screen readers
   - Implementar navegação por teclado
   - Garantir contraste adequado seguindo tema tropical

3. **Testes de Usabilidade:**
   - Testar fluxo completo: adicionar itens → aplicar desconto → preencher dados → finalizar
   - Validar cenários: email obrigatório vs opcional
   - Testar validação de email com casos edge
   - Verificar comportamento em diferentes tamanhos de tela

---

#### **Especificações Técnicas**

### **Estrutura de Dados:**
```typescript
interface CustomerData {
  name?: string;
  email?: string;
}

interface CustomerState {
  data: CustomerData;
  wantsReceipt: boolean;
  emailValid: boolean;
  isSubmitted: boolean;
}
```

### **Componente CustomerForm.svelte:**
```svelte
<script lang="ts">
  import { customerState, setCustomerData, validateCustomerData } from '$lib/customer.svelte';
  
  let localName = $state('');
  let localEmail = $state('');
  let localWantsReceipt = $state(false);
  
  // Validação reativa
  const isEmailValid = $derived(
    !localWantsReceipt || 
    (localEmail.length > 0 && validateEmail(localEmail))
  );
  
  const canProceed = $derived(
    !localWantsReceipt || 
    (localWantsReceipt && localEmail.length > 0 && isEmailValid)
  );
</script>

<div class="space-y-4 p-4 bg-base-100 rounded-lg border border-primary/20">
  <h3 class="font-semibold text-lg text-primary">Dados do Cliente</h3>
  
  <!-- Campo Nome (sempre opcional) -->
  <div class="form-control">
    <label class="label" for="customer-name">
      <span class="label-text">Nome (opcional)</span>
    </label>
    <input 
      id="customer-name"
      type="text" 
      placeholder="Nome do cliente"
      class="input input-bordered focus:input-primary"
      bind:value={localName}
    />
  </div>
  
  <!-- Checkbox para recibo -->
  <div class="form-control">
    <label class="label cursor-pointer justify-start gap-2">
      <input 
        type="checkbox" 
        class="checkbox checkbox-primary" 
        bind:checked={localWantsReceipt}
      />
      <span class="label-text">Deseja receber recibo por email?</span>
    </label>
  </div>
  
  <!-- Campo Email (condicional) -->
  {#if localWantsReceipt}
    <div class="form-control">
      <label class="label" for="customer-email">
        <span class="label-text">Email <span class="text-error">*</span></span>
      </label>
      <input 
        id="customer-email"
        type="email" 
        placeholder="email@exemplo.com"
        class="input input-bordered focus:input-primary"
        class:input-error={localEmail.length > 0 && !isEmailValid}
        bind:value={localEmail}
        required
      />
      {#if localEmail.length > 0 && !isEmailValid}
        <label class="label">
          <span class="label-text-alt text-error">Email inválido</span>
        </label>
      {/if}
    </div>
  {/if}
</div>
```

### **Integração no CartView.svelte:**
```svelte
<!-- Adicionar após DiscountInput e antes dos botões de ação -->
{#if subtotal > 0}
  <CustomerForm />
{/if}

<!-- Modificar botão de finalizar -->
<button 
  class="btn btn-primary w-full"
  disabled={!canFinalizePurchase}
  onclick={handleFinalizePurchase}
>
  💳 Finalizar Compra
</button>
```

### **Funções de Estado (customer.svelte.ts):**
```typescript
import type { CustomerData } from '$lib/types';

export const customerState = $state({
  data: { name: '', email: '' } as CustomerData,
  wantsReceipt: false,
  emailValid: false,
  isSubmitted: false
});

export function setCustomerData(name: string, email: string, wantsReceipt: boolean) {
  customerState.data.name = name;
  customerState.data.email = email;
  customerState.wantsReceipt = wantsReceipt;
  customerState.emailValid = !wantsReceipt || validateEmail(email);
}

export function clearCustomerData() {
  customerState.data = { name: '', email: '' };
  customerState.wantsReceipt = false;
  customerState.emailValid = false;
  customerState.isSubmitted = false;
}

export function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

export function canFinalizePurchase(): boolean {
  return !customerState.wantsReceipt || 
         (customerState.wantsReceipt && customerState.data.email && customerState.emailValid);
}
```

---

#### **Critérios de Sucesso**

1. **Funcionalidade:**
   - Campo nome sempre opcional e funcional
   - Campo email obrigatório apenas quando usuário deseja recibo
   - Validação de email robusta e em tempo real
   - Dados persistem durante sessão de checkout

2. **UX/UI:**
   - Interface consistente com tema tropical
   - Feedback visual claro para estados de validação
   - Transições suaves entre estados
   - Responsivo em diferentes tamanhos de tela

3. **Integração:**
   - Integração perfeita com fluxo de checkout existente
   - Dados incluídos automaticamente na finalização
   - Limpeza automática de dados após finalização
   - Estado reativo com Svelte 5 runes

4. **Validações de Negócio:**
   - Email válido quando obrigatório
   - Prevenção de finalização com dados inválidos
   - Feedback adequado para usuários
   - Compatibilidade com sistema de envio de recibos