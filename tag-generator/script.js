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
            return; // Pula para o próximo item
        }

        const label = document.createElement('div');
        label.className = 'label';

        const name = document.createElement('div');
        name.className = 'product-name';
        name.textContent = product.name;

        const price = document.createElement('div');
        price.className = 'price';
        price.textContent = product.price;

        const qrCodeContainer = document.createElement('div');
        qrCodeContainer.className = 'qr-code';

        // Gera o QR Code
        try {
            const qr = qrcode(0, 'L'); // type 0 (auto), error correction level 'L'
            qr.addData(product.url);
            qr.make();
            qrCodeContainer.innerHTML = qr.createImgTag(4); // 4 = module size
        } catch (e) {
            console.error("Erro ao gerar QR Code para:", product.url, e);
            qrCodeContainer.textContent = 'Erro no QR Code';
        }


        label.appendChild(name);
        label.appendChild(price);
        label.appendChild(qrCodeContainer);
        labelsContainer.appendChild(label);
    });
});