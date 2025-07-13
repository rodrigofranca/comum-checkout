### **FEAT-01B: Busca e Filtros na Listagem de Inventário**

#### **Fase 1: Configuração e Estrutura do Projeto**

### **TODOs: 1.1 Análise do Ambiente**

- [x] **Analisar Estrutura da Página:** Verificar o arquivo `app/src/routes/+page.svelte` para confirmar que ele é o local correto para a implementação da nova funcionalidade de busca e filtro.
- [x] **Validar Dependências Existentes:** Confirmar que o Svelte 5 (com runes) e o DaisyUI estão corretamente configurados no projeto, garantindo que nenhuma nova dependência seja necessária para esta fase. 

---

### **TODOs: 1.2 Inicialização de Serviços e Clientes**

- [x] **Verificar Configuração do PocketBase:** Confirmar que o cliente PocketBase está corretamente inicializado no projeto e que a busca inicial de produtos funciona como esperado, sem necessidade de alterações.
- [x] **Confirmar Lógica Client-Side:** Validar que a estratégia de filtragem no client-side é a mais adequada para a POC, garantindo uma experiência de usuário fluida e em tempo real.

---

#### **Fase 2: Desenvolvimento dos Componentes da Interface (UI)**

### **TODOs: 2.1 Componente SearchBar.svelte**

- [x] **Criar Estrutura do Arquivo:** Criar o arquivo do componente em `app/src/lib/components/forms/SearchBar.svelte`.
- [x] **Definir Propriedades (Bindings):** Especificar que o componente utilizará `bind:value` para as propriedades `searchTerm`, `minPrice` e `maxPrice`.
- [x] **Implementar o Layout do Formulário:** Estruturar o formulário com um campo de texto para busca e dois campos numéricos para preço (mínimo e máximo), utilizando classes do DaisyUI (`form-control`, `input`, `input-bordered`).

---

#### **Fase 3: Lógica de Negócio e Integração**

### **TODOs: 3.1 Lógica de Estado e Filtragem (Client-Side)**

- [x] **Criar os `estados` para os filtros:** No script de `app/src/routes/+page.svelte`, definir os seguintes estados com `$state`: `searchTerm`, `minPrice`, e `maxPrice`.
- [x] **Implementar a variável derivada `filteredInventory`:** Usar `$derived` para criar uma nova lista de inventário que reage às mudanças nos estados de filtro.
- [x] **Aplicar a lógica de filtro de texto (`searchTerm`):** A variável derivada deve filtrar a lista de inventário com base no `nome` ou `codigo` do produto, ignorando maiúsculas e minúsculas.
- [x] **Aplicar a lógica de filtro de preço mínimo (`minPrice`):** A variável derivada deve remover itens com preço inferior ao `minPrice` selecionado.
- [x] **Aplicar a lógica de filtro de preço máximo (`maxPrice`):** A variável derivada deve remover itens com preço superior ao `maxPrice` selecionado.

---

### **TODOs: 3.2 Montagem da Página Principal (`+page.svelte`)**

- [x] **Importar o componente `SearchBar.svelte`:** Verificar se o componente `SearchBar` está corretamente importado na página principal.
- [x] **Conectar os estados aos componentes via `bind:`:** Garantir que as variáveis de estado (`searchTerm`, `minPrice`, `maxPrice`) estejam conectadas ao componente `SearchBar` usando a diretiva `bind:`.
- [x] **Atualizar o componente `InventoryGrid`:** Modificar a propriedade do componente `InventoryGrid` para receber a lista derivada `filteredInventory` em vez da lista completa de dados (`data.products`).
- [x] **Testar a integração completa:** Verificar se a busca e os filtros funcionam em tempo real na interface do usuário, sem necessidade de chamadas ao servidor. 