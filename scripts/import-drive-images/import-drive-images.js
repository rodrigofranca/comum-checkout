// scripts/import-drive-images.js

import { google } from 'googleapis';
import PocketBase from 'pocketbase';
import 'dotenv/config';
import path from 'path';
import { promises as fs } from 'fs';

// --- Configuration and Validation ---
const config = {
    GOOGLE_DRIVE_FOLDER_ID: process.env.GOOGLE_DRIVE_FOLDER_ID,
    GOOGLE_CREDENTIALS_PATH: process.env.GOOGLE_CREDENTIALS_PATH,
    POCKETBASE_URL: process.env.POCKETBASE_URL,
    POCKETBASE_ADMIN_EMAIL: process.env.POCKETBASE_ADMIN_EMAIL,
    POCKETBASE_ADMIN_PASSWORD: process.env.POCKETBASE_ADMIN_PASSWORD,
    COLLECTION_NAME: 'inventory',
    MAX_CONCURRENT_DOWNLOADS: 3,
    MAX_FILE_SIZE: 10 * 1024 * 1024, // 10MB
    RETRY_ATTEMPTS: 3,
    RETRY_DELAY: 1000, // 1 second
    SUPPORTED_IMAGE_TYPES: ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
    PRODUCT_ID_REGEX: /(?:skd|sku)[-_]([a-z0-9]+)/i
};

// Validate required environment variables
function validateConfig() {
    const required = ['GOOGLE_DRIVE_FOLDER_ID', 'POCKETBASE_URL', 'POCKETBASE_ADMIN_EMAIL', 'POCKETBASE_ADMIN_PASSWORD'];
    const missing = required.filter(key => !config[key]);

    if (missing.length > 0) {
        throw new Error(`Missing required environment variables: ${missing.join(', ')}`);
    }
}

// --- Logger and Configuration ---
const argv = process.argv.slice(2);
const DEBUG_MODE = argv.includes('--debug');

const logger = {
    info: (...args) => console.log(...args),
    warn: (...args) => console.warn('⚠️', ...args),
    error: (...args) => console.error('❌', ...args),
    debug: (...args) => {
        if (DEBUG_MODE) {
            console.log('🐞', ...args);
        }
    },
    success: (...args) => console.log('✅', ...args)
};

/**
 * Configuração do Google Drive API
 * Você precisa criar um projeto no Google Cloud Console e habilitar a API do Drive
 * https://console.cloud.google.com/apis/library/drive.googleapis.com
 *
 * Depois, crie uma credencial do tipo "Service Account" e baixe o arquivo JSON
 * Salve o arquivo como "google-credentials.json" na raiz do projeto
 */

// --- Utility Functions ---

/**
 * Sleep utility for delays
 */
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Busca a raiz do projeto procurando por arquivos específicos
 */
async function findProjectRoot() {
    let currentDir = process.cwd();

    // Lista de arquivos/diretórios que indicam a raiz do projeto
    const projectRootIndicators = [
        '.env',
        '.git',
        config.GOOGLE_CREDENTIALS_PATH,
        'node_modules',
        'pocketbase'
    ];

    // Primeiro, tenta encontrar pelos indicadores específicos
    while (currentDir !== '/') {
        // Verifica se algum dos indicadores existe no diretório atual
        for (const indicator of projectRootIndicators) {
            try {
                await fs.access(path.join(currentDir, indicator));
                logger.debug(`Raiz do projeto encontrada em: ${currentDir} (indicador: ${indicator})`);
                return currentDir;
            } catch (error) {
                // Continua procurando
            }
        }

        // Sobe um diretório
        const parentDir = path.dirname(currentDir);
        if (parentDir === currentDir) break;
        currentDir = parentDir;
    }

    // Se não encontrou pelos indicadores, procura por package.json específico
    currentDir = process.cwd();
    while (currentDir !== '/') {
        try {
            const packageJsonPath = path.join(currentDir, 'package.json');
            await fs.access(packageJsonPath);

            // Lê o package.json para ver se é o projeto principal
            const packageContent = await fs.readFile(packageJsonPath, 'utf8');
            const packageJson = JSON.parse(packageContent);

            // Se o package.json não é o nosso script específico, provavelmente é a raiz
            if (packageJson.name !== 'import-drive-images') {
                logger.debug(`Raiz do projeto encontrada em: ${currentDir} (package.json principal)`);
                return currentDir;
            }
        } catch (error) {
            // Continua procurando
        }

        // Sobe um diretório
        const parentDir = path.dirname(currentDir);
        if (parentDir === currentDir) break;
        currentDir = parentDir;
    }

    // Como último recurso, usa o diretório atual ou dois níveis acima se estiver dentro de scripts/import-drive-images
    const currentPath = process.cwd();
    if (currentPath.includes('scripts/import-drive-images')) {
        const projectRoot = path.resolve(currentPath, '../..');
        logger.debug(`Usando raiz do projeto baseada na estrutura: ${projectRoot}`);
        return projectRoot;
    }

    logger.debug(`Usando diretório atual como raiz: ${currentPath}`);
    return currentPath;
}

