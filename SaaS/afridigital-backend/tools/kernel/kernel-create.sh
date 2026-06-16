#!/bin/bash
set -euo pipefail

FILE="${1:-}"

if [[ -z "$FILE" ]]; then
  echo "⛔ FILE REQUIRED"
  exit 1
fi

echo "🧠 PRE-WRITE KERNEL CHECK: $FILE"

KERNEL="./tools/kernel/architecture-kernel.sh"

bash "$KERNEL" "$FILE" || exit 1

# 🚫 IMMUTABLE ZONES (hard check)
if [[ "$FILE" == */archive/* || "$FILE" == *_FINAL_CONSOLIDATION_ARCHIVE* ]]; then
  echo "⛔ IMMUTABLE ZONE: archive is read-only"
  exit 1
fi

# 🚫 prevent duplicates
if [[ -f "$FILE" ]]; then
  echo "⛔ BLOCKED: file already exists → $FILE"
  exit 1
fi

mkdir -p "$(dirname "$FILE")"
touch "$FILE"

echo "✅ FILE CREATED (KERNEL ENFORCED)"
