#!/usr/bin/env node

// scripts/optimize-images/index.js

/*
 * =============================================================================
 *  PONTO DE ENTRADA ALTERNATIVO - OTIMIZAÇÃO DE IMAGENS
 * =============================================================================
 *
 * Este arquivo facilita a execução do script de otimização de imagens
 * através de diferentes métodos (npm scripts, execução direta, etc.)
 *
 * Uso:
 *   node index.js [--debug]
 *   npm run start
 *   npm run debug
 *
 * =============================================================================
 */

// Importa e executa o script principal
import('./optimize-inventory-images.js')
    .then(() => {
        // Script executado com sucesso
        process.exit(0);
    })
    .catch((error) => {
        console.error('❌ Erro ao executar o script de otimização:', error);
        process.exit(1);
    });