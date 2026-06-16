#!/bin/bash

FILE="$1"

echo "🧠 KERNEL v2 ACTIVE: $FILE"

# =========================
# CENTRALIZED SCAN FILTER (LIVE ONLY TRUTH)
# =========================
scan() {
  find . -type f \
    ! -path "*_archive*" \
    ! -path "*_FINAL_CONSOLIDATION_ARCHIVE*" \
    ! -path "*_backup*" \
    ! -path "*_disabled*" \
    ! -path "*_freeze*" \
    ! -path "*_quarantine*"
}

count_render() {
  scan | grep -F "render\.js$" | wc -l
}

count_whatsapp_entry() {
  scan | grep -F "whatsappPipeline\.js$" | wc -l
}

# =========================
# 1. FORBIDDEN ARTIFACTS
# =========================
if echo "$FILE" | grep -Fi "backup|freeze|disabled|quarantine|\.old|\.bak|copy"; then
  echo "⛔ BLOCKED: lifecycle artifact"
  exit 1
fi

# =========================
# 2. SINGLETON ENFORCEMENT (TRUE LIVE ONLY)
# =========================
if echo "$FILE" | grep -q "render.js"; then
  RENDER_COUNT=$(count_render)
  echo "render.js LIVE COUNT: $RENDER_COUNT"
  if [ "$RENDER_COUNT" -gt 1 ]; then
    echo "⛔ BLOCKED: render.js singleton violation"
    exit 1
  fi
fi

if echo "$FILE" | grep -Fi "whatsapp.*pipeline|pipeline.*whatsapp"; then
  WHATSAPP_COUNT=$(count_whatsapp_entry)
  echo "whatsappPipeline.js LIVE COUNT: $WHATSAPP_COUNT"
  if [ "$WHATSAPP_COUNT" -gt 1 ]; then
    echo "⛔ BLOCKED: whatsapp pipeline singleton violation"
    exit 1
  fi
fi

# =========================
# 3. ARCHITECTURE RULES
# =========================
if echo "$FILE" | grep -F "^\.\/routes.*pipeline"; then
  echo "⛔ BLOCKED: routes cannot contain pipeline logic"
  exit 1
fi

if echo "$FILE" | grep -F "^\.\/core.*(server|app|index)\.js"; then
  echo "⛔ BLOCKED: core cannot define entrypoints"
  exit 1
fi

# =========================
# 4. ARCHIVE IS IGNORED (NO LEAKS INTO LOGIC)
# =========================
if echo "$FILE" | grep -q "_archive"; then
  echo "📦 ARCHIVE (ignored by kernel logic)"
fi

echo "✅ KERNEL APPROVED"
