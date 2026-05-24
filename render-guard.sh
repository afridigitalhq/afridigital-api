#!/bin/bash

echo "🛡️ RENDER GUARD ACTIVE"

# 1. Prevent missing backend entry
if [ ! -f "SaaS/afridigital-backend/server.js" ]; then
  echo "❌ Backend server.js missing — BLOCK DEPLOY"
  exit 1
fi

# 2. Prevent empty frontend build
if [ ! -f "SaaS/afridigital-frontend/index.html" ]; then
  echo "❌ Frontend index missing — BLOCK DEPLOY"
  exit 1
fi

# 3. Ensure UI system exists
if [ ! -d "SaaS/afridigital-frontend/src/partials" ]; then
  echo "❌ UI modules missing — BLOCK DEPLOY"
  exit 1
fi

echo "✅ RENDER SAFE — DEPLOY APPROVED"
