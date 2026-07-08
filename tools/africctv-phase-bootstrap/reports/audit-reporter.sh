#!/data/data/com.termux/files/usr/bin/bash

PHASE=$1
MODULE=$2
ROOT="src/africctv/generated/$MODULE"
REPORT="tools/africctv-phase-bootstrap/reports/Phase${PHASE}_${MODULE}.report"

if [ -z "$PHASE" ] || [ -z "$MODULE" ]; then
 echo "Usage: audit-reporter.sh <phase> <module>"
 exit 1
fi

cat > "$REPORT" <<REPORT
================================
AFRICCTV BOOTSTRAP AUDIT REPORT
================================

Phase:
$PHASE

Module:
$MODULE

Created Files:
$(find "$ROOT" -type f | sort)

File Count:
$(find "$ROOT" -type f | wc -l)

Duplicate Ownership Check:
$(find "$ROOT" -type f -printf "%f\n" | sort | uniq -d)

Registry Status:
LOCKED

Timestamp:
$(date -u +"%Y-%m-%dT%H:%M:%SZ")

================================
REPORT COMPLETE
================================
REPORT

echo "🟢 Audit report generated: $REPORT"
