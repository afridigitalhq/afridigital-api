#!/bin/bash

FILE="$1"
KERNEL="./tools/kernel/kernel-v2.sh"

if [ -z "$FILE" ]; then
  echo "⛔ No file specified"
  exit 1
fi

bash "$KERNEL" "$FILE" || exit 1

mkdir -p "$(dirname "$FILE")"
touch "$FILE"

echo "✅ CREATED UNDER KERNEL v2"
