export const config = {
  pocketbaseUrl: 'https://api.acervocomum.com.br',
  n8nWebhookUrl: import.meta.env.VITE_N8N_WEBHOOK_URL || ''
} as const;