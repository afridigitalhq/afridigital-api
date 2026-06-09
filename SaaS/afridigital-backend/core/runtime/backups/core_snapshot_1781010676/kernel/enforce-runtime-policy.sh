#!/bin/bash

echo "🛡️ ENFORCING SINGLE RUNTIME POLICY..."

POLICY="core/kernel/runtime-policy.json"

[ ! -f "$POLICY" ] && echo "❌ POLICY MISSING" && exit 1


VIOLATIONS=$(grep -R "app.listen\|http.listen\|server.listen" . \
  --exclude-dir=node_modules \
  --exclude-dir=archive \
  --exclude-dir=.git \
  | grep -v "render-entry.js" || true)

if [ -n "$VIOLATIONS" ]; then
  echo "🚨 VIOLATION DETECTED:"
  echo "$VIOLATIONS"
  echo "⛔ BLOCKED"
  exit 1
fi

echo "🟢 CLEAN: Single runtime enforced"
