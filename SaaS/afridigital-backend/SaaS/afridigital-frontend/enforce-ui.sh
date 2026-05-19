#!/usr/bin/env bash

FILE="dist/index.html"

if [ ! -f "$FILE" ]; then
  echo "❌ BUILD MISSING: dist/index.html"
  exit 1
fi

fail=0

check() {
  key=$1

  if ! grep -q "data-ui=\"$key\"" "$FILE"; then
    echo "❌ DOM CONTRACT FAILED: $key"
    fail=1
  fi
}

# UI contract list
check "hero"
check "marquee"
check "auth"
check "services"
check "footer"
check "chat"

if [ "$fail" -eq 1 ]; then
  echo "❌ UI SCHEMA VALIDATION FAILED"
  exit 1
fi

echo "✅ UI SCHEMA VALIDATION PASSED"
exit 0
