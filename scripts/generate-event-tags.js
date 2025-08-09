// scripts/generate-event-tags.js

/*
 * =============================================================================
 *  SCRIPT DE GERAÇÃO DE ETIQUETAS PARA EVENTOS
 * =============================================================================
 *
 * Este script conecta ao Google Drive, busca produtos com evento=true
 * e gera etiquetas com product-id, QR code e preço.
 * 
 * Uso:
 *   node scripts/generate-event-tags.js [--debug] [--output <arquivo>]
 *
 * Opções:
 *   --debug: Modo debug com logs detalhados
 *   --output: Arquivo JSON de saída (padrão: event-tags-{timestamp}.json)
 *
 * =============================================================================
 */

import { google } from 'googleapis';
import 'dotenv/config';
import { promises as fs } from 'fs';
import path from 'path';

// --- Configuration ---
const config = {
    GOOGLE_DRIVE_FOLDER_ID: process.env.GOOGLE_DRIVE_FOLDER_ID,
    GOOGLE_CREDENTIALS_PATH: process.env.GOOGLE_CREDENTIALS_PATH,
    BASE_URL: 'https://checkout.acervocomum.com.br', // URL base para QR codes
    DEFAULT_PRICE: 10.00, // Preço padrão para etiquetas
    PRODUCT_ID_REGEX: /^(skd|sku)-([a-z0-9]+)/i, // Extrai product_id do nome do arquivo
    RETRY_ATTEMPTS: 3,
    RETRY_DELAY: 1000
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

function validateConfig() {
    const required = ['GOOGLE_DRIVE_FOLDER_ID', 'GOOGLE_CREDENTIALS_PATH'];
    const missing = required.filter(key => !config[key]);

    if (missing.length > 0) {
        throw new Error(`Variáveis de ambiente obrigatórias não encontradas: ${missing.join(', ')}`);
    }
}

// --- Google Drive Operations ---
async function findProjectRoot() {
    let currentDir = process.cwd();
    const projectRootIndicators = ['.env', '.git', 'package.json'];

    while (currentDir !== '/') {
        for (const indicator of projectRootIndicators) {
            try {
                await fs.access(path.join(currentDir, indicator));
                logger.debug(`Raiz do projeto encontrada em: ${currentDir}`);
                return currentDir;
            } catch (error) {
                // Continue searching
            }
        }
        const parentDir = path.dirname(currentDir);
        if (parentDir === currentDir) break;
        currentDir = parentDir;
    }

    if (process.cwd().includes('scripts/')) {
        return path.resolve(process.cwd(), '../..');
    }
    return process.cwd();
}

async function setupGoogleDrive() {
    const projectRoot = await findProjectRoot();
    const credentialsPath = path.join(projectRoot, config.GOOGLE_CREDENTIALS_PATH);

    try {
        await fs.access(credentialsPath);
        logger.debug(`Arquivo de credenciais encontrado em: ${credentialsPath}`);
    } catch (error) {
        throw new Error(`Arquivo de credenciais não encontrado: ${credentialsPath}`);
    }

    const auth = new google.auth.GoogleAuth({
        keyFile: credentialsPath,
        scopes: ['https://www.googleapis.com/auth/drive.readonly']
    });

    const drive = google.drive({ version: 'v3', auth });
    logger.success('Autenticação com Google Drive realizada');
    
    return drive;
}

// --- Data Processing ---
async function getEventProducts(drive) {
    logger.info('Buscando arquivos de imagens no Google Drive...');
    
    const files = [];
    let pageToken = null;
    const searchQuery = `'${config.GOOGLE_DRIVE_FOLDER_ID}' in parents and (mimeType contains 'image/')`;

    do {
        const response = await withRetry(async () => {
            return await drive.files.list({
                q: searchQuery,
                fields: 'nextPageToken, files(id, name, mimeType)',
                pageSize: 1000,
                pageToken: pageToken
            });
        });

        if (response.data.files) {
            files.push(...response.data.files);
        }
        
        pageToken = response.data.nextPageToken;
    } while (pageToken);

    logger.success(`${files.length} arquivos encontrados no Google Drive`);
    
    // Extrai product_ids únicos dos nomes dos arquivos
    const productIds = new Set();
    const products = [];
    
    files.forEach(file => {
        const match = file.name.match(config.PRODUCT_ID_REGEX);
        if (match) {
            const productId = `${match[1]}-${match[2]}`.toLowerCase();
            
            if (!productIds.has(productId)) {
                productIds.add(productId);
                
                // Cria um produto básico para cada product_id único
                products.push({
                    product_id: productId,
                    title: `Produto ${productId.toUpperCase()}`,
                    price: config.DEFAULT_PRICE,
                    status: 'disponível',
                    evento: true // Consideramos todos como eventos já que estão no Drive
                });
                
                logger.debug(`Product ID encontrado: ${productId}`);
            }
        } else {
            logger.debug(`Nome de arquivo não corresponde ao padrão: ${file.name}`);
        }
    });
    
    logger.success(`${products.length} produtos únicos extraídos dos nomes dos arquivos`);
    return products;
}

function formatPrice(price) {
    // Convert price to proper BRL format
    if (typeof price === 'number') {
        return new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL'
        }).format(price);
    }
    
    // If already a string, return as is (assuming it's already formatted)
    return price.toString();
}

