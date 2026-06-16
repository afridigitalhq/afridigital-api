#!/bin/bash
set -euo pipefail

FILE="${1:-}"

if [[ -z "$FILE" ]]; then
  echo "⛔ FILE REQUIRED"
  exit 1
fi

echo "🧠 KERNEL v6.1 AST CHECK: $FILE"

# -------------------------
# 1. HARD RULES (same as v6)
# -------------------------
if echo "$FILE" | grep -E "archive|backup|freeze|quarantine|_FINAL_CONSOLIDATION_ARCHIVE"; then
  echo "⛔ BLOCKED: lifecycle violation"
  exit 1
fi

# -------------------------
# 2. SINGLETON RULES
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
# 3. AST STRUCTURE ANALYSIS (NEW CORE)
# -------------------------
if [[ -f "$FILE" ]]; then
  AST_OUTPUT=$(node tools/kernel/ast-analyzer.js "$FILE")

  FUNCTIONS=$(echo "$AST_OUTPUT" | grep functions | grep -o '[0-9]\+')
  CLASSES=$(echo "$AST_OUTPUT" | grep classes | grep -o '[0-9]\+')

  echo "📊 AST PROFILE: functions=$FUNCTIONS classes=$CLASSES"

  # drift heuristic v6.1 (structure-based)
  if [[ "$FUNCTIONS" -gt 25 ]]; then
    echo "⚠️ DRIFT WARNING: function density too high ($FUNCTIONS)"
  fi

  if [[ "$CLASSES" -gt 10 ]]; then
    echo "⚠️ DRIFT WARNING: class-heavy module detected ($CLASSES)"
  fi
fi

# -------------------------
# 4. DUPLICATE CHECK
# -------------------------
if [[ -f "$FILE" ]]; then
  echo "⛔ BLOCKED: file already exists"
  exit 1
fi

echo "✅ APPROVED (KERNEL v6.1 AST)"
