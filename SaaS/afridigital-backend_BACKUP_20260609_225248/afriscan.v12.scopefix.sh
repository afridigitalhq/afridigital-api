#!/bin/bash

echo "🧠 AFRISCAN v12 — SEMANTIC SCOPE ENGINE"

INCLUDE_PATHS="
src
app
routes
controllers
middleware
services
core/ai
core/brain
core/adapters
"

EXCLUDE_PATHS="
node_modules
afribk
archive
core/runtime/backups
_SAFE_RESTRUCTURE_BACKUP
obs-dashboard
control-plane/collector
core/runtime/env
"

echo ""
echo "🧬 STRICT DUPLICATE ANALYSIS (SCOPED)"

FILES=$(find $INCLUDE_PATHS -type f 2>/dev/null)

# filter again for safety
FILTERED=$(echo "$FILES" | grep -v -E "$(echo $EXCLUDE_PATHS | tr ' ' '|')")

DUPS=$(echo "$FILTERED" \
  | xargs -I{} sha256sum {} 2>/dev/null \
  | cut -d' ' -f1 \
  | sort | uniq -d | wc -l)

echo "duplicate_signals (SCOPED REAL): $DUPS"

echo ""
echo "🧠 RESULT = ONLY ACTIVE RUNTIME LOGIC DUPLICATES"
