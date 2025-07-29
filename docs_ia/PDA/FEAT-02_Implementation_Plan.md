### **Plano de Ação: FEAT-02 - Gerenciamento do Carrinho**

#### **Contexto**

A funcionalidade de gerenciamento do carrinho é o núcleo da interação de checkout. O usuário precisa de uma forma clara e imediata de ver os produtos que selecionou, o custo total e modificar sua seleção antes de finalizar a compra.

Analisando o ambiente de teste em `/app/src/routes/test/cart`, verificou-se que um módulo de estado para o carrinho (`$lib/cart.svelte.ts`) já existe e implementa a lógica de adição de itens e cálculo de total.

Este plano foca em completar a funcionalidade (adicionando a remoção de itens) e construir os componentes de UI reutilizáveis para integrar o carrinho à aplicação principal.

---

#### **Análise Técnica do Módulo `cart.svelte.ts`**

1. **Estrutura do Estado (usando Svelte 5 Runes)**
   - O estado do carrinho é gerenciado através da Rune `$state`
   - A estrutura segue a interface `Cart` que contém:
     - `items`: Array de `CartItem` (produto + quantidade)
     - `total`: Número que representa o valor total do carrinho
   - O estado é encapsulado e exposto apenas através de um getter `state`

2. **Implementação Atual**
   - Função `addItem(product: Product)`:
     - Verifica se o produto já existe no carrinho
     - Se existir, incrementa a quantidade
     - Se não existir, adiciona novo item com quantidade 1
   - Função `recalculateTotal()`:
     - Calcula o total somando (preço * quantidade) de cada item
     - É chamada automaticamente após cada modificação do carrinho

3. **Tipos e Interfaces**
   ```typescript
   interface Product {
     id: string;
     codigo: string;
     nome: string;
     preco: number;
     status: 'disponivel' | 'vendido';
     foto_url?: string;
     categoria?: string;
     descricao?: string;
   }

   interface CartItem {
     product: Product;
     quantity: number;
   }

   interface Cart {
     items: CartItem[];
     total: number;
   }
   ```

4. **Observações para Implementação**
   - O módulo já segue boas práticas de encapsulamento
   - A função `recalculateTotal` é reutilizável para as novas funções
   - O uso de Runes simplifica o gerenciamento de estado
   - As interfaces estão bem definidas e cobrem todos os casos de uso

---

#### **Fase 1: Finalização da Lógica de Estado do Carrinho**

Nesta fase, vamos garantir que o módulo de estado do carrinho (`$lib/cart.svelte.ts`) possua todas as funções necessárias para o gerenciamento completo.

1.  **Análise e Complementação do Módulo `cart.svelte.ts`:**
    *   **Analisar:** Ler o arquivo `$lib/cart.svelte.ts` para confirmar a implementação atual que utiliza Svelte 5 Runes (`$state`).
    *   **Implementar `removeItem(productId: string)`:** Adicionar uma função que recebe o ID de um produto e o remove completamente da lista de itens do carrinho, recalculando o total.
    *   **Implementar `updateItemQuantity(productId: string, quantity: number)`:** Adicionar uma função para alterar a quantidade de um item. Se a quantidade for zero, o item deve ser removido.
    *   **Implementar `clearCart()`:** Adicionar uma função para esvaziar o carrinho, zerando a lista de itens e o total.

---

#### **Fase 2: Desenvolvimento dos Componentes da Interface (UI)**

Com a lógica de estado completa, o foco se volta para a construção dos componentes visuais que o usuário final irá interagir.

1.  **Componente `CartItem.svelte`:**
    *   **Função:** Exibir um único item dentro do carrinho.
    *   **Implementação:**
        *   Receberá um objeto do tipo `CartItem` como propriedade.
        *   Exibirá o nome do produto, quantidade, preço unitário e subtotal.
        *   Conterá um botão "Remover" (`-`) que, ao ser clicado, invocará a função `cart.removeItem()` com o ID do produto correspondente.
        *   Conterá botões para ajustar a quantidade (`+` e `-`), que invocarão `cart.updateItemQuantity()`.

2.  **Componente `CartView.svelte`:**
    *   **Função:** Orquestrar a exibição do carrinho, mostrando a lista de itens e o resumo da compra.
    *   **Implementação:**
        *   Lerá o estado diretamente do módulo `$lib/cart.svelte.ts`.
        *   Irá iterar sobre `cart.state.items`, renderizando um componente `CartItem` para cada item.
        *   Exibirá o `cart.state.total` de forma clara.
        *   Conterá um botão "Esvaziar Carrinho" que chamará `cart.clearCart()`.
        *   Será estilizado para ser exibido como um modal ou um painel lateral (`drawer` do DaisyUI).

3.  **Componente `CartFloatingButton.svelte`:**
    *   **Função:** Servir como ponto de acesso principal para o carrinho na interface.
    *   **Implementação:**
        *   Será um botão flutuante, posicionado em um canto da tela.
        *   Exibirá um contador (badge) com o número total de itens únicos no carrinho (`cart.state.items.length`).
        *   Ao ser clicado, controlará a visibilidade do componente `CartView.svelte` (ex: abrindo o modal/drawer).

---

#### **Fase 3: Lógica de Negócio e Integração**

A fase final consiste em conectar os componentes recém-criados com o restante da aplicação.

1.  **Integração com a Listagem de Produtos:**
    *   **Ação:** Modificar o componente `ProductCard.svelte` (ou o evento de clique nele).
    *   **Lógica:** Garantir que o clique no botão "Adicionar ao Carrinho" no card de produto chame a função `cart.addItem(product)`. Isso conectará a seleção de inventário ao nosso sistema de carrinho.

2.  **Montagem na Página Principal:**
    *   **Ação:** Integrar os componentes do carrinho no layout principal da aplicação (provavelmente `app/src/routes/+layout.svelte` ou `+page.svelte`).
    *   **Lógica:**
        1.  Adicionar o `<CartFloatingButton />` para que seja visível em todas as páginas relevantes.
        2.  Adicionar a lógica para renderizar e controlar a visibilidade do `<CartView />` quando o botão flutuante for acionado. 