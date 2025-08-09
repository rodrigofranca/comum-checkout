### **Plano de Ação: Finalização da Venda (FEAT-06) - POC**

> **Status:** 📋 **EM PLANEJAMENTO**  
> **Contexto:** POC - Foco em validação rápida  
> **Estimativa:** 1-2 dias de desenvolvimento

---

## **📊 Estado Atual**

✅ **Já funciona:**
- Função `finalizePurchase()` básica no `CartView.svelte`
- Salvamento de vendas no PocketBase 
- Integração com n8n configurada
- Sistema de toast básico

⚠️ **Precisa melhorar para POC:**
- Confirmação antes de finalizar
- Feedback visual durante processamento
- Tratamento básico de erros

---

## **🎯 Objetivo da FEAT-06 (POC)**

**Foco:** Garantir que a finalização seja **confiável** e **clara** para validar a POC em uma feira real.

**Não é objetivo:** Sistema enterprise com recovery complexo, analytics, etc.

---

#### **Fase 1: Modal de Confirmação (Essencial)**

**O que:** Modal simples para confirmação antes de processar venda.

**Implementação:**
1. **Criar `PurchaseConfirmationModal.svelte`:**
   - Props: `isOpen`, `purchaseData`, `onConfirm`, `onCancel`
   - Layout: Lista de itens, total, cliente, pagamento
   - Botões: "Confirmar Venda" e "Voltar"

2. **Integrar ao CartView:**
   - Mostrar modal antes de `finalizePurchase()`
   - Só processar após confirmação

#### **Fase 2: Feedback Visual (Importante)**

**O que:** Usuário vê o que está acontecendo durante processamento.

**Implementação:**
1. **Melhorar loading state existente:**
   - Mensagem específica: "Salvando venda...", "Enviando recibo...", "Atualizando inventário..."
   - Desabilitar interface durante processo

2. **Tela de sucesso simples:**
   - Mostrar resumo após finalização
   - Botão "Nova Venda" para reset rápido

#### **Fase 3: Tratamento de Erros Básico (Crítico)**

**O que:** Se algo falhar, usuário sabe o que aconteceu.

**Implementação:**
1. **Melhorar função `finalizePurchase()`:**
   - Validações básicas (carrinho vazio, pagamento selecionado)
   - Try/catch com mensagens específicas
   - Não limpar carrinho se houve erro

2. **Mensagens de erro claras:**
   - "Erro de conexão - tente novamente"
   - "Erro ao salvar - dados preservados"
   - Botão "Tentar Novamente"

---

## **🏗️ Componentes (Mínimos)**

```
CartView.svelte (existente - melhorar)
└── PurchaseConfirmationModal.svelte (novo)
└── Loading states (melhorar existente)
└── Error handling (melhorar existente)
```

## **📋 Estrutura de Dados (Simples)**

```typescript
interface ConfirmationData {
  items: CartItem[];
  total: number;
  customer: CustomerData;
  paymentMethod: string;
}

interface ProcessingState {
  isProcessing: boolean;
  currentStep: string;
  error?: string;
}
```

## **⚡ Fluxo POC**

```
[Finalizar] → [Modal Confirmação] → [Processa com Loading] → [Sucesso/Erro]
```

## **🎯 Critérios POC**

**Mínimo viável:**
- ✅ Usuário confirma antes de finalizar
- ✅ Vê feedback durante processamento  
- ✅ Entende se deu certo ou errado
- ✅ Pode tentar novamente se falhar

**Meta:** Sistema robusto o suficiente para usar numa feira sem perder vendas.

---

## **📈 Implementação**

1. **Modal de confirmação** (4h)
2. **Melhorar loading/feedback** (2h)  
3. **Tratamento de erros** (2h)
4. **Testes** (2h)

**Total:** ~1 dia de trabalho focado na POC.