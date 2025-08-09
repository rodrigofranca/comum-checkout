# Setup para Deploy

## Arquivos Necessários na Pasta visual-tags/

### 1. Copiar products-data.json
```bash
cp tag-generator/json/products-data.json visual-tags/
```

### 2. Copiar imagens otimizadas
```bash
cp -r optimized-images/web-sm/* visual-tags/images/
```

### 3. Estrutura Final para Deploy
```
visual-tags/
├── index.html
├── style.css  
├── script.js
├── products-data.json     # ← Copiado de tag-generator/json/
├── images/                # ← Copiado de optimized-images/web-sm/
│   ├── skd-abc123/
│   │   ├── skd-abc123-md.jpg
│   │   └── skd-abc123.1-md.jpg
│   ├── sku-xyz789/
│   │   └── sku-xyz789-md.jpg
│   └── ...
└── README.md
```

## Deploy GitHub Pages

1. **Criar repositório** apenas com a pasta `visual-tags/`
2. **Push** todo o conteúdo
3. **Configurar** GitHub Pages:
   - Settings → Pages
   - Source: Deploy from branch
   - Branch: main
   - Folder: / (root)

## Comandos Rápidos

```bash
# Preparar pasta para deploy
cd visual-tags
cp ../tag-generator/json/products-data.json .
cp -r ../optimized-images/web-sm/* images/

# Verificar estrutura
ls -la
ls images/ | head -10

# Testar localmente
python3 -m http.server 8080
```

## ✅ Pronto para Deploy!

A pasta `visual-tags/` será **autocontida** com todos os arquivos necessários.