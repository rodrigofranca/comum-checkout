// scripts/download-images/download-images.js

import { google } from 'googleapis';
import 'dotenv/config';
import path from 'path';
import { promises as fs } from 'fs';

// --- Configuration ---
const config = {
    GOOGLE_DRIVE_FOLDER_ID: process.env.GOOGLE_DRIVE_FOLDER_ID,
    GOOGLE_CREDENTIALS_PATH: process.env.GOOGLE_CREDENTIALS_PATH,
    MAX_CONCURRENT_DOWNLOADS: 3,
    MAX_FILE_SIZE: 50 * 1024 * 1024, // 50MB
    RETRY_ATTEMPTS: 3,
    RETRY_DELAY: 1000,
    SUPPORTED_IMAGE_TYPES: ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
    OUTPUT_BASE_DIR: 'downloaded-images'
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

    if (process.cwd().includes('scripts/download-images')) {
        return path.resolve(process.cwd(), '../..');
    }
    return process.cwd();
}

// --- Google Drive Setup ---
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

    return google.drive({ version: 'v3', auth });
}

// --- Directory Management ---
async function createOutputDirectory(folderName) {
    const projectRoot = await findProjectRoot();
    const outputDir = path.join(projectRoot, config.OUTPUT_BASE_DIR, folderName);
    
    try {
        await fs.mkdir(outputDir, { recursive: true });
        logger.success(`Pasta criada: ${outputDir}`);
        return outputDir;
    } catch (error) {
        throw new Error(`Erro ao criar pasta ${outputDir}: ${error.message}`);
    }
}

// --- File Operations ---
async function checkFileExists(filePath) {
    try {
        await fs.access(filePath);
        return true;
    } catch (error) {
        return false;
    }
}

async function downloadFile(drive, fileId, fileName, outputPath) {
    const filePath = path.join(outputPath, fileName);
    
    // Check if file already exists
    if (await checkFileExists(filePath)) {
        logger.debug(`⏭️ Já existe: ${fileName}`);
        return { filePath, skipped: true };
    }

    return await withRetry(async () => {
        logger.debug(`Baixando: ${fileName}`);
        
        const response = await drive.files.get(
            { fileId, alt: 'media' },
            { responseType: 'arraybuffer' }
        );

        const buffer = Buffer.from(response.data);
        
        await fs.writeFile(filePath, buffer);
        logger.success(`✓ Baixado: ${fileName}`);
        
        return { filePath, skipped: false };
    });
}

// --- Main Functions ---
async function fetchDriveFiles(drive) {
    logger.info('Buscando arquivos no Google Drive...');
    
    const files = [];
    let pageToken = null;
    const searchQuery = `'${config.GOOGLE_DRIVE_FOLDER_ID}' in parents and (mimeType contains 'image/')`;

    do {
        const response = await withRetry(async () => {
            return await drive.files.list({
                q: searchQuery,
                fields: 'nextPageToken, files(id, name, mimeType, size)',
                pageSize: 1000,
                pageToken: pageToken
            });
        });

        if (response.data.files) {
            const validFiles = response.data.files.filter(file => {
                // Check file type
                if (!config.SUPPORTED_IMAGE_TYPES.includes(file.mimeType)) {
                    logger.debug(`Tipo não suportado: ${file.name}`);
                    return false;
                }
                
                // Check file size
                if (file.size && parseInt(file.size) > config.MAX_FILE_SIZE) {
                    logger.warn(`Arquivo muito grande: ${file.name}`);
                    return false;
                }
                
                return true;
            });
            
            files.push(...validFiles);
        }
        
        pageToken = response.data.nextPageToken;
    } while (pageToken);

    logger.success(`${files.length} arquivos válidos encontrados`);
    return files;
}

async function processInParallel(items, processor, concurrency = config.MAX_CONCURRENT_DOWNLOADS) {
    const results = [];

    for (let i = 0; i < items.length; i += concurrency) {
        const batch = items.slice(i, i + concurrency);
        const batchResults = await Promise.all(
            batch.map(item => processor(item).catch(error => ({ error, item })))
        );
        results.push(...batchResults);
        
        // Small delay between batches
        if (i + concurrency < items.length) {
            await sleep(500);
        }
    }

    return results;
}

async function main() {
    try {
        logger.info('🚀 Iniciando download de imagens do Google Drive...\n');

        // 1. Setup Google Drive
        const drive = await setupGoogleDrive();
        
        // 2. Create output directory directly in downloaded-images root
        const projectRoot = await findProjectRoot();
        const outputDir = path.join(projectRoot, config.OUTPUT_BASE_DIR);
        
        try {
            await fs.mkdir(outputDir, { recursive: true });
            logger.success(`Pasta de destino: ${outputDir}`);
        } catch (error) {
            throw new Error(`Erro ao criar pasta ${outputDir}: ${error.message}`);
        }
        
        // 4. Fetch files from Drive
        const files = await fetchDriveFiles(drive);
        
        if (files.length === 0) {
            logger.warn('Nenhum arquivo encontrado para download');
            return;
        }

        // 5. Download files in parallel
        logger.info(`\n📥 Baixando ${files.length} arquivos...`);
        const startTime = Date.now();
        
        const results = await processInParallel(files, async (file) => {
            return await downloadFile(drive, file.id, file.name, outputDir);
        });

        const endTime = Date.now();
        const totalTime = (endTime - startTime) / 1000;

        // 6. Report results
        const successful = results.filter(r => !r.error);
        const failed = results.filter(r => r.error);
        const downloaded = successful.filter(r => !r.skipped);
        const skipped = successful.filter(r => r.skipped);

        logger.info('\n📊 === RELATÓRIO DE DOWNLOAD ===');
        logger.success(`✅ Novos downloads: ${downloaded.length}`);
        logger.info(`⏭️ Arquivos já existentes: ${skipped.length}`);
        
        if (failed.length > 0) {
            logger.error(`❌ Downloads com falha: ${failed.length}`);
            failed.forEach(item => {
                logger.error(`  - ${item.item.name}: ${item.error.message || item.error}`);
            });
        }

        logger.success(`📁 Pasta de destino: ${outputDir}`);
        logger.success(`⏱️ Tempo total: ${totalTime.toFixed(2)}s`);
        
        if (skipped.length > 0) {
            logger.info(`🔄 Para forçar re-download, delete os arquivos existentes primeiro`);
        }
        
        console.log('\n🎉 Download concluído!');

    } catch (error) {
        logger.error('Erro fatal durante a execução:', error);
        process.exit(1);
    }
}

// Execute if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
    main();
}