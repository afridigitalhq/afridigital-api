#!/bin/bash
set -euo pipefail

OP="${1:-}"
FILE="${2:-}"

KERNEL="./tools/kernel/architecture-kernel.sh"

if [[ -z "$OP" || -z "$FILE" ]]; then
  echo "⛔ USAGE: kernel-v3.sh <create|update|delete> <file>"
  exit 1
fi

echo "🧠 KERNEL v3.1 (SEMANTIC MODE): $OP → $FILE"

# ---------------------------
# 1. SEMANTIC CLASSIFICATION
# ---------------------------

is_archive() {
  [[ "$FILE" == */archive/* || "$FILE" == *_FINAL_CONSOLIDATION_ARCHIVE* ]]
}

is_backup() {
  echo "$FILE" | grep -qi "backup"
}

is_live() {
  ! is_archive && ! is_backup
}

# ---------------------------
# 2. GLOBAL ARCHITECTURE RULES
# ---------------------------

bash "$KERNEL" "$FILE" || exit 1

if is_archive; then
  echo "📦 ARCHIVE MODE: read-only lineage (excluded from drift)"
fi

# ---------------------------
# 3. CREATE MODE
# ---------------------------
if [[ "$OP" == "create" ]]; then

  if is_archive; then
    echo "⛔ IMMUTABLE ZONE: archive cannot be written"
    exit 1
  fi

  if [[ -f "$FILE" ]]; then
    echo "⛔ CREATE BLOCKED: file exists → $FILE"
    exit 1
  fi

  mkdir -p "$(dirname "$FILE")"
  touch "$FILE"
  echo "✅ CREATED (LIVE)"

# ---------------------------
# 4. UPDATE MODE
# ---------------------------
elif [[ "$OP" == "update" ]]; then

  if is_archive; then
    echo "⛔ UPDATE BLOCKED: archive is immutable"
    exit 1
  fi

  if [[ ! -f "$FILE" ]]; then
    echo "⛔ UPDATE BLOCKED: file does not exist"
    exit 1
  fi

  echo "✏️ UPDATE ALLOWED (LIVE FILE ONLY)"

# ---------------------------
# 5. DELETE MODE
# ---------------------------
elif [[ "$OP" == "delete" ]]; then

  if is_archive; then
    echo "⛔ DELETE BLOCKED: archive protected"
    exit 1
  fi

  if [[ ! -f "$FILE" ]]; then
    echo "⛔ DELETE BLOCKED: file missing"
    exit 1
  fi

  rm -f "$FILE"
  echo "🗑️ DELETED (LIVE ONLY)"

else
  echo "⛔ INVALID OPERATION"
  exit 1
fi

echo "🟢 KERNEL v3.1 APPROVED (SEMANTIC SAFE)"
