#!/usr/bin/env node

// Script Node.js para gerar dados do Google Sheets usando Service Account
// Uso: node generate-from-sheets.js

import { google } from 'googleapis';
import { promises as fs } from 'fs';
import path from 'path';
import 'dotenv/config';

// Configuração
const config = {
    GOOGLE_SHEETS_ID: process.env.GOOGLE_SHEETS_ID || '1DIJuHTaSZ_d3nsFxxKec_WCyaPlSDGGNhwk3FyQNt5E',
    GOOGLE_CREDENTIALS_PATH: process.env.GOOGLE_CREDENTIALS_PATH || 'acervo-comum-f29f7e0e86c5.json',
    SHEETS_RANGE: 'A:AN'
};

async function findProjectRoot() {
    let currentDir = process.cwd();

    const projectRootIndicators = ['.env', '.git', 'package.json'];

    while (currentDir !== '/') {
        for (const indicator of projectRootIndicators) {
            try {
                await fs.access(path.join(currentDir, indicator));
                return currentDir;
            } catch (error) {
                // Continua procurando
            }
        }

        const parentDir = path.dirname(currentDir);
        if (parentDir === currentDir) break;
        currentDir = parentDir;
    }

    return process.cwd();
}

async function setupGoogleSheets() {
    const projectRoot = await findProjectRoot();
    const credentialsPath = path.join(projectRoot, config.GOOGLE_CREDENTIALS_PATH);

    try {
        await fs.access(credentialsPath);
    } catch (error) {
        throw new Error(`Arquivo de credenciais não encontrado: ${credentialsPath}`);
    }

    const auth = new google.auth.GoogleAuth({
        keyFile: credentialsPath,
        scopes: ['https://www.googleapis.com/auth/spreadsheets.readonly']
    });

    const sheets = google.sheets({ version: 'v4', auth });
    return sheets;
}

async function getSheetNames(sheets) {
    try {
        const response = await sheets.spreadsheets.get({
            spreadsheetId: config.GOOGLE_SHEETS_ID,
        });

        const sheetNames = response.data.sheets.map(sheet => sheet.properties.title);
        return sheetNames;
    } catch (error) {
        console.error('❌ Erro ao obter nomes das abas:', error.message);
        throw error;
    }
}

async function fetchSheetsData() {
    try {
        console.log('📊 Conectando ao Google Sheets...');
        const sheets = await setupGoogleSheets();

        console.log('🔍 Detectando abas da planilha...');
        const sheetNames = await getSheetNames(sheets);
        console.log(`📝 Abas encontradas: ${sheetNames.join(', ')}`);

        // Procura especificamente pela aba "products" ou usa a primeira
        let targetSheetName = sheetNames.find(name => name.toLowerCase() === 'products');

        if (!targetSheetName) {
            console.log('⚠️ Aba "products" não encontrada, usando a primeira aba disponível');
            targetSheetName = sheetNames[0];
        }

        const range = `${targetSheetName}!${config.SHEETS_RANGE}`;

        console.log(`📋 Buscando dados da aba "${targetSheetName}": ${config.GOOGLE_SHEETS_ID}`);
        const response = await sheets.spreadsheets.values.get({
            spreadsheetId: config.GOOGLE_SHEETS_ID,
            range: range,
        });

        return response.data.values;
    } catch (error) {
        console.error('❌ Erro ao buscar dados do Google Sheets:', error.message);
        throw error;
    }
}

