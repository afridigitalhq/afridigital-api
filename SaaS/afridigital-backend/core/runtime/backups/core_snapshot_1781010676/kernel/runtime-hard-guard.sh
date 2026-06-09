#!/bin/bash

echo "🧠 HARD RUNTIME VALIDATION"

COUNT=$(grep -R "app.listen(" . \
  --exclude-dir=node_modules \
  --exclude-dir=afribk \
  --exclude-dir=archive \
  | grep -v "render-entry.js" | wc -l)

if [ "$COUNT" -gt 0 ]; then
  echo "🚨 MULTI-RUNTIME DETECTED: $COUNT"
  exit 1
fi

echo "🟢 HARD CHECK PASSED"