/**
 * Retry wrapper for async operations
 */
async function withRetry(operation, attempts = config.RETRY_ATTEMPTS) {
    for (let i = 0; i < attempts; i++) {
        try {
            return await operation();
        } catch (error) {
            if (i === attempts - 1) throw error;

            logger.warn(`Tentativa ${i + 1} falhou, tentando novamente em ${config.RETRY_DELAY}ms...`);
            await sleep(config.RETRY_DELAY * Math.pow(2, i)); // Exponential backoff
        }
    }
}

/**
 * Validate file size and type
 */
function validateFile(file, buffer) {
    if (!config.SUPPORTED_IMAGE_TYPES.includes(file.mimeType)) {
        throw new Error(`Tipo de arquivo não suportado: ${file.mimeType}`);
    }

    if (buffer.length > config.MAX_FILE_SIZE) {
        throw new Error(`Arquivo muito grande: ${buffer.length} bytes (máximo: ${config.MAX_FILE_SIZE})`);
    }
}

/**
 * Parallel processing utility
 */
async function processInParallel(items, processor, concurrency = config.MAX_CONCURRENT_DOWNLOADS) {
    const results = [];

    for (let i = 0; i < items.length; i += concurrency) {
        const batch = items.slice(i, i + concurrency);
        const batchResults = await Promise.all(
            batch.map(item => processor(item).catch(error => ({ error, item })))
        );
        results.push(...batchResults);
    }

    return results;
}

/**
 * Configura a autenticação com o Google Drive
 */
async function setupGoogleDrive() {
    // Busca a raiz do projeto de forma robusta
    const projectRoot = await findProjectRoot();
    const credentialsPath = path.join(projectRoot, config.GOOGLE_CREDENTIALS_PATH);

    // Check if credentials file exists
    try {
        await fs.access(credentialsPath);
        logger.debug(`Arquivo de credenciais encontrado em: ${credentialsPath}`);
    } catch (error) {
        // Tenta alguns caminhos alternativos
        const alternativePaths = [
            path.join(process.cwd(), config.GOOGLE_CREDENTIALS_PATH),
            path.join(process.cwd(), '../..', config.GOOGLE_CREDENTIALS_PATH),
            path.join(process.cwd(), '..', config.GOOGLE_CREDENTIALS_PATH)
        ];

        let foundPath = null;
        for (const altPath of alternativePaths) {
            try {
                await fs.access(altPath);
                foundPath = altPath;
                logger.debug(`Arquivo de credenciais encontrado em caminho alternativo: ${altPath}`);
                break;
            } catch (altError) {
                // Continua procurando
            }
        }

        if (!foundPath) {
            throw new Error(`Arquivo de credenciais não encontrado em nenhum dos caminhos:
- ${credentialsPath}
- ${alternativePaths.join('\n- ')}

Certifique-se de que o arquivo ${config.GOOGLE_CREDENTIALS_PATH} existe na raiz do projeto.`);
        }

        // Usa o caminho encontrado
        const auth = new google.auth.GoogleAuth({
            keyFile: foundPath,
            scopes: ['https://www.googleapis.com/auth/drive.readonly']
        });

        const drive = google.drive({ version: 'v3', auth });
        return drive;
    }

    const auth = new google.auth.GoogleAuth({
        keyFile: credentialsPath,
        scopes: ['https://www.googleapis.com/auth/drive.readonly']
    });

    const drive = google.drive({ version: 'v3', auth });
    return drive;
}

