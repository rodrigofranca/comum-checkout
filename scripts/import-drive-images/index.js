#!/usr/bin/env node

/**
 * Ponto de entrada para o script de importação de imagens do Google Drive
 *
 * Este arquivo serve como uma interface amigável para executar o script
 * diretamente da pasta import-drive-images
 */

import { spawn } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Caminho para o script principal
const scriptPath = path.join(__dirname, 'import-drive-images.js');

// Repassa todos os argumentos para o script principal
const args = process.argv.slice(2);

// Executa o script principal
const child = spawn('node', [scriptPath, ...args], {
    stdio: 'inherit',
    cwd: process.cwd()
});

// Gerencia o processo filho
child.on('error', (error) => {
    console.error('Erro ao executar o script:', error);
    process.exit(1);
});

child.on('exit', (code) => {
    process.exit(code);
});

// Permite encerrar o processo com Ctrl+C
process.on('SIGINT', () => {
    child.kill('SIGINT');
});

process.on('SIGTERM', () => {
    child.kill('SIGTERM');
});