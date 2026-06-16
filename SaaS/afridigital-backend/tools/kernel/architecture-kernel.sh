#!/bin/bash
FILE="$1"

echo "🧠 ARCH KERNEL CHECK: $FILE"

if echo "$FILE" | grep -Ei "backup|freeze|disabled|quarantine|\.old|\.bak|copy"; then
  echo "⛔ BLOCKED: forbidden lifecycle artifact"
  exit 1
fi

if echo "$FILE" | grep -q "_FINAL_CONSOLIDATION_ARCHIVE"; then
  echo "📦 ARCHIVE MODE (READ ONLY)"
  exit 0
fi

if echo "$FILE" | grep -q "render.js"; then
  if [[ "$FILE" != "./runtime/ui/render.js" ]]; then
    echo "⛔ BLOCKED: only runtime/ui/render.js allowed"
    exit 1
  fi
fi

if echo "$FILE" | grep -Ei "whatsapp.*pipeline|pipeline.*whatsapp"; then
  if [[ "$FILE" != "./src/services/whatsapp/whatsappPipeline.js" ]]; then
    echo "⛔ BLOCKED: only whatsappPipeline.js allowed"
    exit 1
  fi
fi

echo "✅ KERNEL APPROVED"