/**
 * Remove os prefixos sku- ou skd- de um ID
 */
function cleanProductId(productId) {
    return productId.replace(/^(sku-|skd-)/i, '');
}

/**
 * Busca todos os arquivos de imagem de uma pasta do Drive e os mapeia por product_id.
 */
async function fetchAllDriveImages(drive) {
    const imageMap = new Map();
    const searchQuery = `'${config.GOOGLE_DRIVE_FOLDER_ID}' in parents and (mimeType contains 'image/')`;
    let pageToken = null;
    let totalFiles = 0;

    logger.info('Buscando e mapeando todos os arquivos de imagem do Google Drive...');

    do {
        const response = await withRetry(async () => {
            return await drive.files.list({
                q: searchQuery,
                fields: 'nextPageToken, files(id, name, mimeType, size)',
                pageSize: 1000,
                pageToken: pageToken
            });
        });

        const files = response.data.files;
        if (files && files.length) {
            totalFiles += files.length;

            files.forEach(file => {
                // Validate file type
                if (!config.SUPPORTED_IMAGE_TYPES.includes(file.mimeType)) {
                    logger.debug(`Ignorando arquivo com tipo não suportado: ${file.name} (${file.mimeType})`);
                    return;
                }

                // Validate file size
                if (file.size && parseInt(file.size) > config.MAX_FILE_SIZE) {
                    logger.warn(`Ignorando arquivo muito grande: ${file.name} (${file.size} bytes)`);
                    return;
                }

                const match = file.name.match(config.PRODUCT_ID_REGEX);
                if (match && match[1]) {
                    const productId = match[1].toLowerCase();
                    if (!imageMap.has(productId)) {
                        imageMap.set(productId, []);
                    }
                    imageMap.get(productId).push({
                        id: file.id,
                        name: file.name,
                        mimeType: file.mimeType,
                        size: file.size
                    });
                }
            });
        }
        pageToken = response.data.nextPageToken;
    } while (pageToken);

    logger.success(`Mapeamento concluído. ${totalFiles} arquivos encontrados, ${imageMap.size} produtos com imagens mapeados.`);
    return imageMap;
}

/**
 * Baixa uma imagem do Drive com validação
 */
async function downloadDriveImage(drive, file) {
    return await withRetry(async () => {
        const response = await drive.files.get(
            { fileId: file.id, alt: 'media' },
            { responseType: 'arraybuffer' }
        );

        const buffer = Buffer.from(response.data);

        // Validate downloaded file
        validateFile(file, buffer);

        return buffer;
    });
}

// Global PocketBase instance
let pbInstance = null;

/**
 * Get or create PocketBase instance
 */
async function getPocketBaseInstance() {
    if (!pbInstance) {
        pbInstance = new PocketBase(config.POCKETBASE_URL);
        await pbInstance.admins.authWithPassword(
            config.POCKETBASE_ADMIN_EMAIL,
            config.POCKETBASE_ADMIN_PASSWORD
        );
    }
    return pbInstance;
}

/**
 * Faz upload das imagens para o PocketBase
 */
async function uploadToPocketBase(inventoryId, images) {
    const pb = await getPocketBaseInstance();

    // Prepara o FormData com todas as imagens
    const formData = new FormData();

    for (let i = 0; i < images.length; i++) {
        const { buffer, name, mimeType } = images[i];
        const blob = new Blob([buffer], { type: mimeType });
        formData.append('images', blob, name);
    }

    // Faz o upload com retry
    return await withRetry(async () => {
        return await pb.collection(config.COLLECTION_NAME).update(inventoryId, formData);
    });
}

/**
 * Busca todos os registros do inventário que ainda não possuem imagens.
 */
async function getInventoryItems(pb) {
    logger.info('Buscando itens do inventário que precisam de imagens...');

    const records = await withRetry(async () => {
        return await pb.collection(config.COLLECTION_NAME).getFullList({
            filter: 'product_id != "" && images = ""',
            fields: 'id,product_id'
        });
    });

    return records;
}

/**
 * Função para debug - testa a conexão com o Google Drive
 */
