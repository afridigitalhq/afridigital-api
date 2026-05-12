#!/bin/bash

echo "━━━━━━━━━━━━━━━━━━━━━━"
echo "🔍 AFRIVIEW v1.2 (ARCHITECTURE SAFETY SCAN)"
echo "━━━━━━━━━━━━━━━━━━━━━━"

echo ""
echo "📦 ENGINE / SERVICE / WORKER / ROUTES"
find . -type f | grep -E "engine|service|worker|routes"

echo ""
echo "⚠️ WEBHOOK ENTRY POINTS"
grep -R "app.post(\"/webhook" -n . 2>/dev/null

echo ""
echo "💣 PATCH / INJECTION FILES (RISK ZONE)"
ls | grep -E "v[0-9]+-.*patch|debug|inject" 2>/dev/null

echo ""
echo "🧠 CORE ENGINES"
find core -type f -name "*.js"

echo ""
echo "🔗 DEPENDENCY MAP"
grep -R "require(" core services workers routes 2>/dev/null

echo ""
echo "💰 FINANCIAL SYSTEM"
grep -R "ledger\|escrow\|withdraw\|treasury" -n core 2>/dev/null

echo ""
echo "📣 MONETIZATION SYSTEM"
grep -R "ad\|revenue\|click\|wallet" -n core 2>/dev/null

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━"
echo "✅ AFRIVIEW v1.2 COMPLETE"
echo "━━━━━━━━━━━━━━━━━━━━━━"
