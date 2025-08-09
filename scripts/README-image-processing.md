# Scripts de Processamento de Imagens

Este documento descreve os scripts disponíveis para processamento de imagens no projeto Comum Checkout.

## Scripts Disponíveis

### 1. Download de Imagens (`download-images/`)
**Propósito**: Baixa imagens do Google Drive para uma pasta local organizada por timestamp.

```bash
cd scripts/download-images
pnpm install
node download-images.js [--debug]
```

**Características**:
- Cria pasta com timestamp: `downloaded-images/images-2024-01-01T10-30-00`
- Download paralelo (máx. 3 simultâneos)
- Filtra apenas imagens suportadas (.jpg, .png, .gif, .webp)
- Ignora arquivos maiores que 50MB
- Sistema de retry automático

---

### 2. Otimização Local (`optimize-local-images/`)
**Propósito**: Otimiza imagens de uma pasta local e salva em nova pasta.

```bash
cd scripts/optimize-local-images
pnpm install
node optimize-local-images.js --input <pasta_origem> --output <pasta_destino> [--debug]
```

**Exemplo**:
```bash
node optimize-local-images.js --input ./downloaded-images/images-2024-01-01 --output ./optimized-images/images-2024-01-01
```

**Configurações de Otimização**:
- Redimensionamento máximo: 1200x1200px
- Qualidade JPEG: 80%
- Converte para JPEG progressivo
- Mantém proporções originais
- Só otimiza se redução > 5%

---

### 3. Upload para PocketBase (`upload-images/`)
**Propósito**: Faz upload de imagens otimizadas para registros do PocketBase.

```bash
cd scripts/upload-images
pnpm install
node upload-images.js --input <pasta_imagens> [--debug]
```

**Exemplo**:
```bash
node upload-images.js --input ./optimized-images/images-2024-01-01
```

**Requisitos**:
- Nomes das imagens devem seguir padrão: `sku-XXXX.jpg` ou `skd-XXXX.jpg`
- Variáveis de ambiente configuradas (POCKETBASE_URL, etc.)
- Registros correspondentes no inventário

---

## Scripts Existentes (Para Referência)

### `import-drive-images/`
- Baixa do Drive e faz upload direto no PocketBase
- Mais eficiente para workflow direto
- Usado para importação automática

### `optimize-images/`
- Otimiza imagens já existentes no PocketBase
- Processa diretamente da base de dados
- Usado para otimização pós-importação

---

## Workflow Recomendado

### Processamento Manual (3 Etapas)
```bash
# 1. Download das imagens
cd scripts/download-images
node download-images.js --debug

# 2. Otimização
cd ../optimize-local-images
node optimize-local-images.js --input ../downloaded-images/images-2024-01-01 --output ../optimized-images/images-2024-01-01

# 3. Upload
cd ../upload-images
node upload-images.js --input ../optimized-images/images-2024-01-01
```

### Processamento Direto (1 Etapa)
```bash
# Importação direta (existente)
cd scripts/import-drive-images
node import-drive-images.js
```

---

## Variáveis de Ambiente

Crie um arquivo `.env` na raiz do projeto:

```env
# Google Drive
GOOGLE_DRIVE_FOLDER_ID=sua_pasta_id
GOOGLE_CREDENTIALS_PATH=acervo-comum-credentials.json

# PocketBase
POCKETBASE_URL=https://api.acervocomum.com.br
POCKETBASE_ADMIN_EMAIL=admin@exemplo.com
POCKETBASE_ADMIN_PASSWORD=sua_senha
```

---

## Estrutura de Pastas Gerada

```
projeto/
├── scripts/
│   ├── download-images/
│   ├── optimize-local-images/
│   ├── upload-images/
│   ├── import-drive-images/ (existente)
│   └── optimize-images/ (existente)
├── downloaded-images/
│   └── images-2024-01-01T10-30-00/
│       ├── sku-001.jpg
│       └── sku-002.png
└── optimized-images/
    └── images-2024-01-01T10-30-00/
        ├── sku-001.jpg (otimizada)
        └── sku-002.jpg (convertida)
```

---

## Logs e Debug

Todos os scripts suportam `--debug` para logs detalhados:
- Progresso de download/upload
- Informações de otimização
- Estatísticas de redução de tamanho
- Detalhes de erros

## Dependências

Cada script tem suas próprias dependências no `package.json`:
- `download-images`: googleapis, dotenv
- `optimize-local-images`: sharp, dotenv  
- `upload-images`: pocketbase, dotenv