async function debugGoogleDriveConnection(drive) {
    logger.debug('\n=== DEBUG - Testando conexão com Google Drive ===');

    try {
        // Primeiro, testa se consegue acessar o serviço do Drive
        logger.debug('1. Testando acesso ao serviço do Drive...');
        const aboutResponse = await drive.about.get({
            fields: 'user(displayName,emailAddress)'
        });
        logger.debug(`✓ Conectado como: ${aboutResponse.data.user.displayName} (${aboutResponse.data.user.emailAddress})`);

        // Lista as pastas que o service account pode acessar
        logger.debug('\n2. Listando pastas acessíveis...');
        try {
            const foldersResponse = await drive.files.list({
                q: "mimeType='application/vnd.google-apps.folder'",
                fields: 'files(id, name, owners, shared)',
                pageSize: 20
            });

            logger.debug(`Pastas encontradas: ${foldersResponse.data.files.length}`);
            if (foldersResponse.data.files.length > 0) {
                logger.debug('\nPastas acessíveis:');
                foldersResponse.data.files.forEach((folder, index) => {
                    logger.debug(`${index + 1}. ${folder.name} (ID: ${folder.id})`);
                });
            }
        } catch (error) {
            logger.error('Erro ao listar pastas:', error.message);
        }

        // Testa se o folder ID existe e é acessível
        logger.debug('\n3. Testando acesso à pasta especificada...');
        logger.debug(`Folder ID: ${config.GOOGLE_DRIVE_FOLDER_ID}`);

        if (!config.GOOGLE_DRIVE_FOLDER_ID) {
            logger.error('GOOGLE_DRIVE_FOLDER_ID não está definido!');
            return false;
        }

        try {
            const folderResponse = await drive.files.get({
                fileId: config.GOOGLE_DRIVE_FOLDER_ID,
                fields: 'id, name, mimeType, permissions, owners, shared'
            });
            logger.debug(`✓ Pasta encontrada: ${folderResponse.data.name}`);
            logger.debug(`  Tipo: ${folderResponse.data.mimeType}`);

            // Lista alguns arquivos na pasta para verificar se há conteúdo
            logger.debug('\n4. Verificando conteúdo da pasta...');
            const filesResponse = await drive.files.list({
                q: `'${config.GOOGLE_DRIVE_FOLDER_ID}' in parents`,
                fields: 'files(id, name, mimeType)',
                pageSize: 10
            });

            logger.debug(`Total de arquivos na pasta: ${filesResponse.data.files.length}`);

            if (filesResponse.data.files.length === 0) {
                logger.warn('A pasta está vazia!');
                return false;
            }

            logger.debug('\nPrimeiros 10 arquivos:');
            filesResponse.data.files.forEach((file, index) => {
                logger.debug(`${index + 1}. ${file.name} (${file.mimeType})`);
            });

            // Verifica se há imagens
            const imageFiles = filesResponse.data.files.filter(file =>
                file.mimeType && file.mimeType.startsWith('image/')
            );
            logger.debug(`\nTotal de imagens na pasta: ${imageFiles.length}`);

            if (imageFiles.length === 0) {
                logger.warn('Nenhuma imagem encontrada na pasta!');
                return false;
            }

            logger.debug('\nPrimeiras imagens:');
            imageFiles.slice(0, 5).forEach((file, index) => {
                logger.debug(`${index + 1}. ${file.name} (${file.mimeType})`);
            });

            return true;

        } catch (folderError) {
            logger.error('Erro ao acessar a pasta:', folderError.message);
            if (folderError.code === 404) {
                logger.error('\n🔧 SOLUÇÃO: A pasta não foi encontrada. Isso geralmente acontece porque:');
                logger.error('1. O service account não tem permissão para acessar a pasta');
                logger.error('2. A pasta não foi compartilhada com o service account');
                logger.error('3. O ID da pasta está incorreto');
                logger.error('\nPara resolver:');
                logger.error('1. Abra a pasta no Google Drive');
                logger.error('2. Clique em "Compartilhar"');
                logger.error('3. Adicione o email do service account (encontrado no arquivo JSON de credenciais)');
                logger.error('4. Dê permissão de "Visualizador" ou "Editor"');

                // Tenta encontrar a pasta por nome como alternativa
                await searchFolderByName(drive);

            } else if (folderError.code === 403) {
                logger.error('\n🔧 SOLUÇÃO: Sem permissão para acessar a pasta.');
                logger.error('Compartilhe a pasta com o service account e tente novamente.');
            }
            return false;
        }

    } catch (error) {
        logger.error('Erro na conexão com o Google Drive:', error.message);
        return false;
    }
}

