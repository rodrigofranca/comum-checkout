// scripts/optimize-images/optimize-inventory-images.js

/*
 * =============================================================================
 *  SCRIPT DE OTIMIZAÇÃO DE IMAGENS DO INVENTÁRIO
 * =============================================================================
 *
 * Este script otimiza as imagens existentes na tabela inventory:
 * - Redimensiona para máximo 1200x1200px
 * - Converte para JPEG com qualidade 80%
 * - Mantém proporções originais
 * - Reduz significativamente o tamanho dos arquivos
 *
 * INSTRUÇÕES PARA EXECUTAR:
 * 1. Instale as dependências:
 *    pnpm install sharp
 *
 * 2. Configure o arquivo .env na raiz do projeto
 *
 * 3. Execute o script:
 *    node scripts/optimize-images/optimize-inventory-images.js
 *
 * Para executar com debug:
 *    node scripts/optimize-images/optimize-inventory-images.js --debug
 *
 * =============================================================================
 */

import PocketBase from 'pocketbase';
import sharp from 'sharp';
import 'dotenv/config';
import path from 'path';

// --- CONFIGURAÇÕES ---
const config = {
    POCKETBASE_URL: process.env.POCKETBASE_URL,
    POCKETBASE_ADMIN_EMAIL: process.env.POCKETBASE_ADMIN_EMAIL,
    POCKETBASE_ADMIN_PASSWORD: process.env.POCKETBASE_ADMIN_PASSWORD,
    COLLECTION_NAME: 'inventory',
    MAX_CONCURRENT_OPTIMIZATIONS: 2, // Número máximo de otimizações simultâneas
    RETRY_ATTEMPTS: 3,
    RETRY_DELAY: 1000,
    // Configurações de otimização
    OPTIMIZATION: {
        MAX_WIDTH: 1200,
        MAX_HEIGHT: 1200,
        QUALITY: 80,
        PROGRESSIVE: true,
        FORMAT: 'jpeg'
    }
};

// --- UTILITÁRIOS ---
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

/**
 * Função para aguardar um tempo específico
 */
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Wrapper para retry automático
 */
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

/**
 * Validação das variáveis de ambiente
 */
function validateConfig() {
    const required = ['POCKETBASE_URL', 'POCKETBASE_ADMIN_EMAIL', 'POCKETBASE_ADMIN_PASSWORD'];
    const missing = required.filter(key => !config[key]);

    if (missing.length > 0) {
        throw new Error(`Variáveis de ambiente obrigatórias não encontradas: ${missing.join(', ')}`);
    }
}

/**
 * Instância global do PocketBase
 */
let pbInstance = null;

/**
 * Obtém ou cria a instância do PocketBase
 */
async function getPocketBaseInstance() {
    if (!pbInstance) {
        pbInstance = new PocketBase(config.POCKETBASE_URL);
        await pbInstance.admins.authWithPassword(
            config.POCKETBASE_ADMIN_EMAIL,
            config.POCKETBASE_ADMIN_PASSWORD
        );
        logger.success('Autenticação com PocketBase realizada com sucesso');
    }
    return pbInstance;
}

/**
 * Otimiza uma imagem usando Sharp
 * @param {Buffer} imageBuffer - Buffer da imagem original
 * @param {string} originalFormat - Formato original da imagem
 * @returns {Promise<{buffer: Buffer, originalSize: number, optimizedSize: number}>}
 */
async function optimizeImage(imageBuffer, originalFormat = 'jpeg') {
    const originalSize = imageBuffer.length;

    logger.debug(`Otimizando imagem de ${(originalSize / 1024 / 1024).toFixed(2)}MB...`);

    const optimizedBuffer = await sharp(imageBuffer)
        .resize(config.OPTIMIZATION.MAX_WIDTH, config.OPTIMIZATION.MAX_HEIGHT, {
            fit: 'inside',
            withoutEnlargement: true
        })
        .jpeg({
            quality: config.OPTIMIZATION.QUALITY,
            progressive: config.OPTIMIZATION.PROGRESSIVE
        })
        .toBuffer();

    const optimizedSize = optimizedBuffer.length;
    const reductionPercent = ((originalSize - optimizedSize) / originalSize * 100).toFixed(2);

    logger.debug(`Otimização concluída: ${(optimizedSize / 1024 / 1024).toFixed(2)}MB (${reductionPercent}% redução)`);

    return {
        buffer: optimizedBuffer,
        originalSize,
        optimizedSize
    };
}

