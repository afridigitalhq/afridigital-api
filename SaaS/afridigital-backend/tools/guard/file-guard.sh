#!/bin/bash

FILE="$1"

echo "🔍 Guard checking: $FILE"

# -----------------------------
# 1. FORBIDDEN PATTERNS (GLOBAL)
# -----------------------------
if echo "$FILE" | grep -Ei "backup|freeze|disabled|quarantine|\.old|\.bak|copy"; then
  echo "⛔ BLOCKED: forbidden lifecycle file pattern"
  exit 1
fi

# -----------------------------
# 2. SINGLE RENDER RULE
# -----------------------------
if [[ "$FILE" == *"render.js" ]]; then
  if [[ "$FILE" != "./runtime/ui/render.js" ]]; then
    echo "⛔ BLOCKED: only runtime/ui/render.js allowed as render entry"
    exit 1
  fi
fi

# -----------------------------
# 3. WHATSAPP ENTRY RULE
# -----------------------------
if echo "$FILE" | grep -qi "whatsapp"; then

  # Only ONE allowed entry file
  if [[ "$FILE" == *"pipeline"* ]]; then
    if [[ "$FILE" != "./src/services/whatsapp/whatsappPipeline.js" ]]; then
      echo "⛔ BLOCKED: only src/services/whatsapp/whatsappPipeline.js is allowed as WhatsApp entry point"
      exit 1
    fi
  fi

fi

# -----------------------------
# 4. BLOCK ROUTE-LEVEL PIPELINES
# -----------------------------
if echo "$FILE" | grep -Ei "routes.*pipeline|pipeline.*routes"; then
  echo "⛔ BLOCKED: pipeline logic cannot exist in routes layer"
  exit 1
fi

# -----------------------------
# 5. CORE RULE PROTECTION (SAFE)
# -----------------------------
if echo "$FILE" | grep -Ei "core/.*/pipeline" >/dev/null; then
  echo "ℹ️ CORE PIPELINE MODULE - allowed internal engine layer"
fi

echo "✅ ALLOWED"
