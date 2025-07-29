// scripts/populate-tags.js

/*
 * =============================================================================
 *  INSTRUÇÕES PARA EXECUTAR ESTE SCRIPT
 * =============================================================================
 *
 * 1. INSTALE AS DEPENDÊNCIAS:
 *    No seu terminal, na raiz do projeto, execute:
 *    npm install pocketbase dotenv
 *
 * 2. CRIE O ARQUIVO .env:
 *    Na raiz do projeto, crie um arquivo chamado `.env`
 *
 * 3. ADICIONE AS CREDENCIAIS AO .env:
 *    Abra o arquivo .env e adicione as seguintes linhas, substituindo
 *    com os seus dados reais:
 *
 *    POCKETBASE_URL="http://127.0.0.1:8090"
 *    POCKETBASE_ADMIN_EMAIL="seu-email@admin.com"
 *    POCKETBASE_ADMIN_PASSWORD="sua-senha-admin"
 *
 * 4. RODE O SCRIPT:
 *    No seu terminal, execute:
 *    node scripts/populate-tags.js
 *
 * =============================================================================
 */

import PocketBase from 'pocketbase';
import 'dotenv/config';

// --- DADOS A SEREM INSERIDOS ---
const tagsToCreate = [
    'perfeito estado',
    'vintage',
    'com defeito',
    'cgc',
    'algodão',
    'plus size',
    'anos 60',
    'anos 70',
    'anos 80',
    'anos 90',
    'anos 2000',
    'bordado',
    '2000 é o novo vintage',
    'social',
    'casual',
    'xadrez',
    'floral',
    'colorida',
    'ondas',
    'geométrica',
    'algodão egípcio',
    'abstrata',
    'tie-dye',
    'listrada',
    'paisley'
];

// --- FUNÇÃO PARA GERAR SLUGS ---
function slugify(text) {
    return text
        .toString()
        .toLowerCase()
        .normalize('NFD') // Normaliza para decompor acentos
        .replace(/[\u0300-\u036f]/g, '') // Remove os diacríticos
        .replace(/\s+/g, '-') // Substitui espaços por -
        .replace(/[^\w\-]+/g, '') // Remove caracteres não-alfanuméricos (exceto -)
        .replace(/\-\-+/g, '-') // Substitui múltiplos - por um único -
        .replace(/^-+/, '') // Remove - do início
        .replace(/-+$/, ''); // Remove - do fim
}

// --- FUNÇÃO PRINCIPAL ---
async function main() {
    console.log('Iniciando script para popular tags...');

    // 1. Validação das variáveis de ambiente
    const { POCKETBASE_URL, POCKETBASE_ADMIN_EMAIL, POCKETBASE_ADMIN_PASSWORD } = process.env;
    if (!POCKETBASE_URL || !POCKETBASE_ADMIN_EMAIL || !POCKETBASE_ADMIN_PASSWORD) {
        console.error('ERRO: As variáveis de ambiente POCKETBASE_URL, POCKETBASE_ADMIN_EMAIL e POCKETBASE_ADMIN_PASSWORD devem estar definidas no arquivo .env.');
        console.error('Por favor, siga as instruções no topo do arquivo do script.');
        process.exit(1);
    }

    try {
        // 2. Conectar e autenticar no PocketBase
        const pb = new PocketBase(POCKETBASE_URL);
        await pb.admins.authWithPassword(POCKETBASE_ADMIN_EMAIL, POCKETBASE_ADMIN_PASSWORD);
        console.log('Autenticação com o PocketBase bem-sucedida.');

        // 3. Verificar/Criar a coleção 'tags'
        let tagsCollection;
        try {
            tagsCollection = await pb.collections.getFirstListItem('name="tags"');
            console.log('Coleção "tags" já existe.');
        } catch (error) {
            if (error.status === 404) {
                console.log('Coleção "tags" não encontrada. Criando...');
                const schema = [
                    { name: 'name', type: 'text', required: true, unique: true },
                    { name: 'slug', type: 'text', required: true, unique: true },
                ];
                tagsCollection = await pb.collections.create({
                    name: 'tags',
                    type: 'base',
                    schema: schema,
                });
                console.log('Coleção "tags" criada com sucesso.');
            } else {
                throw error; // Propaga outros erros
            }
        }

        // 4. Inserir cada tag de forma idempotente
        console.log(`\nVerificando e inserindo ${tagsToCreate.length} tags...`);
        for (const tagName of tagsToCreate) {
            const tagSlug = slugify(tagName);
            try {
                // VERIFICA PRIMEIRO: Tenta encontrar uma tag com o mesmo slug.
                await pb.collection('tags').getFirstListItem(`slug = "${tagSlug}"`);
                // Se a linha acima NÃO der erro, a tag já existe.
                console.log(`  [~] Já existe: "${tagName}" (slug: ${tagSlug})`);

            } catch (error) {
                // Se o erro for 404, significa que a tag NÃO foi encontrada.
                if (error.status === 404) {
                    try {
                        // CRIA A TAG: Como ela não existe, podemos criar.
                        await pb.collection('tags').create({
                            name: tagName,
                            slug: tagSlug,
                        });
                        console.log(`  [+] Criada: "${tagName}" (slug: ${tagSlug})`);
                    } catch (createError) {
                        // Caso ocorra um erro na criação por outro motivo.
                        console.error(`  [!] Erro ao CRIAR "${tagName}":`, createError.data || createError.message);
                    }
                } else {
                    // Se for qualquer outro erro durante a VERIFICAÇÃO.
                    console.error(`  [!] Erro ao VERIFICAR "${tagName}":`, error.data || error.message);
                }
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