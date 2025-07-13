# Optimize Images Script

Script para otimizar automaticamente as imagens existentes na tabela `inventory` do PocketBase, reduzindo significativamente o tamanho dos arquivos mantendo a qualidade visual.

## Estrutura da Pasta

```
scripts/optimize-images/
├── README.md                       # Documentação de uso (este arquivo)
├── optimize-inventory-images.js    # Script principal
├── index.js                        # Ponto de entrada alternativo
├── package.json                    # Configuração do módulo
└── CHANGELOG.md                    # Histórico de mudanças
```

## 📋 O que o Script Faz

- **Redimensiona**: Imagens para no máximo 1200x1200px (mantendo proporção)
- **Converte**: Todas as imagens para formato JPEG otimizado
- **Comprime**: Com qualidade 80% (excelente qualidade vs. tamanho)
- **Processa**: Múltiplas imagens em paralelo para maior eficiência
- **Relatório**: Fornece estatísticas detalhadas da otimização

## 🎯 Benefícios Esperados

Com imagens de **2.5MB** em média, esperamos:
- **60-80% de redução** no tamanho dos arquivos
- **Imagens finais**: Entre 300KB - 800KB cada
- **Carregamento mais rápido** da interface
- **Economia de bandwidth** significativa

## 🚀 Como Usar

### 1. Instalar Dependências

```bash
# Instalar a biblioteca Sharp para otimização de imagens
pnpm install sharp

# Verificar se outras dependências existem
pnpm install pocketbase dotenv
```

### 2. Verificar Arquivo .env

Certifique-se de que o arquivo `.env` na raiz do projeto tem:

```bash
POCKETBASE_URL=http://127.0.0.1:8090
POCKETBASE_ADMIN_EMAIL=seu-email@exemplo.com
POCKETBASE_ADMIN_PASSWORD=sua-senha
```

### 3. Executar o Script

#### Opção 1: Da Raiz do Projeto
```bash
# Execução normal
node scripts/optimize-images/optimize-inventory-images.js

# Execução com logs detalhados (recomendado)
node scripts/optimize-images/optimize-inventory-images.js --debug
```

#### Opção 2: Direto da Pasta
```bash
# Navegue até a pasta do script
cd scripts/optimize-images

# Execute o script principal ou o ponto de entrada
node optimize-inventory-images.js --debug
# ou
node index.js --debug
```

#### Opção 3: Com npm scripts
```bash
cd scripts/optimize-images
npm run start
npm run debug
```

## 📊 Saída do Script

O script fornece um relatório completo como:

```
🚀 Iniciando otimização de imagens do inventário...

✅ Autenticação com PocketBase realizada com sucesso
Buscando registros do inventário com imagens...
Encontrados 150 registros com imagens

📸 Processando 150 registros...
Processando: ABC123 (Camisa Polo) - 3 imagens
✅ Concluído: ABC123 - 3 imagens otimizadas (72.5% redução)

📊 === RELATÓRIO FINAL ===
✅ Registros processados: 150
📷 Total de imagens otimizadas: 450
💾 Tamanho original total: 1,125.00MB
💾 Tamanho otimizado total: 337.50MB
📉 Redução total: 70.00% (787.50MB economizados)
⏱️ Tempo total: 45.30s

🎉 Otimização concluída!
```

## ⚙️ Configurações Avançadas

Você pode modificar as configurações no arquivo `optimize-inventory-images.js`:

```javascript
const config = {
    MAX_CONCURRENT_OPTIMIZATIONS: 2, // Quantas imagens processar simultaneamente
    OPTIMIZATION: {
        MAX_WIDTH: 1200,     // Largura máxima
        MAX_HEIGHT: 1200,    // Altura máxima
        QUALITY: 80,         // Qualidade JPEG (1-100)
        PROGRESSIVE: true,   // JPEG progressivo
        FORMAT: 'jpeg'       // Formato de saída
    }
};
```

## 🔧 Personalização por Necessidade

### Para E-commerce (Qualidade Premium)
```javascript
OPTIMIZATION: {
    MAX_WIDTH: 1600,
    MAX_HEIGHT: 1600,
    QUALITY: 85,
    PROGRESSIVE: true
}
```

### Para Catálogo Rápido (Máxima Compressão)
```javascript
OPTIMIZATION: {
    MAX_WIDTH: 800,
    MAX_HEIGHT: 800,
    QUALITY: 70,
    PROGRESSIVE: true
}
```

### Para Visualização Mobile-First
```javascript
OPTIMIZATION: {
    MAX_WIDTH: 1000,
    MAX_HEIGHT: 1000,
    QUALITY: 75,
    PROGRESSIVE: true
}
```

## 🛡️ Segurança e Backup

### O Script É Seguro?
- ✅ **Não deleta** imagens originais imediatamente
- ✅ **Verifica** se a otimização realmente reduz o tamanho
- ✅ **Mantém** imagens originais se a otimização não melhorar
- ✅ **Processa** um registro por vez para evitar sobrecarga

### Backup Manual (Opcional)
```bash
# Fazer backup do PocketBase antes de executar
cp -r pb_data pb_data_backup_$(date +%Y%m%d_%H%M%S)
```

## 📈 Monitoramento

### Logs Detalhados
```bash
# Ver todo o processo de otimização
node scripts/optimize-images/optimize-inventory-images.js --debug 2>&1 | tee optimization.log
```

### Verificar Resultados
```bash
# Verificar tamanho das imagens após otimização
du -sh pb_data/storage/
```

## 🚨 Troubleshooting

### Erro: "Sharp not installed"
```bash
pnpm install sharp
```

### Erro: "Authentication failed"
```bash
# Verificar credenciais no arquivo .env
# Certificar-se de que o PocketBase está rodando
```

### Erro: "Memory issues"
```bash
# Reduzir processamento simultâneo
MAX_CONCURRENT_OPTIMIZATIONS: 1
```

### Processo Muito Lento
```bash
# Aumentar processamento simultâneo (com cuidado)
MAX_CONCURRENT_OPTIMIZATIONS: 3
```

## 📝 Exemplo de Uso com Filtragem

Para otimizar apenas produtos específicos, você pode modificar o filtro:

```javascript
// No arquivo optimize-inventory-images.js, linha ~320
const records = await pb.collection(config.COLLECTION_NAME).getFullList({
    filter: 'images != "" && status = "disponível"', // Apenas produtos disponíveis
    fields: 'id,product_id,title,images',
    sort: 'created'
});
```

## 🎯 Próximos Passos

1. **Execute o script** com suas imagens atuais
2. **Avalie os resultados** através do relatório
3. **Ajuste configurações** se necessário
4. **Configure execução periódica** para novas imagens

## 📞 Suporte

Se encontrar problemas:
1. Execute com `--debug` para logs detalhados
2. Verifique se todas as dependências estão instaladas
3. Confirme as credenciais do PocketBase
4. Certifique-se de que há espaço suficiente em disco

## 🔗 Arquivos Relacionados

- **optimize-inventory-images.js**: Script principal com todas as funcionalidades
- **index.js**: Ponto de entrada alternativo para execução simplificada
- **package.json**: Configuração do módulo e scripts npm
- **CHANGELOG.md**: Histórico de mudanças e melhorias

---

**Desenvolvido para:** Comum Checkout
**Última atualização:** 2024 