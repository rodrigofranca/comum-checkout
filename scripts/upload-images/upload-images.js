// scripts/upload-images/upload-images.js

import PocketBase from 'pocketbase';
import 'dotenv/config';
import path from 'path';
import { promises as fs } from 'fs';

// --- Configuration ---
const config = {
    POCKETBASE_URL: process.env.POCKETBASE_URL,
    POCKETBASE_ADMIN_EMAIL: process.env.POCKETBASE_ADMIN_EMAIL,
    POCKETBASE_ADMIN_PASSWORD: process.env.POCKETBASE_ADMIN_PASSWORD,
    COLLECTION_NAME: 'inventory',
    MAX_CONCURRENT_UPLOADS: 2,
    RETRY_ATTEMPTS: 3,
    RETRY_DELAY: 1000,
    SUPPORTED_IMAGE_TYPES: ['.jpg', '.jpeg', '.png', '.gif', '.webp'],
    PRODUCT_ID_REGEX: /(?:skd|sku)[-_]([a-z0-9]+)/i
};

console.log(config);

// --- Logger ---
const DEBUG_MODE = process.argv.includes('--debug');

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

// --- Utility Functions ---
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function withRetry(operation, attempts = config.RETRY_ATTEMPTS) {
    for (let i = 0; i < attempts; i++) {
        try {
            return await operation();
        } catch (error) {
            if (i === attempts - 1) throw error;
            logger.warn(`Tentativa ${i + 1} falhou, tentando novamente em ${config.RETRY_DELAY}ms...`);
            await sleep(config.RETRY_DELAY * Math.pow(2, i));
        }
    }
}

function getArgument(name) {
    const index = process.argv.indexOf(name);
    return index > -1 ? process.argv[index + 1] : null;
}

function showUsage() {
    console.log(`
📤 Script de Upload de Imagens para PocketBase

Uso:
  node upload-images.js --input <pasta_imagens>

Parâmetros:
  --input   Pasta contendo as imagens para upload
  --debug   Modo debug com logs detalhados

Exemplo:
  node upload-images.js --input ./optimized-images/images-2024-01-01

Configurações:
  - Coleção: ${config.COLLECTION_NAME}
  - Padrão de nomes: sku-XXXX.jpg ou skd-XXXX.jpg
  - Tipos suportados: ${config.SUPPORTED_IMAGE_TYPES.join(', ')}
  - Máximo simultâneo: ${config.MAX_CONCURRENT_UPLOADS}

Variáveis de ambiente necessárias:
  - POCKETBASE_URL
  - POCKETBASE_ADMIN_EMAIL
  - POCKETBASE_ADMIN_PASSWORD
`);
}

function cleanProductId(productId) {
    return productId.replace(/^(sku-|skd-)/i, '');
}

// --- PocketBase Operations ---
let pbInstance = null;

async function getPocketBaseInstance() {
    if (!pbInstance) {
        pbInstance = new PocketBase(config.POCKETBASE_URL);

        try {
            // Manual authentication request for compatibility with older PocketBase versions
            const authResponse = await fetch(`${config.POCKETBASE_URL}/api/collections/_superusers/auth-with-password`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    identity: config.POCKETBASE_ADMIN_EMAIL,
                    password: config.POCKETBASE_ADMIN_PASSWORD
                })
            });

            if (!authResponse.ok) {
                const errorData = await authResponse.json();
                throw new Error(`Authentication failed: ${errorData.message || authResponse.statusText}`);
            }

            const authData = await authResponse.json();
            
            // Manually set the auth store
            pbInstance.authStore.save(authData.token, authData.admin || authData.record);
            
            logger.success('Autenticação manual com PocketBase realizada');
            
        } catch (error) {
            logger.error('Erro na autenticação:', error.message);
            throw error;
        }
    }
    return pbInstance;
}

async function getInventoryItems(pb) {
    logger.info('Buscando itens do inventário...');

    const records = await withRetry(async () => {
        return await pb.collection(config.COLLECTION_NAME).getFullList({
            filter: 'product_id != ""',
            fields: 'id,product_id,images'
        });
    });

    logger.success(`${records.length} itens encontrados no inventário`);
    return records;
}

