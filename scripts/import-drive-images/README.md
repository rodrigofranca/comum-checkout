# Import Drive Images Script

Script para importar imagens do Google Drive para o PocketBase de forma eficiente e robusta.

## Estrutura da Pasta

```
scripts/import-drive-images/
├── README.md                    # Documentação de uso (este arquivo)
├── import-drive-images.js       # Script principal
├── index.js                     # Ponto de entrada alternativo
└── evaluation.md               # Avaliação técnica detalhada
```

## Configuração

### Variáveis de Ambiente Necessárias

Crie um arquivo `.env` na **raiz do projeto** com as seguintes variáveis:

```bash
# Configuração do Google Drive
GOOGLE_DRIVE_FOLDER_ID=your_drive_folder_id_here
GOOGLE_CREDENTIALS_PATH=acervo-comum-f29f7e0e86c5.json

# Configuração do PocketBase
POCKETBASE_URL=http://localhost:8090
POCKETBASE_ADMIN_EMAIL=admin@example.com
POCKETBASE_ADMIN_PASSWORD=your_admin_password_here

# Configurações opcionais (com valores padrão)
# MAX_CONCURRENT_DOWNLOADS=3
# MAX_FILE_SIZE=10485760  # 10MB em bytes
# RETRY_ATTEMPTS=3
# RETRY_DELAY=1000  # 1 segundo
```

### Arquivo de Credenciais do Google

1. Acesse o [Google Cloud Console](https://console.cloud.google.com/)
2. Crie um novo projeto ou selecione um existente
3. Habilite a API do Google Drive
4. Crie uma credencial do tipo "Service Account"
5. Baixe o arquivo JSON das credenciais
6. Salve o arquivo como `acervo-comum-f29f7e0e86c5.json` na **raiz do projeto**

### Compartilhamento da Pasta

O script precisa que a pasta do Drive seja compartilhada com o Service Account:

1. Abra a pasta no Google Drive
2. Clique em "Compartilhar"
3. Adicione o email do Service Account (encontrado no arquivo JSON)
4. Defina a permissão como "Visualizador"

## Uso

### Opção 1: Executar da Raiz do Projeto

```bash
# Execução normal
node scripts/import-drive-images/import-drive-images.js

# Execução com debug (recomendado para primeira execução)
node scripts/import-drive-images/import-drive-images.js --debug
```

### Opção 2: Executar Direto da Pasta

```bash
# Navegue até a pasta do script
cd scripts/import-drive-images

# Execute o script principal ou o ponto de entrada
node import-drive-images.js --debug
# ou
node index.js --debug
```

### Opção 3: Executar com Caminho Absoluto

```bash
# De qualquer lugar do sistema
node /path/to/project/scripts/import-drive-images/import-drive-images.js --debug
```

### Saída do Script

O script fornece informações detalhadas sobre:
- Quantidade de imagens encontradas no Drive
- Itens do inventário processados
- Imagens baixadas e enviadas
- Resumo final com estatísticas

## Melhorias Implementadas

### Performance
- ✅ **Processamento paralelo**: Downloads e uploads ocorrem simultaneamente
- ✅ **Mapeamento eficiente**: Uma única varredura do Drive
- ✅ **Reutilização de conexões**: Instância única do PocketBase
- ✅ **Controle de concorrência**: Limita downloads simultâneos

### Robustez
- ✅ **Retry automático**: Tentativas múltiplas em caso de falha
- ✅ **Validação de arquivos**: Verifica tipo e tamanho dos arquivos
- ✅ **Tratamento de erros**: Continua processando mesmo com falhas individuais
- ✅ **Validação de configuração**: Verifica variáveis de ambiente

### Segurança
- ✅ **Caminho configurável**: Credenciais não hardcoded
- ✅ **Validação de entrada**: Verifica arquivos antes do processamento
- ✅ **Limites de tamanho**: Previne uploads de arquivos muito grandes
- ✅ **Tipos suportados**: Apenas formatos de imagem conhecidos

### Monitoramento
- ✅ **Logs detalhados**: Informações sobre cada etapa
- ✅ **Modo debug**: Diagnóstico completo de problemas
- ✅ **Resumo final**: Estatísticas de sucesso e falhas
- ✅ **Instruções de recuperação**: Orientações para resolver problemas

## Padrões de Nomenclatura

O script identifica produtos através de padrões no nome dos arquivos:
- `sku-ABC123.jpg` → produto `abc123`
- `skd-XYZ789.png` → produto `xyz789`
- `SKU_DEF456.gif` → produto `def456`

## Limitações

- **Tamanho máximo**: 10MB por arquivo (configurável)
- **Tipos suportados**: JPEG, PNG, GIF, WebP
- **Concorrência**: Máximo 3 downloads simultâneos (configurável)
- **Tentativas**: Máximo 3 tentativas por operação (configurável)

## Solução de Problemas

### Erro 404 - Pasta não encontrada
- Verifique se o ID da pasta está correto
- Certifique-se de que a pasta foi compartilhada com o Service Account

### Erro 403 - Sem permissão
- Compartilhe a pasta com o Service Account
- Verifique se as credenciais estão corretas

### Falhas de download
- Execute com `--debug` para mais informações
- Verifique a conexão com a internet
- Considere reduzir `MAX_CONCURRENT_DOWNLOADS`

### Problemas de upload
- Verifique se o PocketBase está rodando
- Confirme as credenciais de admin
- Verifique se a coleção 'inventory' existe

## Arquivos de Referência

- **evaluation.md**: Avaliação técnica detalhada da implementação
- **import-drive-images.js**: Script principal com todas as funcionalidades
- **index.js**: Ponto de entrada alternativo para execução simplificada

## Desenvolvimento

Para modificar ou estender o script:

1. Edite o arquivo `import-drive-images.js`
2. Mantenha as configurações centralizadas no objeto `config`
3. Siga o padrão de logging existente
4. Adicione validações adequadas para novas funcionalidades
5. Documente mudanças significativas no `evaluation.md` 