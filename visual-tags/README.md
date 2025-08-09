# Etiquetas Visuais - Acervo Comum

Sistema de geração de etiquetas com imagens dos produtos ao invés de QR codes.

## Características

- **Layout 5x6**: 30 etiquetas por página A4
- **Imagens otimizadas**: Carrega automaticamente das imagens em `optimized-images/`
- **Fonte monospace**: JetBrains Mono para melhor legibilidade
- **Print-ready**: CSS otimizado para impressão em A4
- **Fallback**: Mostra placeholder quando não há imagem

## Estrutura dos Arquivos

```
visual-tags/
├── index.html          # Interface principal
├── style.css           # Estilos + CSS de impressão
├── script.js           # Lógica da aplicação
├── products-data.json  # Dados dos produtos
├── images/             # Pasta com imagens otimizadas
│   ├── skd-abc123.jpg
│   ├── sku-xyz789.png
│   └── ...
└── README.md          # Este arquivo
```

## Como Usar

1. **Desenvolvimento Local**:
   ```bash
   cd visual-tags
   python3 -m http.server 8080
   # Acesse: http://localhost:8080
   ```

2. **Deploy GitHub Pages**:
   - Push para repositório GitHub
   - Ative GitHub Pages nas configurações
   - Acesse via URL do GitHub Pages

## Configuração

### Caminhos dos Arquivos (script.js)
```javascript
const CONFIG = {
    imagesPath: './images/',        // Imagens na pasta local
    productsPath: './products-data.json'  // Dados na pasta local
};
```

### Formatos de Imagem Suportados
- JPG/JPEG
- PNG  
- WebP

### Estrutura das Imagens
As imagens seguem a estrutura de pastas:
```
images/
├── skd-abc123/
│   ├── skd-abc123-md.jpg      # Imagem principal
│   ├── skd-abc123.1-md.jpg    # Variação 1
│   └── skd-abc123_1-md.jpg    # Variação 2
├── sku-xyz789/
│   ├── sku-xyz789-md.jpg
│   └── sku-xyz789.1-md.jpg
└── ...
```

## Deploy Options

### 1. GitHub Pages (Recomendado)
✅ **Vantagens**:
- Gratuito e simples
- Perfeito para sites estáticos
- CDN global
- SSL automático

**Setup**:
1. Push para repositório GitHub
2. Settings → Pages → Source: Deploy from branch
3. Selecione branch main → /visual-tags folder

### 2. Dokploy (Não recomendado para estático)
❌ **Desvantagens**:
- Overhead desnecessário para conteúdo estático
- Requer Docker/containerização
- Mais complexo para sites simples

## Impressão

- **Formato**: A4 (210x297mm)
- **Layout**: 5 colunas x 6 linhas = 30 etiquetas
- **Tamanho etiqueta**: 37x45mm
- **Margens**: 10mm

## Browser Support

- Chrome/Chromium (recomendado para impressão)
- Firefox
- Safari
- Edge