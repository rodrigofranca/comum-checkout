### **Plano de Ação: Envio de Recibo por E-mail (FEAT-07) - POC**

> **Status:** 📋 **EM PLANEJAMENTO**  
> **Contexto:** POC - Foco em validação rápida do envio automático de recibos  
> **Estimativa:** 1-2 dias de desenvolvimento

---

## **📊 Estado Atual**

✅ **Já funciona:**
- Integração básica com n8n via webhook (`config.n8nWebhookUrl`)
- Coleta de email do cliente no `CustomerForm.svelte`
- Sistema de envio de dados da compra para n8n
- Indicação visual na `SuccessScreen` se recibo foi enviado (`receiptSent`)
- Estrutura de dados da venda preparada no `CartView.svelte`

⚠️ **Precisa implementar para POC:**
- Template HTML profissional do recibo
- Configuração específica do workflow n8n para envio de email
- Melhoria na estrutura de dados enviados para n8n
- Validação e tratamento de falhas no envio de email

---

## **🎯 Objetivo da FEAT-07 (POC)**

**Foco:** Garantir que o cliente receba automaticamente um recibo por email após a compra, validando a viabilidade do sistema para uso em feira real.

**Não é objetivo:** Sistema de marketing email, templates complexos, múltiplos idiomas, etc.

---

#### **Fase 1: Configuração e Estrutura do Projeto**

**1. Análise do Ambiente:**
- Verificar a atual integração com n8n no `CartView.svelte`
- Analisar payload enviado no webhook (`action: 'process_sale'`)
- Identificar configurações SMTP necessárias no n8n
- Verificar estrutura de dados da compra (`purchaseData`)

**2. Criação de Utilitários:**
- **Criar `email-utils.ts`:** Funções para formatação de dados do recibo
  - Função `formatReceiptData()`: Organizar dados para template
  - Função `validateEmailData()`: Validar dados antes do envio
  - Função `generateReceiptHTML()`: Template HTML inline (fallback)

**3. Melhoria na Estrutura de Dados:**
- **Atualizar payload n8n** com dados específicos para email:
  - Template de email estruturado
  - Metadados para tracking de entrega
  - Informações de fallback e retry

---

#### **Fase 2: Desenvolvimento dos Componentes de Email**

**1. Template HTML do Recibo:**
- **Função:** Template responsivo para email com dados da compra formatados
- **Implementação:**
  - Layout limpo e profissional compatível com clientes de email
  - Cabeçalho com branding "Checkout Comum" / "Acervo Comum"
  - Seção de dados do cliente (nome, email, data/hora da compra)
  - Tabela de itens com nome, quantidade, preço unitário e subtotal
  - Resumo financeiro com subtotal, desconto aplicado e total
  - Informações de pagamento (forma selecionada)
  - Rodapé com dados de contato e agradecimento
  - Suporte a fallback para clientes que não suportam HTML

**2. Configuração do Payload N8N:**
- **Função:** Estruturar dados específicos para processamento de email
- **Implementação:**
  - Expandir `purchaseData` com campos específicos para email:
    ```typescript
    emailData: {
      template: 'purchase_receipt',
      recipient: customerData.email,
      subject: `Recibo da Compra - ${saleId}`,
      data: {
        customer: customerData,
        items: items,
        totals: { subtotal, discount, total },
        payment: { method: selectedPayment },
        sale: { id: saleId, timestamp: purchaseData.timestamp }
      }
    }
    ```

---

#### **Fase 3: Lógica de Negócio e Integração**

**1. Configuração do Workflow N8N:**
- **Definir workflow de email no n8n:**
  1. **Node Webhook:** Receber dados da compra
  2. **Node Validation:** Validar dados obrigatórios para email
  3. **Node Template:** Processar template HTML com dados
  4. **Node Email:** Enviar via SMTP (Gmail/Outlook)
  5. **Node Response:** Confirmar sucesso/falha para frontend
  6. **Node Logging:** Registrar tentativas e resultados

**2. Configuração SMTP/Email:**
- Configurar credenciais SMTP no n8n
- Definir remetente padrão (ex: `noreply@acervocomum.com.br`)
- Configurar retry automático em caso de falha
- Setup de logs estruturados para debugging

**3. Melhorias no Frontend:**
- **Aprimorar feedback visual:**
  - Loading específico: "Enviando recibo..." durante processo
  - Status detalhado na `SuccessScreen`: 
    - ✅ "Recibo enviado para [email]"
    - ⚠️ "Recibo não enviado - tente reenviar"
    - ❌ "Falha no envio - entre em contato"
- **Tratamento de erros específicos:**
  - Detectar falhas de email vs outras falhas
  - Opção de reenvio manual (futuro)
  - Preservar dados da compra mesmo com falha de email

**4. Montagem da Integração:**
- **Atualizar `CartView.svelte`:**
  - Melhorar payload enviado para n8n com `emailData`
  - Tratar resposta específica de envio de email
  - Atualizar `receiptSent` baseado na resposta real do n8n
- **Atualizar `SuccessScreen.svelte`:**
  - Mostrar status específico do email
  - Incluir endereço de email na confirmação
  - Opções de ação em caso de falha

---

## **🎯 Critérios de Sucesso POC**

**Mínimo viável:**
- ✅ Email enviado automaticamente após finalização da compra
- ✅ Template profissional e legível em diferentes clientes de email
- ✅ Dados da compra formatados corretamente no recibo
- ✅ Status correto exibido na tela de sucesso
- ✅ Tratamento gracioso de falhas (sistema continua funcionando)

**Métricas de validação:**
- Taxa de entrega de email > 95%
- Template renderiza corretamente em Gmail, Outlook, Apple Mail
- Feedback positivo dos usuários sobre clareza do recibo
- Zero falhas críticas que impeçam finalização da compra

---

## **📈 Implementação**

1. **Criação de utilitários e template** (3h)
2. **Configuração do workflow n8n** (2h)  
3. **Melhorias no frontend** (2h)
4. **Testes e validação** (1h)

**Total:** ~1 dia de trabalho focado na POC.

---

## **🔄 Fluxo POC Atualizado**

```
[Finalizar] → [Modal Confirmação] → [Processa: Venda + Email] → [Sucesso com Status Email]
```

**Etapas do processamento:**
1. Validando dados...
2. Salvando venda...
3. **Enviando recibo...** ← FEAT-07
4. Atualizando inventário...
5. Finalizando...