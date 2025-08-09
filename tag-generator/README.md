# Gerador de Etiquetas

Sistema para gerar etiquetas com QR codes dos produtos a partir da planilha do Google Sheets.

## 🏗️ Funcionalidades

- ✅ Lê dados da planilha Google Sheets configurada
- ✅ Gera QR codes com o product-id
- ✅ Layout otimizado para impressão
- ✅ Duas opções: dados locais (recomendado) ou API direta
- ✅ Interface web responsiva

## 🚀 Como Usar

### Opção 1A: Dados Locais (Recomendado)

1. **Instalar dependências**:
   ```bash
   cd tag-generator
   pnpm install
   ```

2. **Gerar dados locais**:
   ```bash
   node generate-from-sheets.js
   ```
   
3. **Iniciar servidor web**:
   ```bash
   pnpm start
   # ou
   python3 -m http.server 8080
   ```

4. **Abrir no navegador**:
   - Acesse: http://localhost:8080
   - Clique em "Carregar Dados Locais"

### Opção 1B: API Direta do Google Sheets

1. **Obter API Key**:
   - Acesse: [Google Cloud Console](https://console.cloud.google.com/apis/credentials)
   - Crie uma API Key
   - Habilite a Google Sheets API

2. **No navegador**:
   - Cole a API Key no campo
   - Clique em "Gerar Etiquetas do Sheets"

### Opção 2: JSON Manual

- Cole um JSON no formato:
  ```json
  [
    {
      "name": "Produto Exemplo",
      "price": "R$ 19,99", 
      "url": "https://exemplo.com"
    }
  ]
  ```

## 🎯 Formato das Etiquetas

Cada etiqueta contém:
- **Nome do produto**
- **Preço**
- **Product ID** (texto visível)
- **QR Code** (contém o product-id)

## ⚙️ Configurações

### Planilha Google Sheets
- **ID**: `1DIJuHTaSZ_d3nsFxxKec_WCyaPlSDGGNhwk3FyQNt5E` (configurado no .env)
- **Range**: `Sheet1!A:Z`

### Colunas Esperadas
O script detecta automaticamente colunas com nomes contendo:
- **Product ID**: `codigo`, `product_id`, `id`, `sku`
- **Preço**: `preco`, `price`, `valor`
- **Nome**: `nome`, `name`, `produto` (opcional)

### Credenciais
- Usa o Service Account configurado no `.env` raiz
- Arquivo: `acervo-comum-f29f7e0e86c5.json`

## 🖨️ Impressão

- Layout otimizado para A4
- 2 etiquetas por linha
- Dimensões: 90mm x 50mm cada
- CSS de impressão incluído

## 📁 Estrutura de Arquivos

```
tag-generator/
├── index.html          # Interface web principal
├── script.js           # Lógica JavaScript
├── style.css           # Estilos e CSS de impressão
├── generate-from-sheets.js # Script Node.js para buscar dados
├── package.json        # Dependências Node.js
├── products-data.json  # Dados locais gerados (criado automaticamente)
└── README.md          # Este arquivo
```

## 🔧 Desenvolvimento

### Scripts Disponíveis

```bash
# Gerar dados do Google Sheets
pnpm generate

# Iniciar servidor de desenvolvimento
pnpm dev

# Iniciar servidor de produção
pnpm start
```

### Dependências

- **Node.js**: googleapis, dotenv
- **Frontend**: Vanilla JS, QR Code library via CDN
- **Servidor**: Python HTTP server (para desenvolvimento)

## 🐛 Troubleshooting

### "Arquivo products-data.json não encontrado"
- Execute: `node generate-from-sheets.js`
- Verifique se as credenciais estão corretas

### "API Key inválida"
- Verifique se a API Key está correta
- Certifique-se de que a Google Sheets API está habilitada

### "Planilha não encontrada"
- Verifique se a planilha está compartilhada publicamente
- Ou compartilhe com o service account email

### Problemas de CORS
- Use um servidor HTTP (não abra o arquivo diretamente)
- Execute `pnpm start` ou `python3 -m http.server 8080`

## 📋 Exemplo de Saída

```
📊 Conectando ao Google Sheets...
📋 Buscando dados da planilha: 1DIJuHTaSZ_d3nsFxxKec_WCyaPlSDGGNhwk3FyQNt5E
📝 Cabeçalhos encontrados: ['codigo', 'nome', 'preco', 'categoria']
🔍 Usando colunas: Product ID (0), Preço (2), Nome (1)
⚙️ Processando dados...
✅ 150 produtos processados com sucesso!
📄 Dados salvos em: products-data.json

📋 Primeiros 5 produtos:
1. Camiseta Vintage - R$ 25,00 (ID: CAM001)
2. Calça Jeans - R$ 45,00 (ID: CAL002)
3. Tênis Esportivo - R$ 80,00 (ID: TEN003)
4. Bolsa de Couro - R$ 35,00 (ID: BOL004)
5. Óculos de Sol - R$ 20,00 (ID: OCU005)

💡 Use o arquivo products-data.json no gerador de etiquetas web
```