// Configuração da API do Google Sheets (usando credenciais do .env)
const SHEETS_CONFIG = {
    sheetsId: '1DIJuHTaSZ_d3nsFxxKec_WCyaPlSDGGNhwk3FyQNt5E', // Do .env
    range: null // Será detectado automaticamente
};

// Função para obter token de acesso usando Service Account
async function getAccessToken() {
    try {
        // Para uso client-side, precisaremos usar a Google Sheets API com API Key
        // ou implementar um endpoint no backend para proxy da autenticação
        const apiKeyInput = document.getElementById('api-key-input');

        if (!apiKeyInput || !apiKeyInput.value.trim()) {
            throw new Error('API Key é necessária para acessar o Google Sheets via browser');
        }

        return apiKeyInput.value.trim();
    } catch (error) {
        console.error('Erro ao obter token de acesso:', error);
        throw error;
    }
}

// Função para obter nomes das abas
async function getSheetNames(apiKey) {
    const url = `https://sheets.googleapis.com/v4/spreadsheets/${SHEETS_CONFIG.sheetsId}?key=${apiKey}`;

    const response = await fetch(url);
    if (!response.ok) {
        throw new Error(`Erro ao obter informações da planilha: ${response.status}`);
    }

    const data = await response.json();
    return data.sheets.map(sheet => sheet.properties.title);
}

// Função para buscar dados do Google Sheets
async function fetchSheetsData() {
    try {
        const apiKey = await getAccessToken();

        // Detecta automaticamente a primeira aba
        console.log('🔍 Detectando abas da planilha...');
        const sheetNames = await getSheetNames(apiKey);
        console.log('📝 Abas encontradas:', sheetNames);

        // Procura especificamente pela aba "products" ou usa a primeira
        let targetSheetName = sheetNames.find(name => name.toLowerCase() === 'products');

        if (!targetSheetName) {
            console.log('⚠️ Aba "products" não encontrada, usando a primeira aba disponível');
            targetSheetName = sheetNames[0];
        }

        const range = `${targetSheetName}!A:Z`;

        console.log(`📋 Usando aba: "${targetSheetName}"`);

        const url = `https://sheets.googleapis.com/v4/spreadsheets/${SHEETS_CONFIG.sheetsId}/values/${encodeURIComponent(range)}?key=${apiKey}`;

        const response = await fetch(url);
        if (!response.ok) {
            if (response.status === 403) {
                throw new Error('API Key inválida ou sem permissões para acessar a planilha');
            } else if (response.status === 404) {
                throw new Error('Planilha não encontrada ou não compartilhada');
            }
            throw new Error(`Erro na API: ${response.status} - ${response.statusText}`);
        }

        const data = await response.json();
        return data.values;
    } catch (error) {
        console.error('Erro ao buscar dados do Google Sheets:', error);
        alert(`Erro ao buscar dados: ${error.message}`);
        return null;
    }
}

// Função para processar dados do Sheets e converter em produtos
function processSheetsData(values) {
    if (!values || values.length < 2) {
        alert('A planilha está vazia ou não possui dados suficientes');
        return [];
    }

    // Primeira linha são os cabeçalhos
    const headers = values[0].map(h => h.toLowerCase().trim());

    // Encontra os índices das colunas necessárias (busca mais flexível)
    const productIdIndex = headers.findIndex(h =>
        h.includes('codigo') || h.includes('product_id') || h.includes('id') || h.includes('sku') ||
        h.includes('code') || h.includes('item') || h.includes('ref') || h.includes('referencia')
    );
    const priceIndex = headers.findIndex(h =>
        h.includes('preco') || h.includes('price') || h.includes('valor') ||
        h.includes('custo') || h.includes('cost') || h.includes('amount') || h.includes('preço')
    );
    const nameIndex = headers.findIndex(h =>
        h.includes('nome') || h.includes('name') || h.includes('produto') ||
        h.includes('product') || h.includes('item') || h.includes('descricao') || h.includes('description')
    );

    console.log(`🔍 Análise de colunas:`);
    console.log(`   Product ID: índice ${productIdIndex} ${productIdIndex >= 0 ? `(${headers[productIdIndex]})` : '❌ NÃO ENCONTRADO'}`);
    console.log(`   Preço: índice ${priceIndex} ${priceIndex >= 0 ? `(${headers[priceIndex]})` : '❌ NÃO ENCONTRADO'}`);
    console.log(`   Nome: índice ${nameIndex} ${nameIndex >= 0 ? `(${headers[nameIndex]})` : '⚠️ opcional'}`);

    if (productIdIndex === -1 || priceIndex === -1) {
        console.log('❌ Cabeçalhos encontrados:', headers);
        console.log('💡 Colunas esperadas: Product ID (codigo/id/sku), Preço (preco/price/valor)');
        alert('Não foi possível encontrar as colunas necessárias (código do produto e preço). Verifique o console para detalhes.');
        return [];
    }

    console.log(`Usando colunas: Product ID (${productIdIndex}), Preço (${priceIndex}), Nome (${nameIndex})`);

    // Processa as linhas de dados
    const products = [];
    for (let i = 1; i < values.length; i++) {
        const row = values[i];

        const productId = row[productIdIndex]?.toString().trim();
        const price = row[priceIndex]?.toString().trim();
        const name = nameIndex !== -1 ? row[nameIndex]?.toString().trim() : productId;

        // Pula linhas vazias ou sem dados essenciais
        if (!productId || !price) continue;

        products.push({
            productId: productId,
            price: price,
            name: name || productId
        });
    }

    return products;
}

