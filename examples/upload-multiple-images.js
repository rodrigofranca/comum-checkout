// examples/upload-multiple-images.js

import PocketBase from 'pocketbase';
import 'dotenv/config';

/**
 * Faz upload de múltiplas imagens para um registro do PocketBase
 * @param {string} collectionName - Nome da coleção
 * @param {string} recordId - ID do registro
 * @param {File[]|Blob[]} imageFiles - Array de arquivos de imagem
 * @returns {Promise<Object>} Registro atualizado
 */
async function uploadMultipleImages(collectionName, recordId, imageFiles) {
    // 1. Inicializa o cliente do PocketBase
    const pb = new PocketBase(process.env.POCKETBASE_URL);

    // 2. Autentica como admin (necessário para uploads)
    await pb.admins.authWithPassword(
        process.env.POCKETBASE_ADMIN_EMAIL,
        process.env.POCKETBASE_ADMIN_PASSWORD
    );

    // 3. Cria o FormData com as imagens
    const formData = new FormData();

    // Adiciona cada imagem ao mesmo campo 'images'
    imageFiles.forEach((file, index) => {
        formData.append('images', file, `imagem${index + 1}.jpg`);
    });

    try {
        // 4. Faz o upload e atualiza o registro
        const record = await pb.collection(collectionName).update(recordId, formData);
        console.log('Upload realizado com sucesso:', record);
        return record;
    } catch (error) {
        console.error('Erro ao fazer upload:', error);
        throw error;
    }
}

// Exemplo de uso no frontend (React/Vue/etc):
/*
function handleMultipleFileUpload(event) {
    const files = Array.from(event.target.files); // Converte FileList para Array
    if (files.length > 0) {
        uploadMultipleImages('inventory', 'RECORD_ID', files)
            .then(record => console.log('Imagens enviadas:', record))
            .catch(error => console.error('Erro:', error));
    }
}

<input
    type="file"
    accept="image/*"
    multiple // Permite seleção múltipla
    onChange={handleMultipleFileUpload}
/>
*/

// Exemplo de uso no Node.js com arquivos locais:
/*
import { readFile } from 'fs/promises';

async function uploadLocalImages() {
    try {
        // Lista de caminhos das imagens
        const imagePaths = ['./imagem1.jpg', './imagem2.jpg'];

        // Lê todas as imagens e converte para Blobs
        const imageFiles = await Promise.all(
            imagePaths.map(async (path) => {
                const buffer = await readFile(path);
                return new Blob([buffer], { type: 'image/jpeg' });
            })
        );

        // Faz o upload
        const record = await uploadMultipleImages('inventory', 'RECORD_ID', imageFiles);
        console.log('Upload concluído:', record);
    } catch (error) {
        console.error('Erro:', error);
    }
}
*/

// Exemplo específico para o inventário:
async function uploadInventoryImages(inventoryId, imageFiles) {
    if (!imageFiles?.length) {
        throw new Error('Pelo menos uma imagem é necessária');
    }

    return uploadMultipleImages('inventory', inventoryId, imageFiles);
}

export { uploadMultipleImages, uploadInventoryImages };