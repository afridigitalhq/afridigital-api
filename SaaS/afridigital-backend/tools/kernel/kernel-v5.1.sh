#!/bin/bash
set -euo pipefail

FILE="${1:-}"
POLICY="./tools/kernel/policy-v5.json"

if [[ -z "$FILE" ]]; then
  echo "⛔ FILE REQUIRED"
  exit 1
fi

echo "🧠 KERNEL v5.1 ACTIVE: $FILE"

# -------------------------
# LOAD POLICY
# -------------------------

FORBIDDEN_PATTERNS=$(cat "$POLICY" | grep -o '"forbidden_patterns": \[[^]]*' | grep -o '"[^"]*"' | tr -d '"')
FORBIDDEN_PATHS=$(cat "$POLICY" | grep -o '"forbidden_paths": \[[^]]*' | grep -o '"[^"]*"' | tr -d '"')

# -------------------------
# PATH CHECK
# -------------------------
for p in $FORBIDDEN_PATHS; do
  if echo "$FILE" | grep -q "$p"; then
    echo "⛔ BLOCKED: forbidden path ($p)"
    exit 1
  fi
done

# -------------------------
# PATTERN CHECK
# -------------------------
for pat in $FORBIDDEN_PATTERNS; do
  if echo "$FILE" | grep -q "$pat"; then
    echo "⛔ BLOCKED: forbidden pattern ($pat)"
    exit 1
  fi
done

# -------------------------
# SINGLETON CHECK (dynamic)
# -------------------------
render_target=$(cat "$POLICY" | grep -A2 "render.js" | grep "./runtime/ui/render.js" || true)
if [[ "$FILE" == *"render.js" ]] && [[ -f "./runtime/ui/render.js" ]]; then
  echo "⛔ BLOCKED: render.js singleton violation"
  exit 1
fi

if [[ "$FILE" == *"whatsappPipeline.js" ]] && [[ -f "./src/services/whatsapp/whatsappPipeline.js" ]]; then
  echo "⛔ BLOCKED: whatsappPipeline.js singleton violation"
  exit 1
fi

# -------------------------
# DUPLICATE CHECK
# -------------------------
if [[ -f "$FILE" ]]; then
  echo "⛔ BLOCKED: file already exists"
  exit 1
fi

echo "✅ APPROVED (KERNEL v5.1)"
