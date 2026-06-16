#!/bin/bash
set -euo pipefail

FILE="${1:-}"
MODEL="./tools/kernel/semantic-model.json"

if [[ -z "$FILE" ]]; then
  echo "⛔ FILE REQUIRED"
  exit 1
fi

echo "🧠 KERNEL v6 SEMANTIC CHECK: $FILE"

# -------------------------
# 1. FORBIDDEN PATHS (HARD RULE)
# -------------------------
if echo "$FILE" | grep -E "archive|backup|freeze|quarantine|_FINAL_CONSOLIDATION_ARCHIVE"; then
  echo "⛔ BLOCKED: lifecycle violation"
  exit 1
fi

# -------------------------
# 2. SINGLETON ENFORCEMENT
# -------------------------
render_count=$(find . -type f -name "render.js" | grep -v archive | wc -l)
if [[ "$FILE" == *"render.js" && "$render_count" -ge 1 ]]; then
  echo "⛔ BLOCKED: render.js singleton violation"
  exit 1
fi

whatsapp_count=$(find . -type f -name "whatsappPipeline.js" | grep -v archive | wc -l)
if [[ "$FILE" == *"whatsappPipeline.js" && "$whatsapp_count" -ge 1 ]]; then
  echo "⛔ BLOCKED: whatsapp singleton violation"
  exit 1
fi

# -------------------------
# 3. SEMANTIC DRIFT CHECK (LIGHTWEIGHT ROLE OVERLAP)
# -------------------------
if echo "$FILE" | grep -Ei "intent|router|handler|planner|formatter"; then

  overlap=$(find . -type f \
    \( -name "*intent*" -o -name "*router*" -o -name "*handler*" -o -name "*planner*" -o -name "*formatter*" \) \
    | grep -v archive | wc -l)

  if [[ "$overlap" -gt 8 ]]; then
    echo "⚠️ SEMANTIC DRIFT WARNING: pipeline role explosion detected ($overlap files)"
  fi
fi

# -------------------------
# 4. DUPLICATE CHECK
# -------------------------
if [[ -f "$FILE" ]]; then
  echo "⛔ BLOCKED: file already exists"
  exit 1
fi

echo "✅ APPROVED (KERNEL v6)"
