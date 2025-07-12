# API do Inventário - Listagem de Itens

Esta documentação descreve como consultar e listar itens da coleção `inventory` através da API do PocketBase.

## Endpoint Principal

Para listar os registros do inventário, utilize uma requisição `GET` para o seguinte endpoint:

```http
GET /api/collections/inventory/records
```

## Autenticação

A listagem de itens é pública e não requer autenticação.

## Parâmetros de Consulta (Query Params)

Você pode customizar a consulta utilizando os seguintes parâmetros na URL.

### 1. Paginação

- `page` (número, opcional, padrão: `1`): O número da página a ser retornada.
- `perPage` (número, opcional, padrão: `30`): O número de itens por página.

**Exemplo:**
```
/api/collections/inventory/records?page=2&perPage=50
```

### 2. Ordenação (sort)

- `sort` (string, opcional): Define o campo e a direção da ordenação.
  - Adicione `-` para ordem decrescente (ex: `-created`).
  - Adicione `+` ou nada para ordem crescente (ex: `price` ou `+price`).
  - É possível ordenar por múltiplos campos, separados por vírgula.

**Exemplos:**
- Ordenar pelos mais recentes: `?sort=-created`
- Ordenar por preço, do menor para o maior: `?sort=price`
- Ordenar por status e depois por mais recente: `?sort=status,-created`

### 3. Filtragem (filter)

- `filter` (string, opcional): Permite filtrar os resultados com base em expressões. A sintaxe é similar a SQL.

**Operadores Comuns:**
- `=` ou `~`: Igual / Contém (case-insensitive para texto)
- `!=` ou `!~`: Diferente / Não contém
- `>` , `>=` , `<` , `<=`
- `&&` (AND), `||` (OR)

**Exemplos de Filtragem:**

- **Por Status:**
  ```
  ?filter=(status = 'disponível')
  ```
- **Por Categoria:**
  ```
  ?filter=(category = 'camisa' || category = 'calça')
  ```
- **Por Preço:**
  ```
  ?filter=(price > 50 && price <= 150)
  ```
- **Por Marca (contendo "Vintage"):**
  ```
  ?filter=(brand ~ 'Vintage')
  ```
- **Por Tags (requer o ID da tag):**
  ```
  ?filter=(tags ~ 'TAG_ID_AQUI')
  ```
- **Combinação Complexa (itens disponíveis da década de 80, com preço abaixo de 100):**
  ```
  ?filter=(status = 'disponível' && decade = 'anos 80' && price < 100)
  ```

### 4. Seleção de Campos (fields)

- `fields` (string, opcional): Retorna apenas os campos especificados, separados por vírgula. Isso otimiza a resposta.

**Exemplo (retornar apenas ID, título, preço e imagens):**
```
?fields=id,product_id,title,price,images
```

---

## Exemplo Completo com `curl`

Listar as 10 primeiras jaquetas disponíveis, ordenadas da mais cara para a mais barata, retornando apenas o título, preço e tamanho:

```bash
curl -X GET "http://127.0.0.1:8090/api/collections/inventory/records?perPage=10&filter=(status='disponível' && category='jaqueta')&sort=-price&fields=title,price,size"
```

## Schema do Objeto `item` Retornado

Um registro de item do inventário terá a seguinte estrutura:

```json
{
  "id": "pbc_1475816973",
  "collectionId": "pbc_generated_collection_id",
  "collectionName": "inventory",
  "created": "2025-06-01 01:41:42.829Z",
  "updated": "2025-07-12 03:41:15.256Z",
  "product_id": "SKU12345",
  "title": "Jaqueta de Couro Vintage",
  "description": "Jaqueta de couro preta, estilo motociclista.",
  "brand": "Marca Famosa",
  "cost": 50.00,
  "price": 199.90,
  "size": "M",
  "source": "comprado",
  "source_location": "Fornecedor X",
  "category": "jaqueta",
  "status": "disponível",
  "material": "Couro",
  "sold": null,
  "notes": "Pequeno desgaste na manga direita.",
  "decade": "anos 80",
  "vibes": "rocker, motociclista",
  "made_in": "Brasil",
  "color": "preto",
  "modeling": "justa",
  "sleeve": "longa",
  "gender": "unissex",
  "tags": [
    "TAG_ID_1",
    "TAG_ID_2"
  ],
  "images": [
    "imagem1.jpg",
    "imagem2.png"
  ]
}
```

**Notas sobre os campos:**
- **`id`**: Identificador único do registro no PocketBase.
- **`product_id`**: SKU (identificador único do produto), usado para associar imagens (conforme `scripts/import-drive-images`).
- **`tags`**: Um array de IDs que se relacionam com a coleção `tags`.
- **`images`**: Um array com os nomes dos arquivos de imagem associados ao item. 