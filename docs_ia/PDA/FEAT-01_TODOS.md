#### **Fase 1: Configuração e Estrutura do Projeto**

## TODOs: Inicialização do Cliente PocketBase

- [x] **Criar o arquivo `src/lib/pocketbase.ts`:** Este arquivo será responsável por encapsular a lógica de conexão com o PocketBase.
- [x] **Importar a dependência `pocketbase`:** Adicionar a linha `import PocketBase from 'pocketbase';` no início do arquivo.
- [x] **Definir a URL do servidor PocketBase:** Criar uma constante para armazenar a URL da API, como `const POCKETBASE_URL = 'http://127.0.0.1:8090';`.
- [x] **Criar e exportar a instância do cliente PocketBase:** Inicializar uma nova instância com `const pb = new PocketBase(POCKETBASE_URL);` e exportá-la com `export default pb;` para que possa ser usada em outras partes da aplicação.

#### **Fase 2: Desenvolvimento dos Componentes da Interface**

### **TODOs: 2.1 `ProductCard.svelte` - O Cartão do Produto**


- [x] **Criar o arquivo do componente:** Criar o arquivo em `src/lib/components/ProductCard.svelte`.
- [x] **Definir as propriedades (`props`)**: O componente deverá receber um objeto `product` contendo os dados do item de inventário.
- [x] **Estruturar o layout com `daisyUI`**: Utilizar o componente `card` do `daisyUI` para exibir a imagem, nome, código e preço.
- [x] **Construir a URL da imagem**: A URL da imagem do produto deve ser montada dinamicamente, utilizando o `collectionId`, o `id` do registro e o nome do arquivo da imagem, conforme a API do PocketBase.
- [x] **Exibir informações do produto**: Renderizar o nome (`title`), código (`product_id`) e o preço (`price`) dentro da estrutura do `card`.

### **TODOs: 2.2 `SearchBar.svelte` - A Barra de Busca**

- [x] **Criar o arquivo do componente:** Criar o arquivo em `src/lib/components/SearchBar.svelte`.
- [x] **Estruturar o formulário de busca**: Implementar um `<form>` com um `<input type="text">` para o termo de busca e um botão de submissão.
- [x] **Estilizar com `daisyUI`**: Aplicar classes do `daisyUI` para estilizar o campo de input e o botão.
- [x] **Gerenciar o estado do input**: Criar uma variável para armazenar o valor do campo de busca.
- [x] **Submeter o termo de busca**: Garantir que, ao submeter o formulário, a página seja recarregada com o termo de busca como um parâmetro de URL (ex: `?q=Camisa`), permitindo a filtragem no lado do servidor. 

### **TODOs: 2.3 `InventoryGrid.svelte` - A Grade de Produtos**

- [x] **Criar o arquivo do componente:** Criar o arquivo em `src/lib/components/InventoryGrid.svelte`.
- [x] **Definir as propriedades (`props`)**: O componente deverá receber uma lista de `products`.
- [x] **Estruturar o layout com `daisyUI` e `tailwindcss`**: Utilizar um grid responsivo.
- [x] **Iterar e renderizar `ProductCard`**: Usar `{#each}` para mostrar cada produto usando `ProductCard.svelte`.

#### **Fase 3: Lógica de Negócio e Integração**

### **TODOs: 3.1 Busca de Dados (Data Fetching) na Rota Principal**

- [x] **Criar o `endpoint` do lado do servidor:** Criar o arquivo `src/routes/+page.server.ts` para buscar os dados antes que a página seja renderizada.
- [x] **Implementar a função `load`:** No arquivo criado, definir e exportar uma função `load` assíncrona, que o SvelteKit executará no servidor.
- [x] **Ler parâmetros da URL:** Dentro da função `load`, acessar o objeto `url` para extrair o parâmetro de busca `q`, se ele existir.
- [x] **Construir filtro dinâmico para a consulta:**
    - Iniciar com um filtro base para buscar apenas produtos com `status = 'disponível'`.
    - Se o parâmetro `q` for fornecido, adicionar à consulta uma condição `(title ~ {:q} || product_id ~ {:q})`, usando a sintaxe de `LIKE` do PocketBase.
- [x] **Otimizar a consulta da API:** Na chamada ao SDK do PocketBase, usar a opção `fields` para solicitar apenas os campos essenciais: `collectionId`, `id`, `image`, `title`, `product_id`, e `price`.
- [x] **Executar a busca de dados:** Chamar `pb.collection('inventory').getFullList()` com as opções de `filter` e `fields` configuradas.
- [x] **Retornar os dados para a página:** Retornar um objeto contendo a lista de produtos obtidos para que eles fiquem disponíveis no componente `+page.svelte`.

### **TODOs: 3.2 Montagem da Página Principal (`src/routes/+page.svelte`)**

- [x] **Acessar os dados da função `load`**: No script do componente `+page.svelte`, acessar os dados dos produtos que foram retornados pela função `load` do `+page.server.ts`.
- [x] **Renderizar `SearchBar`**: Importar e renderizar o componente `SearchBar.svelte` no topo da página, permitindo que o usuário insira termos de busca.
- [x] **Renderizar `InventoryGrid`**: Importar e renderizar o componente `InventoryGrid.svelte`, passando a lista de produtos (recebida da função `load`) como uma propriedade. 