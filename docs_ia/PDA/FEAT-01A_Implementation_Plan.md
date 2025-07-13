### **Plano de Ação: Seleção de Itens da Lista (FEAT-01A) - v2 (Svelte 5)**

O objetivo desta feature é permitir que o usuário adicione produtos ao carrinho diretamente da listagem de inventário, utilizando a reatividade do **Svelte 5 com Runes**. A implementação conectará os componentes de listagem (`FEAT-01`) com a lógica de gerenciamento do carrinho (`FEAT-02`).

---

#### **Fase 1: Estruturação do Estado Reativo do Carrinho com Runes**

O ponto central desta funcionalidade é um estado de carrinho de compras que seja global e reativo. Com Svelte 5, isso é alcançado de forma elegante criando um módulo de estado com a rune `$state`.

1.  **Definição das Estruturas de Dados (Tipos):**
    *   Criar um arquivo de tipos em `app/src/lib/types.ts` para garantir consistência.
    *   **`Product`**: A estrutura já definida no PRD.
        ```typescript
        export interface Product {
          id: string;
          codigo: string;
          nome: string;
          preco: number;
          status: 'disponivel' | 'vendido';
          foto_url?: string;
          categoria?: string;
          descricao?: string;
        }
        ```
    *   **`CartItem`**: Representará um item dentro do carrinho.
        ```typescript
        export interface CartItem {
          product: Product;
          quantity: number;
        }
        ```
    *   **`Cart`**: A estrutura do carrinho em si.
        ```typescript
        export interface Cart {
          items: CartItem[];
          total: number;
        }
        ```

2.  **Criação do Módulo de Estado do Carrinho (`cart.svelte.ts`):**
    *   Criar o arquivo do estado em `app/src/lib/cart.svelte.ts`.
    *   Neste arquivo, usar `$state` para criar um objeto de carrinho reativo.
    *   Exportar o estado e as funções que o manipulam. A reatividade do Svelte 5 garantirá que qualquer componente que importe e use `cart` será atualizado quando ele mudar.
        ```typescript
        // app/src/lib/cart.svelte.ts
        import type { Cart, Product } from '$lib/types';

        const cart = $state<Cart>({ items: [], total: 0 });

        function addItem(product: Product) {
          const existingItem = cart.items.find(item => item.product.id === product.id);
          if (existingItem) {
            existingItem.quantity++;
          } else {
            cart.items.push({ product, quantity: 1 });
          }
          recalculateTotal();
        }

        function recalculateTotal() {
            cart.total = cart.items.reduce((sum, item) => sum + (item.product.preco * item.quantity), 0);
        }

        // ... outras funções como removeItem, updateQuantity ...

        export default {
            get state() { return cart; },
            addItem
            // ...
        }
        ```

---

#### **Fase 2: Desenvolvimento da Interação na Interface (UI)**

Nesta fase, os componentes visuais serão modificados para interagir com o estado reativo do carrinho.

1.  **Modificação do Componente `ProductCard.svelte`:**
    *   **Função:** Tornar o card do produto um elemento interativo que dispara a adição do item ao carrinho.
    *   **Implementação:**
        1.  Importar o objeto `cart` do módulo `app/src/lib/cart.svelte.ts`.
        2.  Adicionar um evento `on:click` ao elemento principal do card.
        3.  No manipulador do evento de clique, invocar a função `cart.addItem(product)`, passando o objeto do produto que o card representa.
        4.  **Feedback Visual:** Implementar uma microinteração para que o usuário perceba o clique.

2.  **Validação no Componente `InventoryGrid.svelte`:**
    *   **Função:** Assegurar que os dados necessários do produto sejam corretamente passados para cada `ProductCard`.
    *   **Implementação:** Revisar o laço `#each` para garantir que o objeto de produto completo seja passado como uma *prop*.

---

#### **Fase 3: Conexão e Feedback Visual do Carrinho**

A ação precisa de uma resposta imediata e visível para o usuário.

1.  **Integração com o `CartFloating.svelte`:**
    *   **Função:** Exibir a quantidade de itens no carrinho em tempo real.
    *   **Implementação:**
        1.  Importar o objeto `cart` do módulo `app/src/lib/cart.svelte.ts`.
        2.  Acessar diretamente as propriedades reativas para exibir a contagem de itens (ex: `cart.state.items.length`).
        3.  Como `cart.state` é reativo, o Svelte 5 garantirá que a UI do componente seja atualizada automaticamente. 