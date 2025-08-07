### **Plano de Ação: Seleção de Forma de Pagamento (FEAT-05)**

#### **Fase 1: Configuração e Estrutura do Projeto**

Nesta fase inicial, o foco é analisar a estrutura existente do checkout e preparar a base para implementação.

1.  **Análise do Ambiente:**
    *   Analisar os componentes existentes do fluxo de checkout na pasta `app/src/lib/components/cart/`.
    *   Verificar como o estado do carrinho é gerenciado com Svelte 5 runes.
    *   Identificar onde a seleção de pagamento deve ser integrada no fluxo.

2.  **Análise da Estrutura de Dados:**
    *   Verificar o modelo atual de dados da venda para entender onde adicionar a forma de pagamento.
    *   Analisar como os dados são enviados para o backend (PocketBase/n8n).

#### **Fase 2: Desenvolvimento dos Componentes da Interface (UI)**

Nesta fase, construa o componente de seleção de pagamento seguindo os padrões do projeto.

1.  **Componente `PaymentSelector.svelte`:**
    *   **Função:** Permitir seleção entre Débito, Crédito e PIX com interface visual clara.
    *   **Implementação:** 
        - Criar componente usando DaisyUI com tema tropical
        - Implementar radio buttons ou botões de seleção
        - Usar ícones apropriados para cada forma de pagamento
        - Gerenciar estado da seleção com `$state`

2.  **Integração com CartView:**
    *   **Função:** Posicionar o seletor de pagamento no fluxo entre desconto e finalização.
    *   **Implementação:** 
        - Modificar `CartView.svelte` para incluir o novo componente
        - Manter consistência visual com outros elementos do checkout

#### **Fase 3: Lógica de Negócio e Integração**

Esta é a fase final, onde o componente é integrado ao estado global e fluxo de dados.

1.  **Gerenciamento de Estado:**
    *   Adicionar campo `paymentMethod` ao estado do carrinho usando Svelte 5 runes.
    *   Implementar validação para garantir que uma forma de pagamento seja selecionada.
    *   Integrar com a lógica de finalização da compra.

2.  **Integração com Backend:**
    *   Modificar os dados enviados para incluir a forma de pagamento selecionada.
    *   Verificar se o modelo de dados no PocketBase precisa ser atualizado.
    *   Garantir que a informação seja incluída no recibo por e-mail.