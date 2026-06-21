#!/bin/bash

echo "🧠 AUTO DEPLOY ENGINE START"

RESULT=$(curl -s https://afridigital-api.onrender.com/api/ci/evaluate)
DEPLOY=$(echo "$RESULT" | grep -o '"deploy":[^,}]*' | cut -d':' -f2)

if [ "$DEPLOY" = "true" ]; then
  echo "🚀 DEPLOY APPROVED"
  git push origin main
else
  echo "🛑 DEPLOY BLOCKED - TRIGGERING ROLLBACK"
  bash DevOps/rollback.sh || true
fi