/**
 * Busca pastas por nome como alternativa
 */
async function searchFolderByName(drive) {
    logger.debug('\n5. Buscando pastas por nome que podem conter imagens...');

    try {
        const searchTerms = ['images', 'imagens', 'fotos', 'photos', 'produto', 'product', 'inventario', 'inventory'];

        for (const term of searchTerms) {
            logger.debug(`\nBuscando pastas com nome contendo: "${term}"`);

            const response = await drive.files.list({
                q: `mimeType='application/vnd.google-apps.folder' and name contains '${term}'`,
                fields: 'files(id, name)',
                pageSize: 10
            });

            if (response.data.files.length > 0) {
                logger.debug(`Encontradas ${response.data.files.length} pastas:`);
                response.data.files.forEach((folder, index) => {
                    logger.debug(`${index + 1}. ${folder.name} (ID: ${folder.id})`);
                });
            }
        }

    } catch (error) {
        logger.error('Erro ao buscar pastas por nome:', error.message);
    }
}

/**
 * Função para extrair o email do service account do arquivo de credenciais
 */
async function getServiceAccountEmail() {
    try {
        // Busca a raiz do projeto de forma robusta
        const projectRoot = await findProjectRoot();
        const credentialsPath = path.join(projectRoot, config.GOOGLE_CREDENTIALS_PATH);

        // Tenta acessar o arquivo de credenciais
        try {
            await fs.access(credentialsPath);
        } catch (error) {
            // Tenta alguns caminhos alternativos
            const alternativePaths = [
                path.join(process.cwd(), config.GOOGLE_CREDENTIALS_PATH),
                path.join(process.cwd(), '../..', config.GOOGLE_CREDENTIALS_PATH),
                path.join(process.cwd(), '..', config.GOOGLE_CREDENTIALS_PATH)
            ];

            let foundPath = null;
            for (const altPath of alternativePaths) {
                try {
                    await fs.access(altPath);
                    foundPath = altPath;
                    break;
                } catch (altError) {
                    // Continua procurando
                }
            }

            if (!foundPath) {
                logger.error('Arquivo de credenciais não encontrado em nenhum dos caminhos:', [credentialsPath, ...alternativePaths]);
                return null;
            }

            // Usa o caminho encontrado
            const credentialsContent = await fs.readFile(foundPath, 'utf8');
            const credentials = JSON.parse(credentialsContent);
            return credentials.client_email;
        }

        const credentialsContent = await fs.readFile(credentialsPath, 'utf8');
        const credentials = JSON.parse(credentialsContent);
        return credentials.client_email;

    } catch (error) {
        logger.error('Erro ao ler arquivo de credenciais:', error.message);
        return null;
    }
}

/**
 * Função para mostrar instruções de compartilhamento
 */
async function showSharingInstructions() {
    logger.info('\n=== INSTRUÇÕES PARA COMPARTILHAR A PASTA ===');

    const serviceAccountEmail = await getServiceAccountEmail();

    if (serviceAccountEmail) {
        logger.info(`📧 Email do Service Account: ${serviceAccountEmail}`);
        logger.info('\n🔧 Para resolver o problema:');
        logger.info('1. Abra a pasta no Google Drive');
        logger.info('2. Clique com o botão direito na pasta e selecione "Compartilhar"');
        logger.info(`3. Adicione o email: ${serviceAccountEmail}`);
        logger.info('4. Defina a permissão como "Visualizador" ou "Editor"');
        logger.info('5. Clique em "Enviar"');
        logger.info('\nDepois de compartilhar, execute o script novamente.');
    } else {
        logger.error('Não foi possível encontrar o email do service account.');
        logger.error('Verifique se o arquivo acervo-comum-f29f7e0e86c5.json existe na raiz do projeto.');
    }
}

/**
 * Função principal
 */
