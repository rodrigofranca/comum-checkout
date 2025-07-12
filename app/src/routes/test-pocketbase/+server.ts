import pb from '$lib/pocketbase';

export async function GET() {
  try {
    // Tenta obter a lista de coleções (requer autenticação de admin)
    const health = await pb.health.check();

    return new Response(JSON.stringify({
      status: 'success',
      message: 'PocketBase connection successful',
      health
    }), {
      headers: {
        'Content-Type': 'application/json'
      }
    });
  } catch (error) {
    console.error('PocketBase connection error:', error);

    return new Response(JSON.stringify({
      status: 'error',
      message: 'Failed to connect to PocketBase',
      error: error instanceof Error ? error.message : String(error)
    }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  }
}