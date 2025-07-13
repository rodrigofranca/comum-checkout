### **Plano de Ação: Implementação da Listagem Visual de Inventário (FEAT-01)**

#### **Fase 1: Configuração e Estrutura do Projeto**

1.  **Análise do Ambiente:**
    *   Verificar a estrutura de pastas existente para confirmar se o projeto SvelteKit já foi iniciado.
    *   Analisar o `package.json` para identificar as dependências já instaladas.
    *   Instalar as dependências necessárias, caso ausentes:
        *   `pocketbase`: O SDK JavaScript para interagir com a API do PocketBase.
        *   `daisyui`: Para a construção da interface, conforme as regras do projeto.
        *   `tailwindcss`: Dependência para o `daisyUI`.

2.  **Inicialização do Cliente PocketBase:**
    *   Criar um módulo para centralizar a conexão com o PocketBase (ex: `src/lib/pocketbase.ts`).
    *   Neste módulo, inicializar e exportar uma instância única (singleton) do cliente PocketBase, configurada com a URL do servidor (ex: `http://127.0.0.1:8090`).

#### **Fase 2: Desenvolvimento dos Componentes da Interface**

Vou seguir a estrutura de componentes sugerida no PRD.

1.  **`ProductCard.svelte` - O Cartão do Produto:**
    *   **Função:** Exibir as informações de um único item do inventário.
    *   **Implementação:**
        *   Receber um objeto `product` como propriedade.
        *   Utilizar os componentes do `daisyUI` (como `card`) para exibir a imagem, nome (`title`), código (`product_id`) e preço (`price`).
        *   Construir a URL da imagem dinamicamente, usando o `collectionId`, o `id` do registro e o nome do arquivo de imagem, conforme a API do PocketBase.

2.  **`SearchBar.svelte` - A Barra de Busca e Filtros:**
    *   **Função:** Permitir que o usuário busque itens por nome ou código (FEAT-01B).
    *   **Implementação:**
        *   Criar um formulário (`<form>`) com um campo de texto (`<input type="text">`).
        *   Quando o formulário for submetido, a página será recarregada com o termo de busca como um parâmetro de URL (ex: `?q=Camisa`). Isso seguirá o padrão do SvelteKit para filtragem de dados no lado do servidor.

3.  **`InventoryGrid.svelte` - A Grade de Produtos:**
    *   **Função:** Orquestrar a exibição da lista de produtos.
    *   **Implementação:**
        *   Receber a lista de produtos como propriedade.
        *   Usar um layout de grid responsivo do `daisyUI`/`tailwindcss`.
        *   Iterar sobre a lista de produtos (`{#each...}`) e renderizar um componente `ProductCard` para cada item.

#### **Fase 3: Lógica de Negócio e Integração**

1.  **Busca de Dados (Data Fetching) na Rota Principal:**
    *   Criarei o `endpoint` do lado do servidor da página principal (`src/routes/+page.server.ts`).
    *   Neste arquivo, implementarei a função `load`, que é executada no servidor antes da página ser renderizada.
    *   **Lógica da função `load`:**
        1.  Ler os parâmetros da URL (ex: o termo de busca `q`).
        2.  Construir dinamicamente a consulta para o PocketBase, utilizando o SDK.
        3.  A consulta irá sempre filtrar por `status = 'disponível'`.
        4.  Se um termo de busca for fornecido, a consulta será expandida para filtrar por `title` ou `product_id`.
        5.  Selecionar apenas os campos necessários (`fields`) para otimizar a resposta da API, conforme documentado em `INVENTORY_API.md`.
        6.  Retornar a lista de produtos obtida para o componente da página.

2.  **Montagem da Página Principal (`src/routes/+page.svelte`):**
    *   Acessar os dados dos produtos retornados pela função `load`.
    *   Renderizar o componente `SearchBar.svelte` no topo.
    *   Renderizar o componente `InventoryGrid.svelte`, passando a lista de produtos para ele. 