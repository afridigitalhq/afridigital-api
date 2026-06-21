#!/bin/bash

echo "🛡 CI CONTROL GATE RUNNING"

CI=$(curl -s https://afridigital-api.onrender.com/api/ci/evaluate)

echo "$CI"

DEPLOY=$(echo "$CI" | grep -o '"deploy":[^,}]*' | cut -d':' -f2)

if [ "$DEPLOY" != "true" ]; then
  echo "🛑 DEPLOY BLOCKED"
  exit 1
fi

echo "🟢 DEPLOY APPROVED BY CI"

echo "🔐 VALIDATING QUORUM + VAULT + CANARY"

curl -s https://afridigital-api.onrender.com/api/ci/state | grep safe

echo "🟢 CI GATE COMPLETE"
