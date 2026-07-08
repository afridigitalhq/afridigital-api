#!/data/data/com.termux/files/usr/bin/bash

PHASE=$1
MODULE=$2
REGISTRY="tools/africctv-phase-bootstrap/registry/phase-registry.json"

if [ -z "$PHASE" ] || [ -z "$MODULE" ]; then
 echo "Usage: registry-update.sh <phase> <module>"
 exit 1
fi

python - "$PHASE" "$MODULE" "$REGISTRY" <<'PY'
import json
import sys
from pathlib import Path
from datetime import datetime, UTC, UTC

phase=sys.argv[1]
module=sys.argv[2]
path=Path(sys.argv[3])

data=json.loads(path.read_text())

if "completed" not in data:
    data["completed"]={}

data["completed"][phase]={
    "module": module,
    "status": "locked",
    "timestamp": datetime.now(UTC).isoformat()
}

path.write_text(json.dumps(data, indent=2))
PY

echo "🟢 Registry updated: Phase $PHASE $MODULE"