// --- File Operations ---
async function findImagesByProductId(inputDir) {
    logger.info(`Buscando estrutura de pastas em: ${inputDir}`);

    try {
        const entries = await fs.readdir(inputDir, { withFileTypes: true });
        const productMap = new Map();

        for (const entry of entries) {
            if (entry.isDirectory()) {
                // Directory name is the product_id (e.g., "sku-123", "skd-456")
                const productId = entry.name;
                const productDir = path.join(inputDir, productId);

                logger.debug(`Verificando pasta: ${productId}`);

                // Read files in this product directory
                const files = await fs.readdir(productDir);
                const imageFiles = files.filter(file => {
                    const ext = path.extname(file).toLowerCase();
                    return config.SUPPORTED_IMAGE_TYPES.includes(ext);
                });

                if (imageFiles.length > 0) {
                    productMap.set(productId, {
                        productId,
                        directory: productDir,
                        files: imageFiles
                    });
                    logger.debug(`  → ${imageFiles.length} imagens encontradas`);
                }
            }
        }

        logger.success(`${productMap.size} produtos com imagens encontrados`);
        return productMap;
    } catch (error) {
        throw new Error(`Erro ao ler estrutura de pastas: ${error.message}`);
    }
}

// Function removed - now using findImagesByProductId directly

async function uploadImagesToRecord(pb, record, productInfo) {
    const { files, directory } = productInfo;
    const formData = new FormData();

    // Clear existing images by replacing them completely
    if (record.images && record.images.length > 0) {
        logger.debug(`Substituindo ${record.images.length} imagens existentes por ${files.length} novas`);
    }

    // Add new images from product directory
    for (const fileName of files) {
        const filePath = path.join(directory, fileName);
        try {
            const fileBuffer = await fs.readFile(filePath);
            
            // Determine MIME type based on extension
            const ext = path.extname(fileName).toLowerCase();
            let mimeType = 'application/octet-stream';
            if (ext === '.jpg' || ext === '.jpeg') mimeType = 'image/jpeg';
            else if (ext === '.png') mimeType = 'image/png';
            else if (ext === '.webp') mimeType = 'image/webp';
            else if (ext === '.gif') mimeType = 'image/gif';
            
            const blob = new Blob([fileBuffer], { type: mimeType });
            formData.append('images', blob, fileName);
            logger.debug(`Adicionado para upload: ${fileName} (${mimeType})`);
        } catch (error) {
            throw new Error(`Erro ao ler arquivo ${fileName}: ${error.message}`);
        }
    }

    return await withRetry(async () => {
        logger.debug(`Fazendo upload para registro ID: ${record.id}`);
        try {
            // Use the same pattern as the app
            const result = await pb.collection('inventory').update(record.id, formData);
            return result;
        } catch (error) {
            logger.error(`Erro detalhado no upload para ${record.id}:`, error);
            logger.error(`Status: ${error.status}, Message: ${error.message}`);
            if (error.response) {
                logger.error(`Response:`, JSON.stringify(error.response, null, 2));
            }
            if (error.data && error.data.data) {
                logger.error(`Error data:`, JSON.stringify(error.data.data, null, 2));
            }
            throw error;
        }
    });
}

// --- Processing Functions ---
async function processInParallel(items, processor, concurrency = config.MAX_CONCURRENT_UPLOADS) {
    const results = [];

    for (let i = 0; i < items.length; i += concurrency) {
        const batch = items.slice(i, i + concurrency);
        const batchResults = await Promise.all(
            batch.map(item => processor(item).catch(error => ({ error, item })))
        );
        results.push(...batchResults);

        // Progress indicator
        const processed = Math.min(i + concurrency, items.length);
        const percentage = ((processed / items.length) * 100).toFixed(1);
        logger.info(`Progresso: ${processed}/${items.length} (${percentage}%)`);

        // Small delay between batches
        if (i + concurrency < items.length) {
            await sleep(500);
        }
    }

    return results;
}

