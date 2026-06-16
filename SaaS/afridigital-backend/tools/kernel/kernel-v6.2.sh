#!/bin/bash
set -euo pipefail

FILE="${1:-}"

if [[ -z "$FILE" ]]; then
  echo "⛔ FILE REQUIRED"
  exit 1
fi

echo "🧠 KERNEL v6.2 DEP GRAPH CHECK: $FILE"

# -------------------------
# 1. HARD BLOCK RULES
# -------------------------
if echo "$FILE" | grep -E "archive|backup|freeze|quarantine|_FINAL_CONSOLIDATION_ARCHIVE"; then
  echo "⛔ BLOCKED: lifecycle violation"
  exit 1
fi

# -------------------------
# 2. SINGLETON ENFORCEMENT
# -------------------------
render_count=$(find . -type f -name "render.js" | wc -l)
if [[ "$FILE" == *"render.js" && "$render_count" -gt 1 ]]; then
  echo "⛔ BLOCKED: render singleton violation"
  exit 1
fi

whatsapp_count=$(find . -type f -name "whatsappPipeline.js" | wc -l)
if [[ "$FILE" == *"whatsappPipeline.js" && "$whatsapp_count" -gt 1 ]]; then
  echo "⛔ BLOCKED: whatsapp singleton violation"
  exit 1
fi

# -------------------------
# 3. DEPENDENCY GRAPH ANALYSIS (NEW CORE)
# -------------------------
if [[ -f "$FILE" ]]; then
  GRAPH=$(node tools/kernel/dependency-graph.js "$FILE")

  COUNT=$(echo "$GRAPH" | grep count | grep -o '[0-9]\+')

  echo "📊 DEPENDENCIES: $COUNT"

  if [[ "$COUNT" -gt 15 ]]; then
    echo "⚠️ DRIFT WARNING: high coupling detected ($COUNT deps)"
  fi
fi

# -------------------------
# 4. EXISTENCE CHECK (SAFE CREATE MODEL)
# -------------------------
if [[ -f "$FILE" ]]; then
  echo "⛔ BLOCKED: file already exists"
  exit 1
fi

echo "✅ APPROVED (KERNEL v6.2 DEP GRAPH)"
