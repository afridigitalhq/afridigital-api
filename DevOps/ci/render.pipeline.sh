#!/bin/bash

set -e

echo "🧠 AFRIDIGITAL RENDER CI PIPELINE"

ROOT=$(pwd)

FRONTEND="$ROOT/AfriDigital-hub"
BACKEND="$ROOT/AfriDigital-api"

echo "━━━━━━━━━━━━━━━━━━━━━━"
echo "🧪 PRE-FLIGHT CHECKS"

git -C $FRONTEND status --short
git -C $BACKEND status --short

echo "━━━━━━━━━━━━━━━━━━━━━━"
echo "🧱 FRONTEND BUILD"

cd $FRONTEND && npm run build

echo "🧱 BACKEND SYNTAX CHECK"
cd $BACKEND && node --check server.js

echo "━━━━━━━━━━━━━━━━━━━━━━"
echo "🔍 PRODUCTION GUARD CHECK"

grep -RIn "localhost" $FRONTEND || echo "OK"
grep -RIn "127.0.0.1" $FRONTEND || echo "OK"

echo "━━━━━━━━━━━━━━━━━━━━━━"
echo "🌐 API HEALTH CHECK"

curl -s https://afridigital-api.onrender.com/health || echo "WARN: API unreachable"

echo "━━━━━━━━━━━━━━━━━━━━━━"
echo "📦 FEATURE FLAG VALIDATION"

node -e "
const flags = require('$FRONTEND/src/os/OSFeatureFlags.js');
console.log('OS FLAGS LOADED:', Object.keys(flags.OS_FEATURES || {}));
"

echo "━━━━━━━━━━━━━━━━━━━━━━"
echo "🚀 READY FOR RENDER DEPLOY"

echo "👉 Push triggers deploy:"
echo "   git push origin main"
echo "👉 Frontend: AfriDigital-hub"
echo "👉 Backend: AfriDigital-api"

echo "🟢 CI PIPELINE COMPLETE"

echo "━━━━━━━━━━━━━━━━━━━━━━"
echo "🛡 FEATURE FLAG SAFETY GATE"

FLAGS_CHECK=$(curl -s https://afridigital-api.onrender.com/api/flags/validate)

echo "$FLAGS_CHECK"

SAFE=$(echo "$FLAGS_CHECK" | grep -o '"safe":[^,}]*' | cut -d':' -f2)

if [ "$SAFE" != "true" ]; then
  echo "🛑 DEPLOY BLOCKED: unsafe feature flags detected"
  exit 1
fi

echo "🟢 FEATURE FLAGS SAFE FOR DEPLOY"
