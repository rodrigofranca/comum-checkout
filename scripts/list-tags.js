// scripts/list-tags.js

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
 *    node scripts/list-tags.js
 *
 * =============================================================================
 */

import PocketBase from 'pocketbase';
import 'dotenv/config';

// --- FUNÇÃO PRINCIPAL ---
async function main() {
    console.log('Iniciando script para listar tags...');

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

        // 3. Buscar todos os registros da coleção 'tags'
        const tags = await pb.collection('tags').getFullList({
            sort: 'name', // Ordenar por nome para facilitar a visualização
        });

        if (tags.length === 0) {
            console.log('Nenhuma tag encontrada na coleção "tags".');
        } else {
            console.log(`--- LISTA DE TAGS (${tags.length} registros) ---`);
            console.table(tags.map(tag => ({
                id: tag.id,
                name: tag.name,
                slug: tag.slug,
                created: tag.created,
            })));
            console.log('------------------------------------');
        }

        console.log('\nScript finalizado com sucesso!');

    } catch (error) {
        console.error('\n--- ERRO GERAL ---');
        if (error.status === 404) {
             console.error('A coleção "tags" não foi encontrada no banco de dados.');
        } else {
            console.error('Ocorreu um erro durante a execução do script:');
            console.error(error.originalError || error.message || error);
        }
        console.error('------------------');
        process.exit(1);
    }
}

main();