// --- Main Function ---
async function main() {
    try {
        const inputDir = getArgument('--input');

        if (!inputDir) {
            showUsage();
            process.exit(1);
        }

        // Validate environment
        const requiredVars = ['POCKETBASE_URL', 'POCKETBASE_ADMIN_EMAIL', 'POCKETBASE_ADMIN_PASSWORD'];
        const missingVars = requiredVars.filter(key => !process.env[key]);
        if (missingVars.length > 0) {
            throw new Error(`Variáveis de ambiente ausentes: ${missingVars.join(', ')}`);
        }

        logger.info('🚀 Iniciando upload de imagens para PocketBase...\n');

        // 1. Validate input directory
        try {
            await fs.access(inputDir);
        } catch (error) {
            throw new Error(`Pasta de entrada não encontrada: ${inputDir}`);
        }

        // 2. Setup PocketBase
        const pb = await getPocketBaseInstance();

        // 3. Find images organized by product directories
        const productImageMap = await findImagesByProductId(inputDir);

        if (productImageMap.size === 0) {
            logger.warn('Nenhuma pasta de produto com imagens encontrada');
            logger.info('Estrutura esperada: pasta-input/sku-123/imagem1.jpg, pasta-input/skd-456/imagem2.webp');
            return;
        }

        // 4. Get inventory items
        const inventoryItems = await getInventoryItems(pb);

        // 5. Match inventory items with image directories
        const itemsToProcess = inventoryItems.filter(item => {
            return productImageMap.has(item.product_id);
        });

        if (itemsToProcess.length === 0) {
            logger.warn('Nenhum item do inventário corresponde às pastas encontradas');
            logger.info('\nItens do inventário disponíveis (primeiros 10):');
            inventoryItems.slice(0, 10).forEach(item => {
                logger.info(`  - ${item.product_id}`);
            });
            logger.info('\nPastas encontradas:');
            Array.from(productImageMap.keys()).slice(0, 10).forEach(productId => {
                const info = productImageMap.get(productId);
                logger.info(`  - ${productId} (${info.files.length} imagens)`);
            });
            return;
        }

        logger.info(`\n📤 ${itemsToProcess.length} itens serão processados para upload`);

        // 7. Process uploads
        const startTime = Date.now();

        const results = await processInParallel(itemsToProcess, async (item) => {
            try {
                const productInfo = productImageMap.get(item.product_id);
                const previousCount = item.images?.length || 0;

                logger.info(`Processando: ${item.product_id} (${previousCount} → ${productInfo.files.length} imagens)`);

                const updatedRecord = await uploadImagesToRecord(pb, item, productInfo);

                return {
                    success: true,
                    productId: item.product_id,
                    imagesUploaded: productInfo.files.length,
                    previousImages: previousCount,
                    totalImages: updatedRecord.images?.length || 0
                };

            } catch (error) {
                logger.error(`Erro ao processar ${item.product_id}: ${error.message}`);
                return {
                    success: false,
                    productId: item.product_id,
                    error: error.message
                };
            }
        });

        const endTime = Date.now();
        const totalTime = (endTime - startTime) / 1000;

        // 8. Generate report
        const successful = results.filter(r => r.success);
        const failed = results.filter(r => !r.success);

        const totalImagesUploaded = successful.reduce((sum, r) => sum + r.imagesUploaded, 0);

        logger.info('\n📊 === RELATÓRIO DE UPLOAD ===');
        logger.success(`✅ Itens processados com sucesso: ${successful.length}`);

        if (failed.length > 0) {
            logger.error(`❌ Itens com falha: ${failed.length}`);
            failed.forEach(item => {
                logger.error(`  - ${item.productId}: ${item.error}`);
            });
        }

        const totalPreviousImages = successful.reduce((sum, r) => sum + (r.previousImages || 0), 0);

        logger.success(`📷 Total de imagens enviadas: ${totalImagesUploaded}`);
        logger.info(`🔄 Imagens substituídas: ${totalPreviousImages} → ${totalImagesUploaded}`);
        logger.success(`📁 Pasta processada: ${inputDir}`);
        logger.success(`⏱️ Tempo total: ${totalTime.toFixed(2)}s`);

        console.log('\n🎉 Upload concluído!');

    } catch (error) {
        logger.error('Erro fatal durante a execução:', error);
        process.exit(1);
    }
}

// Execute if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
    main();
}