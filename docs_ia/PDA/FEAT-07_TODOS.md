### **FEAT-07: Envio de Recibo por E-mail - TODOs Priorizados**

> **Status:** 🚧 **EM DESENVOLVIMENTO**  
> **Data de Início:** 08/08/2025  
> **Desenvolvedor:** Claude Code  
> **Foco:** POC - Envio automático de recibos profissionais por email

---

## **🎯 TODOs Priorizados para POC**

### **Alta Prioridade (Crítico para POC)**

- [ ] **Criar template HTML do recibo** com layout responsivo e dados formatados
- [ ] **Criar módulo email-utils.ts** com funções para formatação e validação
- [ ] **Melhorar payload enviado para n8n** incluindo dados específicos de email
- [ ] **Configurar workflow n8n** para processamento e envio de email via SMTP

### **Média Prioridade (Importante para POC)**

- [ ] **Atualizar loading step** para incluir "Enviando recibo..." na progressão
- [ ] **Melhorar SuccessScreen** com status específico do envio de email
- [ ] **Aprimorar tratamento de erros** para falhas específicas de email
- [ ] **Validar dados de email** antes do envio para n8n

### **Baixa Prioridade (Pós-POC)**

- [ ] **Criar testes para fluxo de email** incluindo falhas e sucessos
- [ ] **Implementar retry manual** para reenvio de recibos falhados

---

## **📊 Estado Atual (Base Implementada)**

### **✅ Já Funciona:**
- Integração básica com n8n via webhook
- Coleta de email no CustomerForm
- Estrutura de dados da compra preparada
- Indicação básica na SuccessScreen

### **⚠️ Precisa Melhorar para POC:**
- Template profissional do recibo
- Dados estruturados para email
- Workflow n8n específico para email
- Feedback visual específico

---

## **🏗️ Estrutura de Implementação**

### **Novos Arquivos:**
```
app/src/lib/
├── email-utils.ts              # Utilitários para email (novo)
└── templates/
    └── receipt-template.ts     # Template HTML do recibo (novo)

docs_ia/email/
└── n8n-workflow.json         # Configuração do workflow n8n (novo)
```

### **Arquivos a Modificar:**
```
CartView.svelte                # Melhorar payload e loading
SuccessScreen.svelte           # Status específico de email
types.ts                       # Novos tipos para email
```

### **Fluxo POC Atualizado:**
```
[Modal Confirmação] → [Salvando venda...] → [Enviando recibo...] → [Sucesso + Status Email]
```

---

## **📋 Detalhamento das Tarefas**

### **🔥 Alta Prioridade**

#### **1. Criar Template HTML do Recibo**
**Arquivo:** `app/src/lib/templates/receipt-template.ts`
- Layout responsivo compatível com clientes de email
- Cabeçalho com branding "Checkout Comum"
- Seção cliente: nome, email, data/hora
- Tabela de itens: nome, qtd, preço unitário, subtotal
- Resumo: subtotal, desconto, total
- Forma de pagamento
- Rodapé com contato e agradecimento
- Fallback para texto simples

#### **2. Criar Módulo email-utils.ts**
**Arquivo:** `app/src/lib/email-utils.ts`
- `formatReceiptData(purchaseData, customerData)`: Organizar dados
- `validateEmailData(emailData)`: Validar antes do envio
- `generateEmailPayload(saleData)`: Criar payload estruturado
- `formatCurrency(value)`: Formatação monetária
- `formatDateTime(timestamp)`: Formatação de data/hora

#### **3. Melhorar Payload N8N**
**Arquivo:** `app/src/lib/components/cart/CartView.svelte`
- Expandir dados enviados para n8n:
  ```typescript
  emailData: {
    template: 'purchase_receipt',
    recipient: customerData.email,
    subject: `Recibo da Compra - ${saleId.slice(-8)}`,
    data: {
      customer: customerData,
      items: formattedItems,
      totals: { subtotal, discount, total },
      payment: { method: selectedPayment },
      sale: { id: saleId, timestamp, location: 'Feira' }
    }
  }
  ```

#### **4. Configurar Workflow N8N**
**Arquivo:** `docs_ia/email/n8n-workflow.json`
- Webhook receiver para dados da compra
- Validação de dados obrigatórios
- Processamento do template HTML
- Envio via SMTP (Gmail/Outlook)
- Response de confirmação para frontend
- Logging de tentativas e resultados

### **🟡 Média Prioridade**

#### **5. Atualizar Loading Step**
**Arquivo:** `app/src/lib/components/cart/CartView.svelte`
- Modificar etapa existente "Enviando recibo..." para ser mais específica
- Adicionar tratamento específico para resposta de email do n8n
- Distinguir falha de email vs falha geral

#### **6. Melhorar SuccessScreen**
**Arquivo:** `app/src/lib/components/cart/SuccessScreen.svelte`
- Status específico do email:
  - ✅ "Recibo enviado para [email]"
  - ⚠️ "Recibo não enviado - dados salvos"
  - ❌ "Falha no envio - entre em contato"
- Mostrar endereço de email na confirmação
- Ícone visual diferenciado por status

#### **7. Aprimorar Tratamento de Erros**
**Arquivo:** `app/src/lib/components/cart/CartView.svelte`
- Detectar especificamente falhas de email vs outras falhas
- Não falhar a venda inteira se apenas email falhar
- Logs específicos para debugging de email
- Toast específico para problemas de email

#### **8. Validar Dados de Email**
**Arquivo:** `app/src/lib/email-utils.ts`
- Validação robusta de formato de email
- Verificação de dados obrigatórios para template
- Sanitização de dados para HTML
- Validação de tamanho do payload

### **🔵 Baixa Prioridade**

#### **9. Criar Testes**
**Arquivo:** `app/src/routes/test/email-receipt/+page.svelte`
- Teste de template HTML
- Teste de envio bem-sucedido
- Teste de falha no envio
- Teste de payload malformado
- Teste de email inválido

#### **10. Implementar Retry Manual**
- Botão "Reenviar Recibo" na SuccessScreen
- Função para reenvio sem reprocessar venda
- Histórico de tentativas de envio

---

## **🎯 Critérios de Aceitação**

### **Funcionais:**
- [ ] Email enviado automaticamente após finalização da compra
- [ ] Template renderiza corretamente em Gmail, Outlook, Apple Mail
- [ ] Todos os dados da compra aparecem corretos no email
- [ ] Status específico do email na tela de sucesso
- [ ] Sistema continua funcionando mesmo com falha de email

### **Não-funcionais:**
- [ ] Taxa de entrega > 95% em testes
- [ ] Template carrega em <3 segundos
- [ ] Processo de envio não adiciona >5s ao checkout
- [ ] Logs estruturados para debugging
- [ ] Fallback gracioso para texto simples

### **UX:**
- [ ] Feedback imediato sobre status do envio
- [ ] Mensagens de erro claras e acionáveis
- [ ] Template profissional e legível
- [ ] Confirmação visual do email enviado

---

## **🔗 Integração com FEAT-06**

A FEAT-07 se integra perfeitamente com o fluxo melhorado do FEAT-06:

1. **Modal de Confirmação** → mostra que email será enviado
2. **Loading Progressivo** → inclui etapa "Enviando recibo..."
3. **Tela de Sucesso** → status específico do email + resumo da venda

O sistema mantém a robustez do FEAT-06 enquanto adiciona a funcionalidade crítica de envio automático de recibos por email.