async function main() {
    try {
        // Validate configuration first
        validateConfig();

        logger.info('Iniciando importação de imagens do Drive...');

        // 1. Configura o PocketBase
        const pb = await getPocketBaseInstance();

        // 2. Configura o Google Drive
        logger.info('Configurando Google Drive...');
        const drive = await setupGoogleDrive();

        // 2.1. DEBUG - Roda o teste de conexão apenas se o argumento --debug for passado
        if (DEBUG_MODE) {
            const driveConnectionOk = await debugGoogleDriveConnection(drive);
            if (!driveConnectionOk) {
                logger.error('\nFalha na conexão com o Google Drive. Encerrando...');
                await showSharingInstructions();
                return;
            }
        }

        // 3. Busca TODAS as imagens do Drive e mapeia de uma só vez (MUITO MAIS EFICIENTE)
        logger.info('\n=== Mapeando imagens do Google Drive ===');
        const imageMap = await fetchAllDriveImages(drive);

        // 4. Busca todos os itens do inventário que precisam de imagens
        logger.info('\n=== Buscando itens do inventário ===');
        const inventoryItems = await getInventoryItems(pb);

        if (!inventoryItems.length) {
            logger.success('Nenhum item precisando de imagens. Tudo atualizado!');
            return;
        }

        logger.info(`Encontrados ${inventoryItems.length} itens para processar.`);

        // 5. Processa itens em paralelo com controle de concorrência
        logger.info('\n=== Processando itens ===');
        const results = await processInParallel(inventoryItems, async (item) => {
            try {
                logger.info(`\nProcessando item ${item.product_id}...`);

                // 5.1 Busca as imagens correspondentes no mapa local
                const cleanId = cleanProductId(item.product_id);
                const files = imageMap.get(cleanId.toLowerCase()) || [];

                if (!files.length) {
                    logger.warn(`-> Nenhuma imagem encontrada no Drive para ${item.product_id}. Pulando.`);
                    return { success: true, skipped: true, productId: item.product_id };
                }

                logger.info(`-> Encontradas ${files.length} imagens para o produto ${item.product_id}`);

                // 5.2 Baixa cada imagem (com processamento paralelo para downloads)
                const downloadResults = await processInParallel(files, async (file) => {
                    logger.info(`   - Baixando ${file.name}...`);
                    const buffer = await downloadDriveImage(drive, file);
                    return {
                        buffer,
                        name: file.name,
                        mimeType: file.mimeType
                    };
                }, 2); // Limite de 2 downloads simultâneos por item

                // Check for download errors
                const failedDownloads = downloadResults.filter(result => result.error);
                if (failedDownloads.length > 0) {
                    throw new Error(`Falha ao baixar ${failedDownloads.length} imagens`);
                }

                const images = downloadResults.filter(result => !result.error);

                // 5.3 Faz upload para o PocketBase
                logger.info(`-> Fazendo upload das imagens para o item ${item.product_id}...`);
                const record = await uploadToPocketBase(item.id, images);
                logger.success(`-> Upload concluído! ${record.images.length} imagens importadas.`);

                return {
                    success: true,
                    productId: item.product_id,
                    imagesCount: record.images.length
                };

            } catch (error) {
                logger.error(`\nErro ao processar o item ${item.product_id}: ${error.message}`);
                return {
                    success: false,
                    productId: item.product_id,
                    error: error.message
                };
            }
        }, 2); // Processa 2 itens simultaneamente

        // 6. Análise dos resultados
        const successful = results.filter(r => r.success && !r.skipped);
        const skipped = results.filter(r => r.success && r.skipped);
        const failed = results.filter(r => !r.success);

        logger.info('\n=== Resumo da Importação ===');
        logger.success(`✅ Processados com sucesso: ${successful.length} itens`);

        if (skipped.length > 0) {
            logger.warn(`⚠️ Itens pulados (sem imagens): ${skipped.length}`);
        }

        if (failed.length > 0) {
            logger.error(`❌ Itens com falha: ${failed.length}`);
            failed.forEach(item => {
                logger.error(`  - ${item.productId}: ${item.error}`);
            });
        }

        const totalImages = successful.reduce((sum, item) => sum + (item.imagesCount || 0), 0);
        logger.success(`📷 Total de imagens importadas: ${totalImages}`);

        if (failed.length > 0) {
            logger.warn('\nAlguns itens falharam durante o processamento. Verifique os logs acima.');
            process.exit(1);
        } else {
            logger.success('\nImportação finalizada com sucesso!');
        }

    } catch (error) {
        logger.error('Erro fatal durante a execução do script:', error);
        process.exit(1);
    }
}

// Executa o script
main();