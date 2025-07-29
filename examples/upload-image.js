// examples/upload-image.js

import PocketBase from 'pocketbase';
import 'dotenv/config';

/**
 * Faz upload de uma imagem para um registro do PocketBase
 * @param {string} collectionName - Nome da coleção
 * @param {string} recordId - ID do registro
 * @param {File|Blob} imageFile - Arquivo de imagem
 * @returns {Promise<Object>} Registro atualizado
 */
async function uploadImage(collectionName, recordId, imageFile) {
    // 1. Inicializa o cliente do PocketBase
    const pb = new PocketBase(process.env.POCKETBASE_URL);

    // 2. Autentica como admin (necessário para uploads)
    await pb.admins.authWithPassword(
        process.env.POCKETBASE_ADMIN_EMAIL,
        process.env.POCKETBASE_ADMIN_PASSWORD
    );

    // 3. Cria o FormData com a imagem
    const formData = new FormData();
    formData.append('images', imageFile); // 'images' deve ser o nome do campo na coleção

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
function handleFileUpload(event) {
    const file = event.target.files[0];
    if (file) {
        uploadImage('inventory', 'RECORD_ID', file)
            .then(record => console.log('Imagem enviada:', record))
            .catch(error => console.error('Erro:', error));
    }
}

<input type="file" accept="image/*" onChange={handleFileUpload} />
*/

// Exemplo de uso no Node.js:
/*
import { readFile } from 'fs/promises';

async function uploadLocalImage() {
    const imageBuffer = await readFile('./imagem.jpg');
    const imageFile = new Blob([imageBuffer], { type: 'image/jpeg' });
    await uploadImage('inventory', 'RECORD_ID', imageFile);
}
*/

export { uploadImage };