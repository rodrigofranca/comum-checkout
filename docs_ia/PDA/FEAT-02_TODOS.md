### **FEAT-02: Gerenciamento do Carrinho**

#### **Fase 1: Finalização da Lógica de Estado do Carrinho**

### **TODOs: 1.1 Análise e Complementação do Módulo `cart.svelte.ts`**

- [x] **Análise do código atual:** Ler e documentar a implementação existente do módulo `$lib/cart.svelte.ts`, focando em entender:
  - Como o estado do carrinho está estruturado usando Svelte 5 Runes
  - Como a função `addItem` está implementada
  - Como o cálculo do total é realizado
  - Quais tipos e interfaces estão sendo utilizados

- [x] **Implementar função `removeItem`:** Criar função que remove um item do carrinho
  - Criar a função `removeItem(productId: string)`
  - Implementar a lógica para encontrar e remover o item com o ID correspondente
  - Garantir que o total seja recalculado após a remoção
  - Adicionar testes para validar o comportamento

- [x] **Implementar função `updateItemQuantity`:** Criar função para atualizar quantidade
  - Criar a função `updateItemQuantity(productId: string, quantity: number)`
  - Implementar lógica para atualizar a quantidade do item
  - Se quantidade for 0, remover o item do carrinho
  - Garantir que o total seja recalculado após a atualização
  - Adicionar testes para validar o comportamento

- [x] **Implementar função `clearCart`:** Criar função para limpar o carrinho
  - Criar a função `clearCart()`
  - Implementar lógica para zerar a lista de itens
  - Garantir que o total seja zerado
  - Adicionar testes para validar o comportamento 

#### **Fase 2: Desenvolvimento dos Componentes da Interface (UI)**

### **TODOs: 2.1 Componente CartItem.svelte**

- [x] **Criar estrutura inicial do componente:**
  - Criar o arquivo `app/src/lib/components/cart/CartItem.svelte`
  - Definir a propriedade `item: CartItem` que receberá os dados do item
  - Importar os tipos necessários do módulo `cart.svelte.ts`
  - Importar as funções de manipulação do carrinho

- [x] **Implementar layout base do componente:**
  - Estruturar o HTML seguindo o padrão do DaisyUI com tropical-theme
  - Criar container flexível para organizar as informações do item
  - Adicionar área para exibição da imagem do produto (se disponível)
  - Criar seção para informações textuais (nome, preço)
  - Adicionar área para controles de quantidade e remoção

- [x] **Implementar exibição dos dados do produto:**
  - Renderizar nome do produto de forma destacada
  - Exibir preço unitário formatado em reais
  - Calcular e exibir subtotal (preço * quantidade)
  - Exibir quantidade atual do item
  - Tratar caso de imagem não disponível com fallback

- [x] **Implementar controles interativos:**
  - Adicionar botão de remoção do item que chama `removeItem()`
  - Criar controles de quantidade (+ e -) que chamam `updateItemQuantity()`
  - Implementar feedback visual ao clicar nos botões
  - Garantir que a quantidade não fique negativa
  - Remover item automaticamente quando quantidade chegar a zero 

#### **Fase 3: Lógica de Negócio e Integração**

### **TODOs: 3.1 Integração com a Listagem de Produtos**

- [x] **Analisar o componente ProductCard atual:**
  - Verificar a estrutura atual do componente em `app/src/lib/components/product/ProductCard.svelte`
  - Identificar o melhor local para adicionar o botão "Adicionar ao Carrinho"
  - Verificar como o status do produto é exibido atualmente

- [x] **Modificar o ProductCard para suportar carrinho:**
  - Importar o módulo de estado do carrinho (`$lib/cart.svelte.ts`)
  - Adicionar botão "Adicionar ao Carrinho" seguindo o tropical-theme
  - Implementar lógica de desabilitação do botão para produtos com status 'vendido'
  - Garantir que o layout continue responsivo com o novo botão

- [x] **Implementar interação com o carrinho:**
  - Criar função de callback para o clique no botão
  - Implementar chamada para `cart.addItem(product)`
  - Adicionar verificação para evitar duplicação de chamadas
  - Garantir que o estado do carrinho é atualizado corretamente

- [x] **Adicionar feedback visual:**
  - Implementar animação sutil ao adicionar item ao carrinho
  - Adicionar toast de confirmação usando DaisyUI
  - Atualizar o estado do botão após adicionar ao carrinho
  - Garantir que o feedback seja consistente em diferentes tamanhos de tela 

### **TODOs: 3.2 Montagem na Página Principal**

- [x] **Integração do CartFloatingButton:**
  - Adicionar o componente `<CartFloatingButton />` ao layout principal da aplicação (`app/src/routes/+layout.svelte`)
  - Garantir que o botão seja exibido em todas as páginas relevantes, como a de listagem de produtos
  - Posicionar o botão de forma flutuante em um local fixo da tela (canto inferior direito, por exemplo)

- [x] **Controle de Visibilidade do CartView:**
  - Introduzir uma variável de estado no layout principal para controlar a visibilidade do carrinho (ex: `let showCart = $state(false)`)
  - Conectar o clique do `CartFloatingButton` para alternar o valor dessa variável de estado
  - Passar a variável de estado e a função de controle como propriedades para os componentes, se necessário

- [x] **Renderização Condicional do CartView:**
  - Adicionar o componente `<CartView />` ao layout principal
  - Utilizar a variável de estado para renderizar o `CartView` condicionalmente (ex: usando um bloco `{#if showCart}`)
  - Implementar o `CartView` como um drawer (painel lateral) do DaisyUI para uma experiência de usuário fluida
  - Garantir que, ao ser aberto, o drawer sobreponha o conteúdo da página sem empurrá-lo 