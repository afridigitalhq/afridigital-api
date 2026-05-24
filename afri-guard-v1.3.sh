#!/bin/bash

echo "🛡️ AFRIDIGITAL SINGLE-LAYER v1 GUARD ACTIVE"

ROOT=~/AfriDigitalHub
FRONTEND="$ROOT/SaaS/afridigital-frontend"
DIST="$FRONTEND/dist/index.html"
INDEX="$FRONTEND/index.html"
BACKEND="$ROOT/SaaS/afridigital-backend/server.js"

echo "🧪 Checking single-layer SaaS structure..."

# 1. Frontend core must exist
if [ ! -f "$INDEX" ]; then
  echo "❌ FRONTEND INDEX MISSING (SaaS layer broken)"
  exit 1
fi

# 2. Build output must exist OR allow dev mode fallback
if [ ! -f "$DIST" ]; then
  echo "⚠️ DIST missing (dev mode detected, allowing pass)"
fi

# 3. Backend must exist
if [ ! -f "$BACKEND" ]; then
  echo "❌ BACKEND CORE MISSING"
  exit 1
fi

# 4. HARD RULE: no legacy UI layer allowed
if [ -d "$ROOT/ui" ]; then
  echo "❌ LEGACY UI LAYER DETECTED — BLOCKING DEPLOY"
  exit 1
fi

echo "✅ SINGLE-LAYER v1 VALIDATION PASSED"
echo "🚀 DEPLOY APPROVED"
