#!/data/data/com.termux/files/usr/bin/bash

MODULE=$1
REGISTRY="src/africctv/intelligence/bootstrap/IntelligenceBootstrapRegistry.js"

if [ -z "$MODULE" ]; then
 echo "Usage: registry-guard.sh <ModuleName>"
 exit 1
fi

if [ ! -f "$REGISTRY" ]; then
 echo "⚠️ Registry not found - skipping guard"
 exit 0
fi

if grep -q "$MODULE" "$REGISTRY"; then
 echo "🔴 OWNERSHIP CONFLICT: $MODULE already registered"
 exit 1
fi

echo "🟢 Registry ownership check passed: $MODULE"
exit 0
