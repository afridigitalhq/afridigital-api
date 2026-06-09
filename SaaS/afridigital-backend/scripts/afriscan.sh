#!/bin/bash

ROOT="$(pwd)"

echo ""
echo "🧠 AFRISCAN v10 — DEPENDENCY CONTROL BRAIN"
echo "🛰 SYSTEM ROOT: $ROOT"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

############################################
# 📦 RUNTIME LAYER
############################################
ACTIVE_NODES=$(pgrep node | wc -l)

echo ""
echo "📦 RUNTIME LAYER ⚙️"
echo "   ├─ active_nodes : $ACTIVE_NODES"

############################################
# 🌐 DEPENDENCY GRAPH (STATIC AST-STYLE SCAN)
############################################

echo ""
echo "🧬 DEPENDENCY GRAPH 🌐"

MESSAGING=$(grep -R "META_TOKEN\|META_PHONE_ID" . --exclude-dir=node_modules --exclude-dir=.git 2>/dev/null | wc -l)
AUTH=$(grep -R "JWT_SECRET" . --exclude-dir=node_modules --exclude-dir=.git 2>/dev/null | wc -l)
DB=$(grep -R "DATABASE_URL\|mongoose.connect\|sequelize\|pg.connect" . --exclude-dir=node_modules --exclude-dir=.git 2>/dev/null | wc -l)
CACHE=$(grep -R "REDIS_URL\|ioredis\|redis.createClient" . --exclude-dir=node_modules --exclude-dir=.git 2>/dev/null | wc -l)

echo "   ├─ messaging → META_TOKEN, META_PHONE_ID ($MESSAGING refs)"
echo "   ├─ auth      → JWT_SECRET ($AUTH refs)"
echo "   ├─ database  → DATABASE_URL ($DB refs)"
echo "   ├─ cache     → REDIS_URL ($CACHE refs)"
echo "   ├─ runtime   → node_process"

############################################
# 🔐 ENV CONTROL BRAIN
############################################

echo ""
echo "🔐 ENV CONTROL BRAIN ☁️"

score=0

check_env () {
  NAME=$1
  WEIGHT=$2

  if [ -n "${!NAME}" ]; then
    echo "   🟢 $NAME : PRESENT"
    score=$((score + WEIGHT))
  else
    echo "   🔴 $NAME : MISSING"
  fi
}

check_env META_TOKEN 20
check_env META_PHONE_ID 10
check_env JWT_SECRET 25
check_env DATABASE_URL 25
check_env REDIS_URL 20

############################################
# 💥 FAILURE PROPAGATION ENGINE
############################################

echo ""
echo "💥 FAILURE PROPAGATION ENGINE ⚠️"

if [ -z "$META_TOKEN" ]; then
  echo "❌ META_TOKEN missing → messaging + webhooks + notifications FAIL"
fi

if [ -z "$META_PHONE_ID" ]; then
  echo "❌ META_PHONE_ID missing → routing layer broken"
fi

if [ -z "$DATABASE_URL" ]; then
  echo "❌ DATABASE_URL missing → API writes + auth persistence FAIL"
fi

if [ -z "$REDIS_URL" ]; then
  echo "❌ REDIS_URL missing → cache + queue system FAIL"
fi

if [ -z "$JWT_SECRET" ]; then
  echo "❌ JWT_SECRET missing → authentication integrity WEAK"
fi

############################################
# 🏗 ARCHITECTURE LAYER
############################################

echo ""
echo "🏗 ARCHITECTURE LAYER 🏛"

LISTENERS=$(grep -R "listen(" src core app server 2>/dev/null | wc -l)
ENTRYPOINTS=$(find . -type f \( -name "server*" -o -name "app.js" -o -name "index.js" \) 2>/dev/null | wc -l)

echo "   ├─ listeners_detected : $LISTENERS"
echo "   ├─ entrypoints        : $ENTRYPOINTS"

############################################
# 🧬 DUPLICATION INTELLIGENCE
############################################

echo ""
echo "🧬 DUPLICATION INTELLIGENCE 🧪"

DUPS=$(find . -type f -not -path "*/node_modules/*" -not -path "*/afribk/*" -printf "%f\n" 2>/dev/null | sort | uniq -d | wc -l)

echo "   ├─ duplicate_signals : $DUPS"

############################################
# 🚀 DEPLOYMENT SIMULATOR
############################################

echo ""
echo "🚀 DEPLOYMENT SIMULATOR 🛰"

RISK=0

[ -z "$DATABASE_URL" ] && RISK=$((RISK+30))
[ -z "$REDIS_URL" ] && RISK=$((RISK+20))
[ -z "$META_TOKEN" ] && RISK=$((RISK+15))
[ "$LISTENERS" -gt 20 ] && RISK=$((RISK+10))

echo "   ├─ risk_score : $RISK/100"

if [ $RISK -gt 60 ]; then
  echo "   ├─ status     : 🔴 DEPLOYMENT BLOCKED"
elif [ $RISK -gt 30 ]; then
  echo "   ├─ status     : 🟡 DEGRADED"
else
  echo "   ├─ status     : 🟢 READY"
fi

############################################
# 🧠 FINAL SCORE ENGINE
############################################

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

FINAL=$((score - RISK + 50))

if [ $FINAL -lt 0 ]; then FINAL=0; fi
if [ $FINAL -gt 100 ]; then FINAL=100; fi

echo "🧠 ENV SCORE     : $score/100"
echo "🚨 RISK SCORE    : $RISK/100"
echo "🧠 FINAL HEALTH  : $FINAL/100"

if [ $FINAL -ge 80 ]; then
  echo "🚀 SYSTEM STATUS : READY"
elif [ $FINAL -ge 50 ]; then
  echo "🟡 SYSTEM STATUS : DEGRADED"
else
  echo "🔴 SYSTEM STATUS : NOT READY"
fi

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
