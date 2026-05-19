#!/bin/bash

echo "🚀 AFRIDEPLOY PIPELINE START"

# -----------------------------
# 1. BUILD VALIDATION
# -----------------------------
echo "🧪 Running frontend guard..."
bash afripipeline-guard.sh || {
  echo "❌ BUILD FAILED — STOPPING DEPLOY"
  exit 1
}

# -----------------------------
# 2. STAGING CHECK
# -----------------------------
echo "📦 Staging changes..."
git add .

# -----------------------------
# 3. COMMIT AUTO MESSAGE
# -----------------------------
MSG="deploy: auto pipeline sync $(date '+%Y-%m-%d %H:%M:%S')"
echo "💾 Committing: $MSG"
git commit -m "$MSG" || {
  echo "⚠️ Nothing to commit"
}

# -----------------------------
# 4. PUSH TO GITHUB (TRIGGERS RENDER)
# -----------------------------
echo "🚀 Pushing to GitHub..."
git push origin master || {
  echo "❌ PUSH FAILED"
  exit 1
}

# -----------------------------
# 5. DONE
# -----------------------------
echo "✅ DEPLOY COMPLETE"
echo "🌍 Render will auto-redeploy from GitHub"
