// scripts/clean-inventory-images.js

/*
 * =============================================================================
 *  INSTRUÇÕES PARA EXECUTAR ESTE SCRIPT
 * =============================================================================
 *
 * 1. CERTIFIQUE-SE QUE AS DEPENDÊNCIAS ESTÃO INSTALADAS:
 *    npm install pocketbase dotenv
 *
 * 2. CERTIFIQUE-SE QUE O ARQUIVO .env ESTÁ CONFIGURADO.
 *
 * 3. RODE O SCRIPT:
 *    No seu terminal, execute:
 *    node scripts/clean-inventory-images.js
 *
 * =============================================================================
 */

import PocketBase from 'pocketbase';
import 'dotenv/config';

// --- FUNÇÃO PRINCIPAL ---
async function main() {
    console.log('Iniciando script para limpar imagens do inventário...');

    // 1. Validação das variáveis de ambiente
    const { POCKETBASE_URL, POCKETBASE_ADMIN_EMAIL, POCKETBASE_ADMIN_PASSWORD } = process.env;
    if (!POCKETBASE_URL || !POCKETBASE_ADMIN_EMAIL || !POCKETBASE_ADMIN_PASSWORD) {
        console.error('ERRO: As variáveis de ambiente POCKETBASE_URL, POCKETBASE_ADMIN_EMAIL e POCKETBASE_ADMIN_PASSWORD devem estar definidas no arquivo .env.');
        process.exit(1);
    }

    try {
        // 2. Conectar e autenticar no PocketBase
        const pb = new PocketBase(POCKETBASE_URL);
        await pb.admins.authWithPassword(POCKETBASE_ADMIN_EMAIL, POCKETBASE_ADMIN_PASSWORD);
        console.log('Autenticação com o PocketBase bem-sucedida.\n');

        // 3. Buscar registros com imagens
        const records = await pb.collection('inventory').getFullList({
            filter: 'images != ""'
        });

        if (records.length === 0) {
            console.log('Nenhum registro com imagens encontrado.');
            return;
        }

        console.log(`Encontrados ${records.length} registros com imagens.`);

        // 4. Limpar imagens de cada registro
        for (const record of records) {
            try {
                await pb.collection('inventory').update(record.id, {
                    images: []
                });
                console.log(`✓ Limpadas imagens do registro ${record.id} (${record.title})`);
            } catch (error) {
                console.error(`✗ Erro ao limpar imagens do registro ${record.id}:`, error.message);
            }
        }

        console.log('\nScript finalizado com sucesso!');

    } catch (error) {
        console.error('\n--- ERRO GERAL ---');
        console.error('Ocorreu um erro durante a execução do script:');
        console.error(error.originalError || error.message || error);
        console.error('------------------');
        process.exit(1);
    }
}

main();