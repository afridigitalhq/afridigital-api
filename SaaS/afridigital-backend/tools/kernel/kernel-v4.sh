#!/bin/bash
set -euo pipefail

FILE="${1:-}"

if [[ -z "$FILE" ]]; then
  echo "⛔ FILE REQUIRED"
  exit 1
fi

echo "🧠 KERNEL v4 CHECK: $FILE"

# forbidden paths
if echo "$FILE" | grep -E "archive|backup|freeze|quarantine|_FINAL_CONSOLIDATION_ARCHIVE"; then
  echo "⛔ BLOCKED: forbidden lifecycle path"
  exit 1
fi

# singleton enforcement
render_count=$(find . -type f -name "render.js" | wc -l)
if [[ "$FILE" == *"render.js" && "$render_count" -ge 1 ]]; then
  echo "⛔ BLOCKED: render.js singleton violation"
  exit 1
fi

whatsapp_count=$(find . -type f -name "whatsappPipeline.js" | wc -l)
if [[ "$FILE" == *"whatsappPipeline.js" && "$whatsapp_count" -ge 1 ]]; then
  echo "⛔ BLOCKED: whatsappPipeline.js singleton violation"
  exit 1
fi

echo "✅ APPROVED (KERNEL v4)"
