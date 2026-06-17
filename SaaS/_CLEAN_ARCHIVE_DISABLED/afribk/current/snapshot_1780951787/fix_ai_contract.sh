#!/bin/bash

FILE="routes/ai.js"

echo "🧠 FIXING AI CONTRACT → /api/ai"

# Replace ai/reply → ai
sed -i "s/\/ai\/reply/\/ai/g" "$FILE"

echo "🚀 AI ROUTE NOW: POST /api/ai"
