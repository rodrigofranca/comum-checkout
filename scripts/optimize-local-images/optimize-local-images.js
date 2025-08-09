// scripts/optimize-local-images/optimize-local-images.js

import sharp from 'sharp';
import path from 'path';
import { promises as fs } from 'fs';

// --- Configuration ---
const config = {
    MAX_CONCURRENT_OPTIMIZATIONS: 4,
    RETRY_ATTEMPTS: 3,
    RETRY_DELAY: 1000,
    SUPPORTED_IMAGE_TYPES: ['.jpg', '.jpeg', '.png', '.gif', '.webp'],
    OPTIMIZATION: {
        MAX_WIDTH: 300,
        // MAX_HEIGHT: 300,
        QUALITY: 85,
        PROGRESSIVE: true,
        FORMAT: 'jpeg'
    },
    PRODUCT_ID_REGEX: /(?:skd|sku)[-_]([a-z0-9]+)/i
};

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
🖼️  Script de Otimização de Imagens Locais

Uso:
  node optimize-local-images.js --input <pasta_origem> --output <pasta_destino>

Parâmetros:
  --input   Pasta contendo as imagens originais
  --output  Pasta onde salvar as imagens otimizadas
  --debug   Modo debug com logs detalhados

Exemplo:
  node optimize-local-images.js --input ./downloaded-images/images-2024-01-01 --output ./optimized-images/images-2024-01-01

Configurações de otimização:
  - Redimensionamento máximo: ${config.OPTIMIZATION.MAX_WIDTH}x${config.OPTIMIZATION.MAX_HEIGHT}px
  - Qualidade: ${config.OPTIMIZATION.QUALITY}%
  - Formato de saída: ${config.OPTIMIZATION.FORMAT}
  - Sufixo: -md
  - Organização: Pasta por produto (sku/skd ID)
  - Tipos suportados: ${config.SUPPORTED_IMAGE_TYPES.join(', ')}
