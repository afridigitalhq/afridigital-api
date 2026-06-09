#!/bin/bash

ENV_SCORE=0

# Load env safely
[ -f .env ] && export $(grep -v '^#' .env | xargs) 2>/dev/null

echo ""
echo "☁️ RENDER ENVIRONMENT OBSERVABILITY LAYER"
echo "━━━━━━━━━━━━━━━━━━━━━━"

env_check () {
  KEY=$1
  DESC=$2
  ROLE=$3
  IMPACT=$4

  VALUE="${!KEY}"

  echo ""
  echo "🔐 $KEY ($DESC)"
  echo "   ├─ Source: process.env.$KEY"

  if [ -n "$VALUE" ]; then
    echo "   ├─ Status: ✔ present"
    echo "   ├─ Role: $ROLE"
    echo "   ├─ Impact: +$IMPACT"
    ENV_SCORE=$((ENV_SCORE + IMPACT))
  else
    echo "   ├─ Status: ❌ missing"
    echo "   ├─ Role: $ROLE"
    echo "   ├─ Risk: HIGH"
  fi
}

env_check META_TOKEN "Meta API Token" "WhatsApp Cloud API auth layer" 25
env_check JWT_SECRET "JWT Secret" "Authentication/session security" 25
env_check DATABASE_URL "Database URL" "Primary persistence layer" 25
env_check REDIS_URL "Redis Cache" "Queue/session acceleration layer" 25

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━"
echo "☁️ ENV SCORE: $ENV_SCORE/100"
echo "━━━━━━━━━━━━━━━━━━━━━━"y