// Função reutilizável para gerar etiquetas
function generateLabels(products) {
    const labelsContainer = document.getElementById('labels-container');

    products.forEach(product => {
        const label = document.createElement('div');
        label.className = 'label';

        // Container para QR Code (primeiro, no topo)
        const qrCodeContainer = document.createElement('div');
        qrCodeContainer.className = 'qr-code';

        // Gera o QR Code com o product-id
        try {
            const qr = qrcode(0, 'L');
            qr.addData(product.productId);
            qr.make();
            qrCodeContainer.innerHTML = qr.createImgTag(4);
        } catch (e) {
            console.error("Erro ao gerar QR Code para:", product.productId, e);
            qrCodeContainer.textContent = 'Erro no QR Code';
        }

        // Nome do produto (ou ID se não houver nome)
        const name = document.createElement('div');
        name.className = 'product-name';
        name.textContent = product.name;

        // Preço
        const price = document.createElement('div');
        price.className = 'price';
        // Remove decimais .00 do preço
        price.textContent = product.price.replace(',00', '').replace('.00', '');

        // Product ID
        const productIdDiv = document.createElement('div');
        productIdDiv.className = 'product-id';
        productIdDiv.textContent = product.productId;

        label.appendChild(qrCodeContainer);
        label.appendChild(price);
        label.appendChild(productIdDiv);
        label.appendChild(name);
        labelsContainer.appendChild(label);
    });
}

// Função para carregar dados do arquivo JSON local
async function loadLocalData() {
    try {
        const response = await fetch('./json/products-data.json');
        if (!response.ok) {
            throw new Error('Arquivo json/products-data.json não encontrado. Execute "node generate-from-sheets.js" primeiro.');
        }

        const products = await response.json();
        return products;
    } catch (error) {
        console.error('Erro ao carregar dados locais:', error);
        throw error;
    }
}

// Event listener para carregar dados locais
document.getElementById('load-local-btn').addEventListener('click', async () => {
    const labelsContainer = document.getElementById('labels-container');

    // Limpa as etiquetas existentes
    labelsContainer.innerHTML = '';

    // Mostra loading
    labelsContainer.innerHTML = '<div style="text-align: center; padding: 20px;">Carregando dados locais...</div>';

    try {
        const products = await loadLocalData();

        if (products.length === 0) {
            labelsContainer.innerHTML = '<div style="text-align: center; padding: 20px;">Nenhum produto encontrado nos dados locais.</div>';
            return;
        }

        // Limpa o loading
        labelsContainer.innerHTML = '';

        // Gera as etiquetas
        generateLabels(products);

        console.log(`${products.length} etiquetas geradas dos dados locais!`);

    } catch (error) {
        console.error('Erro ao processar dados locais:', error);
        labelsContainer.innerHTML = `<div style="text-align: center; padding: 20px; color: red;">Erro: ${error.message}</div>`;
    }
});

// Event listener para o botão de gerar etiquetas do Sheets
document.getElementById('generate-from-sheets-btn').addEventListener('click', async () => {
    const labelsContainer = document.getElementById('labels-container');

    // Limpa as etiquetas existentes
    labelsContainer.innerHTML = '';

    // Mostra loading
    labelsContainer.innerHTML = '<div style="text-align: center; padding: 20px;">Buscando dados do Google Sheets...</div>';

    try {
        // Busca dados do Google Sheets
        const sheetsData = await fetchSheetsData();
        if (!sheetsData) return;

        // Processa os dados
        const products = processSheetsData(sheetsData);

        if (products.length === 0) {
            labelsContainer.innerHTML = '<div style="text-align: center; padding: 20px;">Nenhum produto encontrado na planilha.</div>';
            return;
        }

        // Limpa o loading
        labelsContainer.innerHTML = '';

        // Gera as etiquetas
        generateLabels(products);

        console.log(`${products.length} etiquetas geradas com sucesso!`);

    } catch (error) {
        console.error('Erro ao processar:', error);
        labelsContainer.innerHTML = `<div style="text-align: center; padding: 20px; color: red;">Erro: ${error.message}</div>`;
    }
});

// Event listener original para JSON (mantido para compatibilidade)
document.getElementById('generate-btn').addEventListener('click', () => {
    const jsonInput = document.getElementById('json-input').value;
    const labelsContainer = document.getElementById('labels-container');

    // Limpa as etiquetas existentes
    labelsContainer.innerHTML = '';

    let products;
    try {
        products = JSON.parse(jsonInput);
        if (!Array.isArray(products)) {
            throw new Error("O JSON precisa ser um array de produtos.");
        }
    } catch (error) {
        alert(`Erro no JSON: ${error.message}`);
        return;
    }

    products.forEach(product => {
        if (!product.name || !product.price || !product.url) {
            console.warn("Produto ignorado por não conter 'name', 'price' ou 'url':", product);
            return;
        }

        const label = document.createElement('div');
        label.className = 'label';

        const qrCodeContainer = document.createElement('div');
        qrCodeContainer.className = 'qr-code';

        // Gera o QR Code apenas com product_id para usar no checkout
        try {
            const qr = qrcode(0, 'L');
            // Usa product_id se disponível, senão extrai da URL
            const productId = product.product_id || product.url.split('=').pop();
            qr.addData(productId);
            qr.make();
            qrCodeContainer.innerHTML = qr.createImgTag(4);
        } catch (e) {
            console.error("Erro ao gerar QR Code:", e);
            qrCodeContainer.textContent = 'Erro no QR Code';
        }

        const name = document.createElement('div');
        name.className = 'product-name';
        name.textContent = product.name;

        const price = document.createElement('div');
        price.className = 'price';
        // Remove decimais .00 do preço
        price.textContent = product.price.replace(',00', '').replace('.00', '');

        label.appendChild(qrCodeContainer);
        label.appendChild(price);
        label.appendChild(name);
        labelsContainer.appendChild(label);
    });
});