`);
}

// --- File Operations ---
async function findImageFiles(inputDir) {
    logger.info(`Buscando imagens em: ${inputDir}`);

    try {
        const files = await fs.readdir(inputDir);
        const imageFiles = files.filter(file => {
            const ext = path.extname(file).toLowerCase();
            return config.SUPPORTED_IMAGE_TYPES.includes(ext);
        });

        logger.success(`${imageFiles.length} imagens encontradas`);
        return imageFiles.map(file => path.join(inputDir, file));
    } catch (error) {
        throw new Error(`Erro ao ler pasta de entrada: ${error.message}`);
    }
}

function extractProductInfo(fileName) {
    const match = fileName.match(config.PRODUCT_ID_REGEX);
    if (match) {
        const prefix = match[0].split(/[-_]/)[0].toLowerCase(); // skd ou sku
        const id = match[1].toLowerCase();
        return { prefix, id, fullId: `${prefix}-${id}` };
    }
    return null;
}

async function createProductDirectory(outputBaseDir, productId) {
    const productDir = path.join(outputBaseDir, productId);
    try {
        await fs.mkdir(productDir, { recursive: true });
        return productDir;
    } catch (error) {
        throw new Error(`Erro ao criar pasta ${productDir}: ${error.message}`);
    }
}

async function optimizeImage(inputPath, outputBaseDir) {
    const fileName = path.basename(inputPath);
    const fileNameWithoutExt = path.basename(inputPath, path.extname(inputPath));
    logger.debug(`Otimizando: ${fileName}`);

    try {
        // Extract product info from filename
        const productInfo = extractProductInfo(fileName);
        if (!productInfo) {
            throw new Error(`Nome de arquivo não segue padrão sku/skd: ${fileName}`);
        }

        // Create product directory with full prefix
        const productDir = await createProductDirectory(outputBaseDir, productInfo.fullId);

        const stats = await fs.stat(inputPath);
        const originalSize = stats.size;

        const image = sharp(inputPath);
        const metadata = await image.metadata();

        logger.debug(`  Original: ${metadata.width}x${metadata.height} - ${(originalSize / 1024 / 1024).toFixed(2)}MB`);
        logger.debug(`  Produto: ${productInfo.fullId} -> pasta: ${productDir}`);

        // Optimize image for web
        let sharpInstance = image
            .rotate() // Auto-rotate based on EXIF orientation
            .resize(config.OPTIMIZATION.MAX_WIDTH, config.OPTIMIZATION.MAX_HEIGHT, {
                fit: 'inside',
                withoutEnlargement: true
            });

        // Apply web optimization based on format
        let optimizedBuffer;
        let outputExtension;

        if (config.OPTIMIZATION.FORMAT === 'webp') {
            optimizedBuffer = await sharpInstance
                .webp({
                    quality: config.OPTIMIZATION.QUALITY,
                    effort: 6 // Maximum compression effort
                })
                .toBuffer();
            outputExtension = '.webp';
        } else {
            optimizedBuffer = await sharpInstance
                .jpeg({
                    quality: config.OPTIMIZATION.QUALITY,
                    progressive: config.OPTIMIZATION.PROGRESSIVE,
                    mozjpeg: true // Better compression
                })
                .toBuffer();
            outputExtension = '.jpg';
        }

        const optimizedSize = optimizedBuffer.length;
        const reduction = ((originalSize - optimizedSize) / originalSize * 100);

        // Generate output filename with -md suffix
        const outputFileName = `${fileNameWithoutExt}-md${outputExtension}`;
        const finalOutputPath = path.join(productDir, outputFileName);

        // Always save optimized version (web optimization is always beneficial)
        await fs.writeFile(finalOutputPath, optimizedBuffer);

        logger.debug(`  Otimizada: ${(optimizedSize / 1024 / 1024).toFixed(2)}MB (${reduction.toFixed(1)}% redução)`);

        return {
            fileName: outputFileName,
            productId: productInfo.fullId,
            originalSize,
            optimizedSize,
            reduction,
            copied: false,
            outputPath: finalOutputPath
        };

    } catch (error) {
        throw new Error(`Erro ao otimizar ${fileName}: ${error.message}`);
    }
}

async function processInParallel(items, processor, concurrency = config.MAX_CONCURRENT_OPTIMIZATIONS) {
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
            await sleep(100);
        }
    }

    return results;
}

// --- Main Function ---
async function main() {
    try {
        const inputDir = getArgument('--input');
        const outputDir = getArgument('--output');

        if (!inputDir || !outputDir) {
            showUsage();
            process.exit(1);
        }

        logger.info('🚀 Iniciando otimização de imagens locais...\n');

        // 1. Validate input directory
        try {
            await fs.access(inputDir);
        } catch (error) {
            throw new Error(`Pasta de entrada não encontrada: ${inputDir}`);
        }

        // 2. Create output directory
        try {
            await fs.mkdir(outputDir, { recursive: true });
            logger.success(`Pasta de saída criada: ${outputDir}`);
        } catch (error) {
            throw new Error(`Erro ao criar pasta de saída: ${error.message}`);
        }

        // 3. Find image files
        const imageFiles = await findImageFiles(inputDir);

        if (imageFiles.length === 0) {
            logger.warn('Nenhuma imagem encontrada na pasta de entrada');
            return;
        }

        // 4. Process images
        logger.info(`\n🖼️ Otimizando ${imageFiles.length} imagens...`);
        const startTime = Date.now();

        const results = await processInParallel(imageFiles, async (inputPath) => {
            return await withRetry(async () => {
                return await optimizeImage(inputPath, outputDir);
            });
        });

        const endTime = Date.now();
        const totalTime = (endTime - startTime) / 1000;

        // 5. Generate report
        const successful = results.filter(r => !r.error);
        const failed = results.filter(r => r.error);

        const totalOriginalSize = successful.reduce((sum, r) => sum + r.originalSize, 0);
        const totalOptimizedSize = successful.reduce((sum, r) => sum + r.optimizedSize, 0);
        const totalReduction = totalOriginalSize > 0 ?
            ((totalOriginalSize - totalOptimizedSize) / totalOriginalSize * 100) : 0;

        // Group by product
        const productGroups = successful.reduce((groups, r) => {
            if (!groups[r.productId]) groups[r.productId] = [];
            groups[r.productId].push(r.fileName);
            return groups;
        }, {});

        logger.info('\n📊 === RELATÓRIO DE OTIMIZAÇÃO ===');
        logger.success(`✅ Imagens processadas: ${successful.length}`);
        logger.success(`📦 Produtos organizados: ${Object.keys(productGroups).length}`);

        if (failed.length > 0) {
            logger.error(`❌ Falhas: ${failed.length}`);
            failed.forEach(item => {
                const fileName = typeof item.item === 'string' ? path.basename(item.item) : 'unknown';
                logger.error(`  - ${fileName}: ${item.error.message || item.error}`);
            });
        }

        logger.success(`💾 Tamanho original: ${(totalOriginalSize / 1024 / 1024).toFixed(2)}MB`);
        logger.success(`💾 Tamanho otimizado: ${(totalOptimizedSize / 1024 / 1024).toFixed(2)}MB`);
        logger.success(`📉 Redução total: ${totalReduction.toFixed(2)}% (${((totalOriginalSize - totalOptimizedSize) / 1024 / 1024).toFixed(2)}MB economizados)`);
        logger.success(`🌐 Formato para web: ${config.OPTIMIZATION.FORMAT.toUpperCase()}`);
        logger.success(`📐 Redimensionamento: ${config.OPTIMIZATION.MAX_WIDTH}x${config.OPTIMIZATION.MAX_HEIGHT}px`);
        logger.success(`📁 Pasta de destino: ${outputDir}`);
        logger.success(`⏱️ Tempo total: ${totalTime.toFixed(2)}s`);

        // Show product organization
        if (DEBUG_MODE) {
            logger.debug('\n📦 Organização por produtos:');
            Object.entries(productGroups).forEach(([productId, files]) => {
                logger.debug(`  ${productId}/ (${files.length} arquivos)`);
                files.forEach(file => logger.debug(`    - ${file}`));
            });
        }

        console.log('\n🎉 Otimização concluída!');

    } catch (error) {
        logger.error('Erro fatal durante a execução:', error);
        process.exit(1);
    }
}

// Execute if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
    main();
}