#!/data/data/com.termux/files/usr/bin/bash

PHASE=$1
MODULE=$2

if [ -z "$PHASE" ] || [ -z "$MODULE" ]; then
  echo "Usage: ./phase-runner.sh <phase> <module>"
  exit 1
fi

ROOT="src/africctv/generated/$MODULE"
BOOTSTRAP="./tools/africctv-phase-bootstrap/phase-bootstrap.sh"

echo ""
echo "🚀 === AFRICCTV PHASE $PHASE RUNNER ==="
echo ""

echo "📌 STEP 0: REGISTRY OWNERSHIP CHECK"
./tools/africctv-phase-bootstrap/guards/registry-guard.sh "$MODULE" || exit 1

echo "📌 STEP 1: BOOTSTRAP"
$BOOTSTRAP "$PHASE" "$MODULE"

echo ""
echo "📌 STEP 2: VALIDATION"

VALIDATOR=$(find "$ROOT" -name "Phase${PHASE}*Validation.js" | head -1)

if [ -f "$VALIDATOR" ]; then
  node "$VALIDATOR"
else
  echo "⚠️ Validator not found"
fi

echo ""
echo "📌 STEP 3: ARCHITECTURE SCORE"

find "$ROOT" -type f | sort

echo ""
echo "📦 FILE COUNT: $(find "$ROOT" -type f | wc -l)"

echo ""
echo "🔍 DUPLICATE OWNERSHIP CHECK"

find "$ROOT" -type f -printf "%f\n" | sort | uniq -d

echo ""
echo "📌 STEP 4: REGISTRY UPDATE"
./tools/africctv-phase-bootstrap/registry/registry-update.sh "$PHASE" "$MODULE"

echo "📌 STEP 5: AUDIT REPORT"
./tools/africctv-phase-bootstrap/reports/audit-reporter.sh "$PHASE" "$MODULE"

echo "🔒 PHASE $PHASE RUN COMPLETE"
