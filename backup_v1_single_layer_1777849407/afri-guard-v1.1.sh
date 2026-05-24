#!/bin/bash

echo "🧱 AFRIDIGITAL DESIGN SYSTEM LOCK v1.1"

ROOT=$(pwd)

# -----------------------------
# 1. HERO PURITY CHECK
# -----------------------------
echo "🔍 Checking hero purity..."

if grep -Rni "login\|signup\|register\|dashboard" SaaS/afridigital-frontend/index.html >/dev/null; then
  echo "❌ HERO VIOLATION: Auth elements detected in hero"
  exit 1
fi

# -----------------------------
# 2. DUPLICATE HERO DETECTION
# -----------------------------
echo "🔍 Checking duplicate hero sections..."

HERO_COUNT=$(grep -Rni "<section class=\"hero" SaaS/afridigital-frontend/index.html | wc -l)

if [ "$HERO_COUNT" -gt 1 ]; then
  echo "❌ MULTIPLE HERO SECTIONS DETECTED"
  exit 1
fi

# -----------------------------
# 3. UI SOURCE OF TRUTH CHECK
# -----------------------------
echo "🔍 Checking UI source integrity..."

if [ -f "ui/styles/design-system.css" ]; then
  echo "❌ LEGACY UI STYLE DETECTED (must use Vite src/styles only)"
  exit 1
fi

# -----------------------------
# 4. GLOBAL COMPONENT PROTECTION
# -----------------------------
echo "🔍 Checking global component integrity..."

for file in $(find SaaS/afridigital-frontend -type f -name "*.html"); do
  if grep -ni "footer.*duplicate\|chat-widget.*duplicate" "$file" >/dev/null; then
    echo "❌ GLOBAL COMPONENT DUPLICATION FOUND in $file"
    exit 1
  fi
done

# -----------------------------
# 5. BUILD SAFETY CHECK
# -----------------------------
echo "🧪 Running frontend build validation..."

cd SaaS/afridigital-frontend || exit 1

npm install >/dev/null 2>&1 || exit 1
npm run build || exit 1

if [ ! -f "dist/index.html" ]; then
  echo "❌ BUILD FAILED: No output generated"
  exit 1
fi

# -----------------------------
# 6. SUCCESS
# -----------------------------
echo "✅ DESIGN SYSTEM LOCK v1.1 PASSED"
echo "🚀 SAFE FOR DEPLOYMENT"
