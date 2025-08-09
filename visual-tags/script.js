// Configuração
const CONFIG = {
    // Caminho para as imagens otimizadas (ajuste conforme necessário)
    imagesPath: './images/',
    // Caminho para os dados dos produtos
    productsPath: './products-data.json'
};

// Estado da aplicação
let products = [];

// Função para carregar dados dos produtos
async function loadProducts() {
    try {
        const response = await fetch(CONFIG.productsPath);
        if (!response.ok) {
            throw new Error(`Erro ao carregar produtos: ${response.status}`);
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Erro ao carregar produtos:', error);
        throw error;
    }
}

// Função para tentar carregar a imagem do produto
function getImagePath(productId) {
    // Estrutura: images/product-id/product-id-md.jpg
    // Prioriza a imagem principal (sem sufixo) depois tenta variações
    const imageVariations = [
        `${productId}-md.jpg`,           // Imagem principal
        `${productId}.1-md.jpg`,         // Variação 1
        `${productId}_1-md.jpg`,         // Variação 2
        `${productId}.1-md.jpg`          // Outra variação
    ];

    // Retorna o caminho da primeira imagem (principal)
    return `${CONFIG.imagesPath}${productId}/${imageVariations[0]}`;
}

// Função para criar elemento de etiqueta
function createLabel(product) {
    const label = document.createElement('div');
    label.className = 'label';

    // Container para imagem
    const imageContainer = document.createElement('div');
    imageContainer.className = 'product-image';

    // Tenta carregar a imagem
    const img = document.createElement('img');
    const imagePath = getImagePath(product.productId);

    img.src = imagePath;
    img.alt = product.name;

    // Se a imagem não carregar, tenta variações ou mostra placeholder
    img.onerror = () => {
        // Tenta outras variações da imagem
        const variations = [
            `${product.productId}.1-md.jpg`,
            `${product.productId}_1-md.jpg`,
            `${product.productId}_antes-md.jpg`
        ];

        let currentIndex = 0;
        const tryNextVariation = () => {
            if (currentIndex < variations.length) {
                const newImg = document.createElement('img');
                newImg.src = `${CONFIG.imagesPath}${product.productId}/${variations[currentIndex]}`;
                newImg.alt = product.name;

                newImg.onload = () => {
                    imageContainer.appendChild(newImg);
                };

                newImg.onerror = () => {
                    currentIndex++;
                    tryNextVariation();
                };

                currentIndex++;
            } else {
                // Se nenhuma imagem funcionar, mostra placeholder
                imageContainer.innerHTML = 'Sem imagem';
                imageContainer.classList.add('no-image');
            }
        };

        tryNextVariation();
    };

    img.onload = () => {
        imageContainer.appendChild(img);
    };

    // Nome do produto
    const name = document.createElement('div');
    name.className = 'product-name';
    name.textContent = product.name;

    // Preço (remove decimais .00)
    const price = document.createElement('div');
    price.className = 'price';
    price.textContent = product.price.replace(',00', '').replace('.00', '');

    // Product ID
    const productIdDiv = document.createElement('div');
    productIdDiv.className = 'product-id';
    productIdDiv.textContent = product.productId;

    // Montagem da etiqueta
    label.appendChild(imageContainer);
    label.appendChild(productIdDiv);
    label.appendChild(price);
    label.appendChild(name);

    return label;
}

// Função para renderizar todas as etiquetas
function renderLabels(products) {
    const container = document.getElementById('labels-container');
    container.innerHTML = '';

    if (products.length === 0) {
        container.innerHTML = '<div class="error">Nenhum produto encontrado.</div>';
        return;
    }

    products.forEach(product => {
        const label = createLabel(product);
        container.appendChild(label);
    });

}

// Função para mostrar loading
function showLoading() {
    const container = document.getElementById('labels-container');
    container.innerHTML = '<div class="loading">Carregando produtos...</div>';
}

// Função para mostrar erro
function showError(message) {
    const container = document.getElementById('labels-container');
    container.innerHTML = `<div class="error">Erro: ${message}</div>`;
}

// Event listeners
document.addEventListener('DOMContentLoaded', () => {
    const loadBtn = document.getElementById('load-products');
    // const printBtn = document.getElementById('print-labels');

    loadBtn.addEventListener('click', async () => {
        showLoading();

        try {
            products = await loadProducts();
            renderLabels(products);
            console.log(`${products.length} produtos carregados`);
        } catch (error) {
            showError(error.message);
        }
    });

    // printBtn.addEventListener('click', () => {
    //     window.print();
    // });
});

// Auto-load se houver produtos em cache ou parâmetro na URL
window.addEventListener('load', () => {
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('autoload') === 'true') {
        document.getElementById('load-products').click();
    }
});