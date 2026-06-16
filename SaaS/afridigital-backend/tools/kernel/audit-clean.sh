#!/bin/bash

ROOT="."

echo "🧠 CLEAN ARCHITECTURE AUDIT (PRUNED MODE)"
echo "----------------------------------------"

# base exclude patterns
EXCLUDES="_FINAL_CONSOLIDATION_ARCHIVE|backup|freeze|disabled|quarantine|copy|\.old|\.bak|_safe_|_clean_archive"

echo "📦 LIVE FILE COUNT (EXCLUDING ARCHIVE + BACKUPS)"
find "$ROOT" -type f | grep -Ev "$EXCLUDES" | wc -l

echo ""
echo "🚨 FORBIDDEN PATTERNS (LIVE ONLY)"
find "$ROOT" -type f | grep -Ev "$EXCLUDES" | grep -Ei "backup|freeze|disabled|quarantine|copy|\.old|\.bak" || true

echo ""
echo "🧱 RENDER SINGLETON CHECK"
find "$ROOT" -type f -name "render.js" | grep -Ev "$EXCLUDES"
echo "render.js LIVE COUNT:"
find "$ROOT" -type f -name "render.js" | grep -Ev "$EXCLUDES" | wc -l

echo ""
echo "📡 WHATSAPP PIPELINE (LIVE ONLY)"
find "$ROOT" -type f | grep -Ev "$EXCLUDES" | grep -Ei "whatsapp.*pipeline|pipeline.*whatsapp" || true

echo ""
echo "🧠 CORE PIPELINE STRUCTURE (LIVE ONLY)"
ls -R ./core/whatsapp/pipeline 2>/dev/null || echo "NO CORE PIPELINE FOUND"

echo ""
echo "⚙️ NODE VALIDATION"
node -c server.js

echo "----------------------------------------"
echo "🟢 PRUNED AUDIT COMPLETE"
