#!/bin/bash

echo "🧠 RENDER DEPLOY HOOK ACTIVE"

CI=$(curl -s https://afridigital-api.onrender.com/api/flags/validate)

echo "$CI"

SAFE=$(echo "$CI" | grep -o '"safe":[^,}]*' | cut -d':' -f2)

if [ "$SAFE" != "true" ]; then
  echo "🛑 DEPLOY BLOCKED BY CI"
  exit 1
fi

echo "🚀 DEPLOY APPROVED"
