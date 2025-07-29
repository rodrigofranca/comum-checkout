# FEAT-02B: POC Tropical Migration Plan - TODOs

## Fase 2: Componentes POC com Tropical Theme

### **TODOs: 2.1 `InventoryGrid.svelte` (Upgrade)**

- [x] **Ajustar grid responsivo:** Embora já exista, revisar as classes do Tailwind para garantir que o grid se comporte conforme o design do `tropical-theme`: 1 coluna em mobile, 2 em tablet e 3 ou mais em desktop.
- [x] **Aplicar estilos do tema ao grid:** Adicionar a classe `.inventory-grid` (gap-4 p-4) ao contêiner do grid para padronização, conforme especificado no plano.
- [x] **Garantir que os cards filhos (`ProductCard`) usem o estilo `tropical-theme`:** Embora a responsabilidade seja do `ProductCard`, validar se o `InventoryGrid` não está sobrescrevendo ou interferindo nos estilos de sombra e hover (`bg-base-100`, `hover:bg-base-200`).
- [x] **Revisar estado de "nenhum produto":** Garantir que a mensagem de "Nenhum produto encontrado" esteja estilizada de forma consistente com o `tropical-theme`.

### **TODOs: 2.2 `ProductCard.svelte` (Upgrade)**

- [x] **Aplicar o estilo `tropical-theme` ao card:** Substituir o `shadow-xl` e `hover:scale-105` por um `shadow-md` e `hover:shadow-lg`, conforme especificado na folha de estilos do plano.
- [x] **Ajustar a imagem do produto:** Aplicar a classe `rounded-box` na imagem para seguir o padrão visual do tema.
- [x] **Estilizar o nome do produto:** Garantir que o nome (`card-title`) use a cor `text-base-content`, o que geralmente é o padrão, mas vale a pena validar.
- [x] **Atualizar o estilo do preço:** Mudar o `badge badge-outline` para as classes `text-primary font-bold` e formatar o texto para uma melhor exibição (ex: `text-xl`).
- [x] **Atualizar o botão "Adicionar":** Alterar o botão de `btn-md` para `btn btn-circle btn-primary btn-sm` e usar apenas um ícone de "+", conforme o plano.
- [x] **Simplificar a exibição de dados:** Remover a exibição do código do produto (`product_id`) para manter a interface da POC mais limpa.

### **TODOs: 2.3 `SearchBar.svelte` (Upgrade)**

- [x] **Aplicar estilo ao campo de busca:** Substituir o estilo atual do campo de input pela classe `input input-bordered` do `tropical-theme` para uma aparência consistente.
- [x] **Estilizar o ícone de busca:** Garantir que o ícone de lupa dentro do campo de busca utilize a cor `text-primary`.
- [x] **Implementar filtro de preço com `range`:** Adicionar um filtro de preço básico utilizando o componente `range range-primary` para permitir o ajuste de valor.
- [x] **Adicionar e estilizar botão de limpar:** Incluir um botão para limpar o campo de busca com o estilo `btn btn-ghost btn-sm`.

### **TODOs: 2.4 `CartFloating.svelte` (Upgrade)**

- [x] **Atualizar o estilo do badge:** Garantir que o contador de itens no carrinho use a classe `badge badge-secondary` para destaque.
- [x] **Ajustar o botão principal:** Modificar o botão para que utilize as classes `btn btn-primary btn-circle btn-lg`, tornando-o maior e mais proeminente.
- [x] **Verificar o posicionamento:** Confirmar se o componente está posicionado corretamente no canto inferior direito da tela com as classes `fixed bottom-4 right-4`.

### **TODOs: 2.5 `CheckoutFlow.svelte` (Novo)**

- [ ] **Criar a estrutura do modal:** Desenvolver o componente como um modal (`modal modal-open`) que cobre a tela para focar o usuário no processo de checkout.
- [ ] **Aplicar o estilo `tropical-theme`:** Utilizar `bg-base-100` para o fundo do modal e garantir que os elementos internos sigam o guia de estilo.
- [ ] **Implementar os steps do checkout:** Adicionar um indicador de passos (`steps`) para guiar o usuário, utilizando as cores do `tropical-theme`.
- [ ] **Estilizar os botões de ação:** Garantir que os botões de "Continuar" e "Voltar" usem as classes `btn btn-primary` e `btn btn-secondary`, respectivamente.
- [ ] **Adicionar o componente ao layout:** Integrar o `CheckoutFlow.svelte` ao `+layout.svelte` ou a uma página específica para que ele possa ser acionado. 