# !/bin/bash

# Chama a API do Telegram para configurar o webhook
echo "Setting Webhook..."
curl -X POST \
  -H "Content-Type: application/json" \
  -d "{\"url\": \"$VERCEL_URL/api/index\"}" \
  https://api.telegram.org/bot$BOT_TOKEN/setWebhook