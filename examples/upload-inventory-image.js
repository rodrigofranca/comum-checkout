// examples/upload-inventory-image.js

import PocketBase from 'pocketbase';
import 'dotenv/config';
import { readFile } from 'fs/promises';
import path from 'path';

/**
 * Faz upload de imagens para um item do inventário
 * @param {string} inventoryId - ID do item no inventário
 * @param {string[]} imagePaths - Array com os caminhos das imagens
 * @returns {Promise<Object>} Registro atualizado do inventário
 */
async function uploadInventoryImages(inventoryId, imagePaths) {
    if (!inventoryId) throw new Error('ID do inventário é obrigatório');
    if (!imagePaths?.length) throw new Error('Pelo menos uma imagem é necessária');

    // 1. Inicializa o PocketBase
    const pb = new PocketBase(process.env.POCKETBASE_URL);

    // 2. Autentica como admin
    await pb.admins.authWithPassword(
        process.env.POCKETBASE_ADMIN_EMAIL,
        process.env.POCKETBASE_ADMIN_PASSWORD
    );

    // 3. Prepara o FormData com as imagens
    const formData = new FormData();

    // 4. Adiciona cada imagem ao FormData
    for (const imagePath of imagePaths) {
        try {
            const imageBuffer = await readFile(imagePath);
            const fileName = path.basename(imagePath);
            const imageBlob = new Blob([imageBuffer], {
                type: `image/${path.extname(imagePath).slice(1)}`
            });
            formData.append('images', imageBlob, fileName);
        } catch (error) {
            console.error(`Erro ao ler imagem ${imagePath}:`, error);
            throw error;
        }
    }

    try {
        // 5. Faz o upload e atualiza o registro
        const record = await pb.collection('inventory').update(inventoryId, formData);
        console.log('Upload realizado com sucesso para o item:', record.id);
        console.log('Imagens:', record.images);
        return record;
    } catch (error) {
        console.error('Erro ao fazer upload:', error);
        throw error;
    }
}

// Exemplo de uso:
async function example() {
    try {
        const inventoryId = 'RECORD_ID'; // Substitua pelo ID real do item
        const imagePaths = [
            './imagens/frente.jpg',
            './imagens/costas.jpg',
            './imagens/detalhe.jpg'
        ];

        const updatedRecord = await uploadInventoryImages(inventoryId, imagePaths);
        console.log('Item atualizado com sucesso:', updatedRecord);
    } catch (error) {
        console.error('Erro no exemplo:', error);
    }
}

export { uploadInventoryImages };