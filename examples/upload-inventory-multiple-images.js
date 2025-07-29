// examples/upload-inventory-multiple-images.js

import PocketBase from 'pocketbase';
import 'dotenv/config';
import sharp from 'sharp'; // Para otimização de imagens

/**
 * Otimiza uma imagem para upload
 * @param {Buffer} imageBuffer - Buffer da imagem original
 * @returns {Promise<Buffer>} Buffer da imagem otimizada
 */
async function optimizeImage(imageBuffer) {
    return sharp(imageBuffer)
        .resize(1200, 1200, { // Tamanho máximo
            fit: 'inside',
            withoutEnlargement: true
        })
        .jpeg({ // Converte para JPEG com qualidade otimizada
            quality: 80,
            progressive: true
        })
        .toBuffer();
}

/**
 * Faz upload de múltiplas imagens para um item do inventário
 * @param {string} inventoryId - ID do item no inventário
 * @param {File[]|Blob[]} imageFiles - Array de arquivos de imagem
 * @returns {Promise<Object>} Registro atualizado do inventário
 */
async function uploadInventoryImages(inventoryId, imageFiles) {
    // Validações
    if (!inventoryId) {
        throw new Error('ID do inventário é obrigatório');
    }
    if (!imageFiles?.length) {
        throw new Error('Pelo menos uma imagem é necessária');
    }
    if (imageFiles.length > 10) { // Limite máximo de imagens
        throw new Error('Máximo de 10 imagens permitido');
    }

    // 1. Inicializa o PocketBase
    const pb = new PocketBase(process.env.POCKETBASE_URL);

    // 2. Autentica como admin
    await pb.admins.authWithPassword(
        process.env.POCKETBASE_ADMIN_EMAIL,
        process.env.POCKETBASE_ADMIN_PASSWORD
    );

    // 3. Prepara o FormData
    const formData = new FormData();

    // 4. Processa e adiciona cada imagem
    for (let i = 0; i < imageFiles.length; i++) {
        const file = imageFiles[i];

        // Validação do tipo de arquivo
        if (!file.type.startsWith('image/')) {
            throw new Error(`Arquivo ${i + 1} não é uma imagem válida`);
        }

        try {
            // Converte File/Blob para Buffer para otimização
            const buffer = Buffer.from(await file.arrayBuffer());

            // Otimiza a imagem
            const optimizedBuffer = await optimizeImage(buffer);

            // Cria um novo Blob com a imagem otimizada
            const optimizedBlob = new Blob([optimizedBuffer], { type: 'image/jpeg' });

            // Adiciona ao FormData com nome único
            formData.append('images', optimizedBlob, `item_${inventoryId}_${i + 1}.jpg`);

        } catch (error) {
            console.error(`Erro ao processar imagem ${i + 1}:`, error);
            throw new Error(`Falha ao processar imagem ${i + 1}: ${error.message}`);
        }
    }

    try {
        // 5. Faz o upload e atualiza o registro
        const record = await pb.collection('inventory').update(inventoryId, formData);

        console.log('Upload realizado com sucesso!');
        console.log('ID do item:', record.id);
        console.log('Número de imagens:', record.images.length);

        return record;
    } catch (error) {
        console.error('Erro ao fazer upload:', error);
        throw new Error(`Falha no upload: ${error.message}`);
    }
}

// Exemplo de uso no frontend:
/*
async function handleInventoryImageUpload(event, inventoryId) {
    try {
        const files = Array.from(event.target.files);
        const record = await uploadInventoryImages(inventoryId, files);
        console.log('Imagens enviadas com sucesso:', record);
    } catch (error) {
        console.error('Erro no upload:', error);
        // Aqui você pode mostrar uma mensagem de erro para o usuário
    }
}

<input
    type="file"
    accept="image/jpeg,image/png,image/webp"
    multiple
    onChange={(e) => handleInventoryImageUpload(e, 'ID_DO_ITEM')}
/>
*/

export { uploadInventoryImages };