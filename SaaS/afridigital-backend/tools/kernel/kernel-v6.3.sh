#!/bin/bash
set -euo pipefail

FILE="${1:-}"

echo "🧠 KERNEL v6.3 MEMORY GRAPH CHECK: $FILE"

if [[ -z "$FILE" ]]; then
  echo "⛔ FILE REQUIRED"
  exit 1
fi

# forbidden zones
if echo "$FILE" | grep -E "archive|backup|freeze|quarantine|_FINAL_CONSOLIDATION_ARCHIVE"; then
  echo "⛔ BLOCKED: lifecycle violation"
  exit 1
fi

# build memory graph (light sync step)
node tools/kernel/architecture-memory.js >/dev/null 2>&1 || true

# load graph
if [[ -f ".kernel/graph.json" ]]; then
  deps=$(cat .kernel/graph.json | grep -o "$FILE" | wc -l)

  echo "📊 ARCH MEMORY ACTIVE"
fi

# singleton enforcement (live)
render_count=$(find . -type f -name "render.js" | wc -l)
if [[ "$FILE" == *"render.js" && "$render_count" -gt 1 ]]; then
  echo "⛔ BLOCKED: render singleton"
  exit 1
fi

whatsapp_count=$(find . -type f -name "whatsappPipeline.js" | wc -l)
if [[ "$FILE" == *"whatsappPipeline.js" && "$whatsapp_count" -gt 1 ]]; then
  echo "⛔ BLOCKED: whatsapp singleton"
  exit 1
fi

# existence check
if [[ -f "$FILE" ]]; then
  echo "⛔ BLOCKED: file exists"
  exit 1
fi

echo "✅ APPROVED (KERNEL v6.3 MEMORY GRAPH)"
