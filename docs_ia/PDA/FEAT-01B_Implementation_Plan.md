 ### **Plano de Ação: Busca e Filtros na Listagem de Inventário (FEAT-01B)**

Com base no [PRD do Checkout Comum](mdc:docs_ia/PRD_Checkout_Comum_POC.md), este documento detalha o plano de implementação para a funcionalidade de busca e filtros, que é um sub-requisito da `FEAT-01`.

---

#### **Fase 1: Configuração e Estrutura do Projeto**

Esta fase é simplificada, pois a estrutura base já foi estabelecida pela `FEAT-01`.

1.  **Análise do Ambiente:**
    *   A implementação se dará sobre a estrutura existente da página de listagem de inventário (`app/src/routes/+page.svelte`).
    *   Nenhuma nova dependência de terceiros é necessária. Utilizaremos os recursos nativos do Svelte 5 (runes) para gerenciamento de estado e o DaisyUI (já instalado) para estilização.

2.  **Inicialização de Serviços e Clientes:**
    *   O cliente PocketBase já está configurado e sendo utilizado para buscar a lista inicial de produtos. Nenhuma alteração é necessária nesta camada. A lógica de filtro será aplicada no client-side para uma experiência de usuário mais fluida e em tempo real.

---

#### **Fase 2: Desenvolvimento dos Componentes da Interface (UI)**

O foco desta fase é criar o componente de interface para a busca.

1.  **Componente `SearchBar.svelte`:**
    *   **Caminho do Arquivo:** `app/src/lib/components/forms/SearchBar.svelte`
    *   **Função:** Prover uma interface para o usuário inserir um termo de busca (texto) e uma faixa de preço (mínimo e máximo).
    *   **Implementação:**
        *   O componente será composto por um elemento `<form>` para agrupar os campos.
        *   Um campo `input` de texto para a busca por nome ou código do produto.
        *   Dois campos `input` do tipo `number` para os filtros de preço mínimo e máximo.
        *   Os valores dos campos serão controlados por propriedades reativas (runes) passadas do componente pai (a página) via `bind:value`.
        *   A estilização será feita com classes do DaisyUI para manter a consistência visual (ex: `form-control`, `input`, `input-bordered`).

---

#### **Fase 3: Lógica de Negócio e Integração**

Nesta fase, conectamos a UI à lógica de filtragem de dados na página principal.

1.  **Lógica de Estado e Filtragem (Client-Side):**
    *   **Local:** `app/src/routes/+page.svelte`
    *   **Implementação da Lógica:**
        1.  No script da página, serão criados os estados para controlar os filtros usando `$state` do Svelte 5.
            *   `let searchTerm = $state('');`
            *   `let minPrice = $state<number | undefined>(undefined);`
            *   `let maxPrice = $state<number | undefined>(undefined);`
        2.  Será criada uma variável derivada (`$derived`) chamada `filteredInventory`. Esta variável reativamente computará a lista de produtos a ser exibida.
        3.  A lógica do `$derived` seguirá os seguintes passos:
            *   Inicia com a lista completa de produtos (`data.inventory`).
            *   Aplica o filtro de `searchTerm`: filtra itens cujo `nome` ou `codigo` (em minúsculas) incluam o termo de busca (também em minúsculas).
            *   Aplica o filtro de `minPrice`: se um valor for fornecido, remove os itens cujo preço seja menor que `minPrice`.
            *   Aplica o filtro de `maxPrice`: se um valor for fornecido, remove os itens cujo preço seja maior que `maxPrice`.
            *   O resultado final é a lista de inventário filtrada.

2.  **Montagem da Página Principal (`+page.svelte`):**
    *   O componente `SearchBar.svelte` será importado e renderizado na página.
    *   As variáveis de estado (`searchTerm`, `minPrice`, `maxPrice`) serão conectadas ao componente `SearchBar` usando a diretiva `bind:`.
    *   O componente `InventoryGrid.svelte` será modificado para receber a nova lista derivada `filteredInventory` em sua propriedade, em vez da lista completa de dados.
    *   Exemplo: `<InventoryGrid inventory={filteredInventory} />`

Este plano garante que a busca e os filtros operem em tempo real na interface do usuário, sem a necessidade de novas chamadas ao servidor, proporcionando uma experiência rápida e eficiente conforme os objetivos da POC.