function generateProductUrl(productId) {
    // Generate URL for the product page (can be customized based on your needs)
    return `${config.BASE_URL}?product=${encodeURIComponent(productId)}`;
}

function convertToTagFormat(products) {
    logger.info('Convertendo produtos para formato de etiquetas...');
    
    const tags = products.map(product => {
        const productUrl = generateProductUrl(product.product_id);
        
        logger.debug(`Processando: ${product.product_id} - ${product.title}`);
        
        return {
            name: `${product.product_id} - ${product.title}`,
            price: formatPrice(product.price),
            url: productUrl,
            // Additional data for reference
            product_id: product.product_id,
            title: product.title,
            raw_price: product.price,
            id: product.id
        };
    });
    
    logger.success(`${tags.length} etiquetas preparadas`);
    return tags;
}

// --- File Operations ---
async function saveTagsToFile(tags, outputPath) {
    try {
        const jsonContent = JSON.stringify(tags, null, 2);
        await fs.writeFile(outputPath, jsonContent, 'utf8');
        logger.success(`Etiquetas salvas em: ${outputPath}`);
        return outputPath;
    } catch (error) {
        throw new Error(`Erro ao salvar arquivo: ${error.message}`);
    }
}

async function openTagGenerator(tagsFile) {
    logger.info('\n🏷️  Para gerar as etiquetas visuais:');
    logger.info(`1. Abra: tag-generator/index.html no navegador`);
    logger.info(`2. Cole o conteúdo do arquivo: ${tagsFile}`);
    logger.info(`3. Clique em "Gerar Etiquetas"`);
    logger.info(`4. Use Ctrl+P para imprimir`);
    
    // Try to automatically copy content to clipboard on supported systems
    try {
        const { exec } = await import('child_process');
        const jsonContent = await fs.readFile(tagsFile, 'utf8');
        
        // Copy to clipboard on different systems
        const platform = process.platform;
        if (platform === 'darwin') {
            exec(`echo '${jsonContent}' | pbcopy`);
            logger.info('\n📋 JSON copiado para a área de transferência (macOS)');
        } else if (platform === 'linux') {
            exec(`echo '${jsonContent}' | xclip -selection clipboard`);
            logger.info('\n📋 JSON copiado para a área de transferência (Linux)');
        } else if (platform === 'win32') {
            exec(`echo '${jsonContent}' | clip`);
            logger.info('\n📋 JSON copiado para a área de transferência (Windows)');
        }
    } catch (error) {
        logger.debug('Não foi possível copiar para área de transferência:', error.message);
    }
}

// --- Main Function ---
async function main() {
    try {
        logger.info('🏷️  Iniciando geração de etiquetas para eventos...\n');

        // 1. Validate configuration
        validateConfig();

        // 2. Setup Google Drive connection
        const drive = await setupGoogleDrive();

        // 3. Get products for events
        const products = await getEventProducts(drive);
        
        if (products.length === 0) {
            logger.warn('Nenhum produto encontrado com evento=true');
            logger.info('Verifique se existem imagens no Google Drive com nomes skd-* ou sku-*');
            return;
        }

        // 4. Convert to tag format
        const tags = convertToTagFormat(products);

        // 5. Generate output filename
        const outputFile = getArgument('--output') || 
            `event-tags-${new Date().toISOString().slice(0, 19).replace(/:/g, '-')}.json`;
        
        const outputPath = path.resolve(outputFile);

        // 6. Save tags to file
        await saveTagsToFile(tags, outputPath);

        // 7. Display summary
        logger.info('\n📊 === RESUMO ===');
        logger.success(`✅ Produtos processados: ${products.length}`);
        logger.success(`🏷️  Etiquetas geradas: ${tags.length}`);
        logger.success(`💾 Arquivo salvo: ${outputPath}`);
        
        // 8. Show products summary
        if (DEBUG_MODE) {
            logger.debug('\n📦 Produtos incluídos:');
            products.forEach((product, index) => {
                logger.debug(`  ${index + 1}. ${product.product_id} - ${product.title} (${formatPrice(product.price)})`);
            });
        } else {
            logger.info(`\nPrimeiros 5 produtos:`);
            products.slice(0, 5).forEach((product, index) => {
                logger.info(`  ${index + 1}. ${product.product_id} - ${product.title} (${formatPrice(product.price)})`);
            });
            if (products.length > 5) {
                logger.info(`  ... e mais ${products.length - 5} produtos`);
            }
        }

        // 9. Instructions for next steps
        await openTagGenerator(outputPath);

        console.log('\n🎉 Geração de etiquetas concluída!');

    } catch (error) {
        logger.error('Erro fatal durante a execução:', error);
        process.exit(1);
    }
}

// Execute if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
    main();
}