/**
 * Baixa uma imagem do PocketBase
 * @param {PocketBase} pb - Instância do PocketBase
 * @param {Object} record - Registro do inventário
 * @param {string} imageFileName - Nome do arquivo da imagem
 * @returns {Promise<Buffer>}
 */
async function downloadImage(pb, record, imageFileName) {
    const imageUrl = await pb.files.getURL(record, imageFileName);

    logger.debug(`Baixando imagem: ${imageFileName}`);
    logger.debug(`URL gerada para download: ${imageUrl}`);

    const response = await fetch(imageUrl);

    if (!response.ok) {
        throw new Error(`Erro ao baixar imagem: ${response.status} ${response.statusText}`);
    }

    const arrayBuffer = await response.arrayBuffer();
    return Buffer.from(arrayBuffer);
}

/**
 * Processa um registro do inventário
 * @param {PocketBase} pb - Instância do PocketBase
 * @param {Object} record - Registro do inventário
 * @returns {Promise<Object>}
 */
async function processInventoryRecord(pb, record) {
    const result = {
        recordId: record.id,
        productId: record.product_id,
        title: record.title,
        totalOriginalSize: 0,
        totalOptimizedSize: 0,
        imagesProcessed: 0,
        errors: []
    };

    if (!record.images || record.images.length === 0) {
        logger.debug(`Registro ${record.product_id} não possui imagens`);
        return { ...result, skipped: true };
    }

    logger.info(`Processando: ${record.product_id} (${record.title}) - ${record.images.length} imagens`);

    const formData = new FormData();
    const originalImageFiles = [...record.images]; // Copia para evitar mutação

    for (const imageFileName of originalImageFiles) {
        try {
            // 1. Baixa a imagem original
            const originalBuffer = await downloadImage(pb, record, imageFileName);

            // 2. Otimiza a imagem
            const { buffer: optimizedBuffer, originalSize, optimizedSize } = await optimizeImage(originalBuffer);

            // 3. Verifica se a otimização realmente reduziu o tamanho
            if (optimizedSize >= originalSize) {
                logger.debug(`Imagem ${imageFileName} já está otimizada. Mantendo original.`);
                // Re-anexa o buffer original para não perder a imagem
                formData.append('images', new Blob([originalBuffer]), imageFileName);
                result.totalOriginalSize += originalSize;
                result.totalOptimizedSize += originalSize; // Sem alteração de tamanho
                continue;
            }

            // Anexa a nova imagem otimizada
            const fileExtension = path.extname(imageFileName);
            const newFileName = imageFileName.replace(fileExtension, '.jpg');
            formData.append('images', new Blob([optimizedBuffer], { type: 'image/jpeg' }), newFileName);

            result.totalOriginalSize += originalSize;
            result.totalOptimizedSize += optimizedSize;
            result.imagesProcessed++;
            logger.debug(`✓ Imagem ${imageFileName} otimizada e preparada para upload.`);

        } catch (error) {
            logger.error(`Erro ao processar imagem ${imageFileName}:`, error.message);
            result.errors.push({ imageFileName, error: error.message });
        }
    }

    // 4. Faz um único upload atômico com todas as imagens (otimizadas e mantidas)
    try {
        // Apenas faz o upload se houver imagens processadas ou se nem todas deram erro
        const totalImagesInForm = Array.from(formData.keys()).length;
        if (totalImagesInForm > 0) {
            logger.debug(`Fazendo upload de ${totalImagesInForm} imagens para o registro ${record.product_id}...`);
            await pb.collection(config.COLLECTION_NAME).update(record.id, formData);
        } else {
            logger.warn(`Nenhuma imagem para fazer upload para ${record.product_id}. Verifique os erros.`);
        }
    } catch (uploadError) {
        logger.error(`Erro ao fazer o upload final para ${record.product_id}:`, uploadError.message);
        result.errors.push({ imageFileName: 'FINAL_UPLOAD', error: uploadError.message });
    }

    const totalReduction = result.totalOriginalSize > 0 ?
        ((result.totalOriginalSize - result.totalOptimizedSize) / result.totalOriginalSize * 100).toFixed(2) : 0;

    logger.success(`Concluído: ${record.product_id} - ${result.imagesProcessed} imagens otimizadas (${totalReduction}% redução)`);

    return result;
}

