#!/bin/bash

echo "🛡️ DEPLOYMENT GUARD RUNNING..."

STATUS=$(curl -s -o /dev/null -w "%{http_code}" https://afridigital-api.onrender.com)

if [ "$STATUS" != "200" ]; then
  echo "❌ DEPLOY BLOCKED: API unhealthy ($STATUS)"
  exit 1
fi

echo "✔ API healthy"
echo "✔ deployment allowed"
