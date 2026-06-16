#!/bin/bash

ROOT="."

echo "🧠 DRIFT INTELLIGENCE SCAN"
echo "========================="

# -------------------------
# 1. FILE DRIFT METRICS
# -------------------------
TOTAL=$(find $ROOT -type f | wc -l)
ARCHIVE=$(find $ROOT -type f | grep -Ei "archive|_FINAL_CONSOLIDATION_ARCHIVE" | wc -l)
BACKUPS=$(find $ROOT -type f | grep -Ei "backup|freeze|disabled|quarantine|\.bak|\.old|copy" | wc -l)

echo "📦 TOTAL FILES: $TOTAL"
echo "📦 ARCHIVED FILES: $ARCHIVE (excluded from live drift)"
echo "📦 BACKUP/LEGACY ARTIFACTS: $BACKUPS"

# -------------------------
# 2. SINGLETON RULE CHECK
# -------------------------
echo ""
echo "🧱 SINGLETON CHECK"

RENDER_COUNT=$(find . -type f -name "render.js" ! -path "*archive*" | wc -l)
echo "render.js LIVE COUNT: $RENDER_COUNT"

if [ "$RENDER_COUNT" -gt 1 ]; then
  echo "⚠️ DRIFT DETECTED: multiple render.js"
fi

WHATSAPP_ENTRY=$(find . -type f -path "./src/services/whatsapp/whatsappPipeline.js" | wc -l)
echo "whatsappPipeline.js ENTRY: $WHATSAPP_ENTRY"

if [ "$WHATSAPP_ENTRY" -ne 1 ]; then
  echo "⚠️ DRIFT DETECTED: missing or duplicated WhatsApp entry"
fi

# -------------------------
# 3. PIPELINE SPREAD DETECTION
# -------------------------
echo ""
echo "📡 PIPELINE SPREAD"

PIPELINES=$(find . -type f -name "*pipeline*.js" ! -path "*archive*" | wc -l)
echo "pipeline files (live): $PIPELINES"

# -------------------------
# 4. HEALTH SCORE (simple model)
# -------------------------
DRIFT_SCORE=$(( BACKUPS + (RENDER_COUNT * 10) + PIPELINES ))

echo ""
echo "🧠 DRIFT SCORE: $DRIFT_SCORE"

if [ "$DRIFT_SCORE" -lt 20 ]; then
  echo "🟢 SYSTEM STABLE"
elif [ "$DRIFT_SCORE" -lt 50 ]; then
  echo "🟡 MODERATE DRIFT"
else
  echo "🔴 HIGH DRIFT - CONSOLIDATION REQUIRED"
fi

echo "========================="
echo "✅ DRIFT INTELLIGENCE COMPLETE"
