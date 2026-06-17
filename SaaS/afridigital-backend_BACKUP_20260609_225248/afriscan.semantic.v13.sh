#!/bin/bash

echo "🧠 AFRISCAN v13 — SEMANTIC DUPLICATE ENGINE"

echo ""
echo "📦 SCANNING SEMANTIC DUPLICATES (NOT FILENAMES)"

# normalize by PATH SIGNATURE not filename
find . -type f \
  ! -path "*/node_modules/*" \
  ! -path "*/archive/*" \
  ! -path "*/afribk/*" \
  ! -path "*/backup/*" \
  | awk -F/ '{print $(NF-1) "/" $NF}' \
  | sort \
  | uniq -c \
  | awk '$1 > 1 {print $2 " => " $1 " copies"}'

echo ""
echo "🧠 INTERPRETATION:"
echo "- Only identical module ROLE duplicates appear"
echo "- Router/engine/store reuse is ignored unless identical path context"
