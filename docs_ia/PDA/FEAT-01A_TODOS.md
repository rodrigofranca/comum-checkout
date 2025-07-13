### **FEAT-01A: Seleção de Itens da Lista**

#### **Fase 1: Estruturação do Estado Reativo do Carrinho com Runes**

##### **TODOs: 1.1 Definição das Estruturas de Dados (Tipos)**

- [x] **Ação 1:** Criar a estrutura de diretórios `app/src/lib`.
- [x] **Ação 2:** Criar o arquivo `app/src/lib/types.ts`.
- [x] **Ação 3:** Adicionar e exportar a interface `Product` no arquivo `types.ts`.
- [x] **Ação 4:** Adicionar e exportar a interface `CartItem` no arquivo `types.ts`, importando `Product`.
- [x] **Ação 5:** Adicionar e exportar a interface `Cart` no arquivo `types.ts`, importando `CartItem`.

##### **TODOs: 1.2 Criação do Módulo de Estado do Carrinho (`cart.svelte.ts`)**

- [x] **Ação 1:** Criar o arquivo `app/src/lib/cart.svelte.ts`.
- [x] **Ação 2:** No arquivo `cart.svelte.ts`, importar os tipos `Cart` e `Product` do arquivo `$lib/types.ts`.
- [x] **Ação 3:** Inicializar o estado reativo principal do carrinho (`cart`) utilizando `$state<Cart>({...})` com os valores iniciais (`items: [], total: 0`).
- [x] **Ação 4:** Implementar a função interna `recalculateTotal()` que itera sobre `cart.items` e atualiza o valor de `cart.total`.
- [x] **Ação 5:** Implementar a função `addItem(product: Product)`, que verifica se um produto já existe no carrinho para incrementar sua quantidade ou adicioná-lo como um novo item, e então chama a função `recalculateTotal()`.
- [x] **Ação 6:** Exportar um objeto default que expõe o estado (`get state() { return cart; }`) e as funções (`addItem`) para serem consumidas por outros componentes.

---

#### **Fase 2: Desenvolvimento da Interação na Interface (UI)**

##### **TODOs: 2.1 Modificação do Componente `ProductCard.svelte`**

- [x] **Ação 1:** No componente `ProductCard.svelte`, importar o estado do carrinho (`cart`) a partir de `app/src/lib/cart.svelte.ts`.
- [x] **Ação 2:** Adicionar um evento `on:click` ao elemento raiz do card que chama a função `cart.addItem(product)`.
- [x] **Ação 3:** Garantir que a propriedade `product` seja recebida corretamente pelo componente para ser usada na função `addItem`.
- [x] **Ação 4:** (Opcional) Implementar uma microinteração visual de feedback no clique, como uma leve animação ou mudança de cor no card.

##### **TODOs: 2.2 Validação no Componente `InventoryGrid.svelte`**

- [x] **Ação 1:** Localizar e analisar o componente `InventoryGrid.svelte`.
- [x] **Ação 2:** Verificar se o `ProductCard` está sendo chamado dentro de um laço `#each`.
- [x] **Ação 3:** Confirmar que o objeto de produto completo (`product`) está sendo passado como propriedade para cada `ProductCard`.

---

#### **Fase 3: Conexão e Feedback Visual do Carrinho**

##### **TODOs: 3.1 Integração com o `CartFloating.svelte`**

- [x] **Ação 1:** Localizar e analisar o componente `CartFloating.svelte`.
- [x] **Ação 2:** Importar o estado do carrinho (`cart`) de `$lib/cart.svelte`.
- [x] **Ação 3:** Utilizar o estado reativo do carrinho para exibir dinamicamente o número de itens (`cart.state.items.length`).
- [x] **Ação 4:** Adicionar uma lógica para exibir o componente apenas quando houver itens no carrinho.