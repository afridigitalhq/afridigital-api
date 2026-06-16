#!/bin/bash

FILE="$1"

echo "🧠 PIPELINE GUARD CHECK: $FILE"

if grep -E "intent.*router|router.*intent|planner.*handlers|handlers.*planner" "$FILE"; then
  echo "⛔ BLOCKED: cross-module coupling detected"
  exit 1
fi

echo "✅ CLEAN PIPELINE MODULE"
