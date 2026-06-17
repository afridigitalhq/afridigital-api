#!/bin/bash

set -e

echo "🚀 AFRIDIGITAL DEPLOY PIPELINE STARTING..."

# ---------------------------
# 1. PRE-FLIGHT CHECKS
# ---------------------------
echo "🔍 Running preflight checks..."

if [ ! -f "server.js" ]; then
  echo "❌ server.js missing"
  exit 1
fi

if [ ! -d "app/routes" ]; then
  echo "❌ routes directory missing"
  exit 1
fi

echo "✔ Preflight OK"

# ---------------------------
# 2. AUTO COMMIT SNAPSHOT
# ---------------------------
echo "📦 Creating snapshot commit..."

TIMESTAMP=$(date +"%Y-%m-%d_%H-%M-%S")

git add .

git commit -m "deploy: snapshot $TIMESTAMP" || echo "ℹ️ No changes to commit"

# ---------------------------
# 3. PUSH TO REPO
# ---------------------------
echo "🚀 Pushing to origin..."

git push origin main

# ---------------------------
# 4. WAIT FOR RENDER
# ---------------------------
echo "⏳ Waiting for Render deploy..."

sleep 25

# ---------------------------
# 5. HEALTH CHECK
# ---------------------------
echo "🧪 Running health check..."

HEALTH_URL="https://afridigital-fmdash.onrender.com/health"

STATUS=$(curl -s $HEALTH_URL | grep -o '"ok":true' || true)

if [ "$STATUS" != "\"ok\":true" ]; then
  echo "❌ HEALTH CHECK FAILED"
  echo "⚠️ Triggering rollback safety stop..."

  git reset --hard HEAD~1
  git push --force origin main

  exit 1
fi

echo "✅ DEPLOY SUCCESSFUL"
echo "🎉 System healthy at $HEALTH_URL"

