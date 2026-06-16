#!/bin/bash
set -euo pipefail

FILE="${1:-}"
POLICY="./tools/kernel/policy.json"

if [[ -z "$FILE" ]]; then
  echo "⛔ FILE REQUIRED"
  exit 1
fi

echo "🧠 KERNEL v5 ACTIVE: $FILE"

# read policy
if echo "$FILE" | grep -E "archive|backup|freeze|quarantine|_FINAL_CONSOLIDATION_ARCHIVE"; then
  echo "⛔ BLOCKED: forbidden filesystem zone"
  exit 1
fi

# singleton enforcement
if [[ "$FILE" == *"render.js" ]]; then
  if [[ -f "./runtime/ui/render.js" ]]; then
    echo "⛔ BLOCKED: render.js singleton already exists"
    exit 1
  fi
fi

if [[ "$FILE" == *"whatsappPipeline.js" ]]; then
  if [[ -f "./src/services/whatsapp/whatsappPipeline.js" ]]; then
    echo "⛔ BLOCKED: whatsappPipeline.js singleton already exists"
    exit 1
  fi
fi

echo "✅ KERNEL v5 APPROVED"