function processSheetsData(values) {
    if (!values || values.length < 2) {
        throw new Error('A planilha está vazia ou não possui dados suficientes');
    }

    // Primeira linha são os cabeçalhos
    const headers = values[0].map(h => h.toLowerCase().trim());
    console.log('📝 Cabeçalhos encontrados:', headers);

    // Encontra os índices das colunas necessárias
    const productIdIndex = headers.findIndex(h => h === 'product_id');
    const priceIndex = headers.findIndex(h => h === 'preco');
    const nameIndex = headers.findIndex(h => h === 'nome');
    const eventoIndex = headers.findIndex(h => h === 'evento');

    console.log(`🔍 Análise de colunas:`);
    console.log(`   Product ID: índice ${productIdIndex} ${productIdIndex >= 0 ? `(${headers[productIdIndex]})` : '❌ NÃO ENCONTRADO'}`);
    console.log(`   Preço: índice ${priceIndex} ${priceIndex >= 0 ? `(${headers[priceIndex]})` : '❌ NÃO ENCONTRADO'}`);
    console.log(`   Nome: índice ${nameIndex} ${nameIndex >= 0 ? `(${headers[nameIndex]})` : '⚠️ opcional'}`);
    console.log(`   Evento: índice ${eventoIndex} ${eventoIndex >= 0 ? `(${headers[eventoIndex]})` : '❌ NÃO ENCONTRADO'}`);

    if (productIdIndex === -1) {
        console.log('\n❌ Cabeçalhos encontrados:', headers);
        console.log('\n💡 Coluna "product_id" não encontrada!');
        throw new Error('Coluna "product_id" é obrigatória');
    }

    if (priceIndex === -1) {
        console.log('\n❌ Cabeçalhos encontrados:', headers);
        console.log('\n💡 Coluna "preco" não encontrada!');
        throw new Error('Coluna "preco" é obrigatória');
    }

    if (eventoIndex === -1) {
        console.log('\n⚠️ Coluna "evento" não encontrada - processando todos os produtos');
    }

    console.log(`🔍 Usando colunas: Product ID (${productIdIndex}), Preço (${priceIndex}), Nome (${nameIndex})`);

    // Processa as linhas de dados
    const products = [];
    let totalRows = 0;
    let eventoTrueRows = 0;
    let validProducts = 0;

    for (let i = 1; i < values.length; i++) {
        const row = values[i];
        totalRows++;

        const productId = row[productIdIndex]?.toString().trim();
        const price = row[priceIndex];
        const name = nameIndex !== -1 ? row[nameIndex]?.toString().trim() : productId;
        const evento = eventoIndex !== -1 ? row[eventoIndex]?.toString().toLowerCase().trim() : null;

        // Pula linhas vazias ou sem product_id
        if (!productId) continue;

        // Se existe coluna "evento", filtra apenas onde evento=true
        if (eventoIndex !== -1) {
            const isEvento = evento === 'true' || evento === '1' || evento === 'sim' || evento === 'yes';
            if (!isEvento) {
                continue; // Pula produtos que não são para evento
            }
            eventoTrueRows++;
        }

        // Verifica se tem preço
        if (!price || price === '' || price === '0') {
            console.log(`⚠️ Produto ${productId} sem preço, pulando...`);
            continue;
        }

        validProducts++;
        products.push({
            productId: productId,
            price: price.toString().trim(),
            name: name || productId
        });
    }

    console.log(`📊 Estatísticas:`);
    console.log(`   Total de linhas: ${totalRows}`);
    if (eventoIndex !== -1) {
        console.log(`   Produtos com evento=true: ${eventoTrueRows}`);
    }
    console.log(`   Produtos válidos com preço: ${validProducts}`);

    return products;
}

async function main() {
    try {
        console.log('🏁 Iniciando geração de dados para etiquetas...\n');

        // Mostra informações para troubleshooting
        console.log('🔧 Informações de Debug:');
        console.log(`📧 Service Account: import-image@acervo-comum.iam.gserviceaccount.com`);
        console.log(`📋 Planilha ID: ${config.GOOGLE_SHEETS_ID}`);
        console.log(`🔗 URL da Planilha: https://docs.google.com/spreadsheets/d/${config.GOOGLE_SHEETS_ID}/edit`);
        console.log('');

        console.log('💡 Se houver erro de permissão:');
        console.log('1. Abra a planilha no link acima');
        console.log('2. Clique em "Compartilhar"');
        console.log('3. Adicione: import-image@acervo-comum.iam.gserviceaccount.com');
        console.log('4. Defina como "Visualizador"');
        console.log('');

        // Busca dados do Google Sheets
        const sheetsData = await fetchSheetsData();

        // Processa os dados
        console.log('⚙️ Processando dados...');
        const products = processSheetsData(sheetsData);

        if (products.length === 0) {
            console.log('⚠️ Nenhum produto encontrado na planilha.');
            return;
        }

        // Salva os dados em JSON para uso no frontend
        const outputPath = path.join(process.cwd(), 'json', 'products-data.json');
        await fs.writeFile(outputPath, JSON.stringify(products, null, 2));

        console.log(`✅ ${products.length} produtos processados com sucesso!`);
        console.log(`📄 Dados salvos em: ${outputPath}`);

        // Mostra alguns exemplos
        console.log('\n📋 Primeiros 5 produtos:');
        products.slice(0, 5).forEach((product, index) => {
            console.log(`${index + 1}. ${product.name} - ${product.price} (ID: ${product.productId})`);
        });

        console.log('\n💡 Use o arquivo products-data.json no gerador de etiquetas web');

    } catch (error) {
        console.error('❌ Erro:', error.message);
        process.exit(1);
    }
}

// Executa o script se for chamado diretamente
if (import.meta.url === `file://${process.argv[1]}`) {
    main();
}