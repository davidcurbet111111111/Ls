#!/bin/sh

echo "======================================"
echo " Hugging Face Model Repo Creator"
echo " Alpine Linux (no jq, minimal tools)"
echo "======================================"

# Input token
printf "Enter your Hugging Face access token: "
read HF_TOKEN

# Input owner (username or org)
printf "Enter repo owner (username or organization): "
read OWNER

# Input model name
printf "Enter new model name (example: my-model): "
read MODEL_NAME

# API endpoint
API_URL="https://huggingface.co/api/repos/create"

# Build JSON manually
JSON_PAYLOAD=$(echo "{\"name\":\"$MODEL_NAME\",\"organization\":\"$OWNER\",\"private\":false,\"type\":\"model\"}")

# Send request
RESPONSE=$(curl -s -X POST "$API_URL" \
  -H "Authorization: Bearer $HF_TOKEN" \
  -H "Content-Type: application/json" \
  -d "$JSON_PAYLOAD")

echo ""
echo "========== SERVER RESPONSE =========="
echo "$RESPONSE"
echo "====================================="

# Try to extract URL from response
MODEL_URL=$(echo "$RESPONSE" \
  | grep -o '"url":[^,}]*' \
  | cut -d':' -f2- \
  | sed 's/"//g' \
  | sed 's/^[ ]*//')

# Fallback URL if parsing fails
if [ -z "$MODEL_URL" ]; then
  MODEL_URL="https://huggingface.co/$OWNER/$MODEL_NAME"
fi

echo ""
echo "========== RESULT =========="
echo "Model URL: $MODEL_URL"
echo "============================"

# Extra info parsing (optional debug)
STATUS_MSG=$(echo "$RESPONSE" | grep -o '"error":[^}]*' | cut -d':' -f2- | sed 's/"//g')

if [ ! -z "$STATUS_MSG" ]; then
  echo ""
  echo "API Error: $STATUS_MSG"
fi
