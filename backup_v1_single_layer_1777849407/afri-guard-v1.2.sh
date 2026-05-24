#!/bin/bash

echo "🧠 AFRIDIGITAL DESIGN SYSTEM LOCK v1.2"

ROOT=$(pwd)
TIMESTAMP=$(date +%Y%m%d_%H%M%S)

BACKUP_DIR=~/AfriDigitalHub-Backup

# -----------------------------
# 1. PRE-COMMIT SAFETY GATE
# -----------------------------
echo "🔍 Pre-commit validation..."

if git diff --cached --name-only | grep -q "index.html"; then
  if grep -ni "login\|signup\|register" SaaS/afridigital-frontend/index.html >/dev/null; then
    echo "❌ BLOCKED: Auth UI detected in frontend shell"
    exit 1
  fi
fi

# -----------------------------
# 2. HERO IMMUTABILITY CHECK
# -----------------------------
echo "🔍 Checking hero integrity..."

HERO_COUNT=$(grep -Rni "<section class=\"hero" SaaS/afridigital-frontend/index.html | wc -l)

if [ "$HERO_COUNT" -ne 1 ]; then
  echo "❌ BLOCKED: Hero must be exactly ONE section"
  exit 1
fi

# -----------------------------
# 3. BUILD VALIDATION
# -----------------------------
echo "🧪 Running build..."

cd SaaS/afridigital-frontend || exit 1

npm install >/dev/null 2>&1
npm run build || {
  echo "❌ BUILD FAILED — initiating rollback"

  LAST_SNAPSHOT=$(ls -t $BACKUP_DIR | head -n 1)

  if [ -d "$BACKUP_DIR/$LAST_SNAPSHOT" ]; then
    rsync -av --delete "$BACKUP_DIR/$LAST_SNAPSHOT/" "$ROOT/"
    echo "♻️ ROLLED BACK TO: $LAST_SNAPSHOT"
  fi

  exit 1
}

# -----------------------------
# 4. SNAPSHOT AUTO-CREATE
# -----------------------------
echo "📦 Creating safety snapshot..."

SNAP_NAME="snapshot_v1.2_$TIMESTAMP"
mkdir -p "$BACKUP_DIR/$SNAP_NAME"

rsync -av --exclude='node_modules' --exclude='dist' "$ROOT/" "$BACKUP_DIR/$SNAP_NAME/"

# -----------------------------
# 5. GIT AUDIT COMMIT
# -----------------------------
echo "📡 Committing safe state..."

cd "$ROOT"

git add .
git commit -m "safe: v1.2 guarded deploy snapshot $TIMESTAMP" || echo "no changes"

# -----------------------------
# 6. DEPLOY PUSH
# -----------------------------
echo "🚀 Pushing to GitHub..."

git push origin master || {
  echo "❌ PUSH FAILED — restoring last snapshot"
  bash afri-rollback.sh
  exit 1
}

echo "✅ AFRIDIGITAL v1.2 DEPLOY SUCCESSFUL"