/**
 * Processa múltiplos registros em paralelo
 * @param {Array} items - Array de itens para processar
 * @param {Function} processor - Função de processamento
 * @param {number} concurrency - Número de processamentos simultâneos
 * @returns {Promise<Array>}
 */
async function processInParallel(items, processor, concurrency = config.MAX_CONCURRENT_OPTIMIZATIONS) {
    const results = [];

    for (let i = 0; i < items.length; i += concurrency) {
        const batch = items.slice(i, i + concurrency);
        const batchResults = await Promise.all(
            batch.map(item => processor(item).catch(error => ({
                error: error.message,
                item: item.id
            })))
        );
        results.push(...batchResults);

        // Pequena pausa entre batches para não sobrecarregar o servidor
        if (i + concurrency < items.length) {
            await sleep(100);
        }
    }

    return results;
}

/**
 * Busca todos os registros do inventário que possuem imagens
 * @param {PocketBase} pb - Instância do PocketBase
 * @returns {Promise<Array>}
 */
async function getInventoryRecordsWithImages(pb) {
    logger.info('Buscando registros do inventário com imagens...');

    const records = await withRetry(async () => {
        return await pb.collection(config.COLLECTION_NAME).getFullList({
            filter: 'images != ""',
            sort: 'created'
        });
    });

    logger.info(`Encontrados ${records.length} registros com imagens`);
    return records;
}

/**
 * Função principal
 */
async function main() {
    try {
        console.log('🚀 Iniciando otimização de imagens do inventário...\n');

        // 1. Validação das configurações
        validateConfig();

        // 2. Conecta ao PocketBase
        const pb = await getPocketBaseInstance();

        // 3. Busca registros com imagens
        const records = await getInventoryRecordsWithImages(pb);

        if (records.length === 0) {
            logger.success('Nenhum registro com imagens encontrado. Nada a fazer!');
            return;
        }

        // 4. Processa registros em paralelo
        logger.info(`\n📸 Processando ${records.length} registros...`);
        const startTime = Date.now();

        const results = await processInParallel(records, async (record) => {
            return await withRetry(async () => {
                return await processInventoryRecord(pb, record);
            });
        });

        const endTime = Date.now();
        const totalTime = (endTime - startTime) / 1000;

        // 5. Relatório final
        console.log('\n📊 === RELATÓRIO FINAL ===');

        const successful = results.filter(r => !r.error && !r.skipped);
        const skipped = results.filter(r => r.skipped);
        const failed = results.filter(r => r.error);

        const totalImagesProcessed = successful.reduce((sum, r) => sum + r.imagesProcessed, 0);
        const totalOriginalSize = successful.reduce((sum, r) => sum + r.totalOriginalSize, 0);
        const totalOptimizedSize = successful.reduce((sum, r) => sum + r.totalOptimizedSize, 0);
        const totalReduction = totalOriginalSize > 0 ?
            ((totalOriginalSize - totalOptimizedSize) / totalOriginalSize * 100).toFixed(2) : 0;

        logger.success(`✅ Registros processados: ${successful.length}`);
        logger.info(`⏭️ Registros pulados: ${skipped.length}`);
        if (failed.length > 0) {
            logger.error(`❌ Registros com erro: ${failed.length}`);
        }

        logger.success(`📷 Total de imagens otimizadas: ${totalImagesProcessed}`);
        logger.success(`💾 Tamanho original total: ${(totalOriginalSize / 1024 / 1024).toFixed(2)}MB`);
        logger.success(`💾 Tamanho otimizado total: ${(totalOptimizedSize / 1024 / 1024).toFixed(2)}MB`);
        logger.success(`📉 Redução total: ${totalReduction}% (${((totalOriginalSize - totalOptimizedSize) / 1024 / 1024).toFixed(2)}MB economizados)`);
        logger.success(`⏱️ Tempo total: ${totalTime.toFixed(2)}s`);

        // Detalhes dos erros
        if (failed.length > 0) {
            console.log('\n❌ Erros encontrados:');
            failed.forEach(item => {
                logger.error(`  - ${item.item}: ${item.error}`);
            });
        }

        console.log('\n🎉 Otimização concluída!');

    } catch (error) {
        logger.error('Erro fatal durante a execução:', error);
        process.exit(1);
    }
}

// Executa apenas se o script foi chamado diretamente
if (import.meta.url === `file://${process.argv[1]}`) {
    main();
}

export { optimizeImage, processInventoryRecord };