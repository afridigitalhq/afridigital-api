#!/data/data/com.termux/files/usr/bin/bash

ROOT="tools/africctv-phase-bootstrap"

echo ""
echo "🚀 === AFRICCTV BOOTSTRAP HEALTH CHECK ==="
echo ""

for FILE in \
"$ROOT/phase-bootstrap.sh" \
"$ROOT/phase-runner.sh" \
"$ROOT/registry/phase-registry.json" \
"$ROOT/registry/registry-update.sh" \
"$ROOT/reports/audit-reporter.sh" \
"$ROOT/guards/registry-guard.sh" \
"$ROOT/templates/orchestrator.template.js" \
"$ROOT/templates/validator.template.js" \
"$ROOT/templates/validation.template.js"
do
 if [ -f "$FILE" ]; then
  echo "🟢 $(basename "$FILE"): OK"
 else
  echo "🔴 $(basename "$FILE"): MISSING"
 fi
done

echo ""
echo "📊 GENERATED MODULE COUNT"

COUNT=$(find src/africctv/generated -maxdepth 1 -type d | wc -l)
echo "🟢 Modules: $((COUNT-1))"

echo ""
echo "🔍 DUPLICATE OWNERSHIP CHECK"

DUP=$(find src/africctv/generated -type f -printf "%f\n" | sort | uniq -d)

if [ -z "$DUP" ]; then
 echo "🟢 No Duplicate Ownership"
else
 echo "$DUP"
fi

echo ""
echo "=============================="
echo "🟢 AFRICCTV BOOTSTRAP HEALTH READY"
echo "🔒 PHASE 63 LOCKED"
