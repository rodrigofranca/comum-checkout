# Como Subir no GitHub Pages

## 1. Preparar Arquivos para Deploy

```bash
# Navegar para a pasta visual-tags
cd visual-tags

# Copiar dados dos produtos
cp ../tag-generator/json/products-data.json .

# Copiar todas as imagens otimizadas
cp -r ../optimized-images/web-sm/* images/

# Verificar se tudo está no lugar
ls -la
ls images/ | head -5
```

## 2. Criar Repositório no GitHub

### Opção A: Repositório Novo
1. Acesse [github.com](https://github.com) 
2. Click **"New repository"**
3. Nome: `visual-tags-acervo` (ou outro nome)
4. **Público** (necessário para GitHub Pages gratuito)
5. **NÃO** inicialize com README
6. Click **"Create repository"**

### Opção B: Usar Repositório Existente
- Use o repositório `comum-checkout` existente
- Crie uma branch separada para o visual-tags

## 3. Fazer Upload dos Arquivos

### Método 1: Git Command Line
```bash
# Na pasta visual-tags/
git init
git add .
git commit -m "Initial commit: Visual tags with images"

# Para repositório NOVO:
git remote add origin https://github.com/SEU-USUARIO/visual-tags-acervo.git
git branch -M main
git push -u origin main

# Para repositório EXISTENTE (nova branch):
git remote add origin https://github.com/SEU-USUARIO/comum-checkout.git
git checkout -b visual-tags
git push -u origin visual-tags
```

### Método 2: GitHub Web Interface (Mais Simples)
1. No repositório GitHub, click **"uploading an existing file"**
2. Arraste TODOS os arquivos da pasta `visual-tags/`
3. Commit message: "Add visual tags system"
4. Click **"Commit changes"**

## 4. Configurar GitHub Pages

1. No repositório GitHub, vá em **Settings**
2. Scroll down até **"Pages"** (menu lateral esquerdo)
3. Em **"Source"**, selecione:
   - **Deploy from a branch**
   - Branch: **main** (ou **visual-tags** se usou branch separada)
   - Folder: **/ (root)** 

4. Click **"Save"**

## 5. Acessar o Site

- GitHub irá gerar um URL como:
  `https://SEU-USUARIO.github.io/visual-tags-acervo/`

- Pode demorar alguns minutos para ficar disponível
- Check no **Actions** tab se o deploy funcionou

## 6. Testando

1. Acesse a URL gerada
2. Click **"Carregar Produtos"**
3. Verifique se as imagens aparecem
4. Teste a impressão (Ctrl+P)

## Troubleshooting

### Se as imagens não aparecem:
- Verifique se a pasta `images/` foi enviada
- Check no navegador console (F12) por erros
- Verifique se `products-data.json` existe

### Se o site não carrega:
- Aguarde 5-10 minutos após configurar Pages
- Check **Actions** tab para ver status do deploy
- Verifique se o repositório é público

### Estrutura de arquivos esperada:
```
/
├── index.html
├── style.css
├── script.js
├── products-data.json
├── images/
│   ├── skd-abc123/
│   │   └── skd-abc123-md.jpg
│   └── sku-xyz789/
│       └── sku-xyz789-md.jpg
└── README.md
```

## URL Final
Seu site estará em: `https://SEU-USUARIO.github.io/NOME-DO-REPO/`