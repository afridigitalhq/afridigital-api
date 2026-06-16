#!/usr/bin/env bash

DIR="core/execution-compiler/snapshots"
FILE="snapshot_$(date +%Y%m%d_%H%M%S).log"

node core/execution-compiler/bootstrap.sh > "$DIR/$FILE"

ls -t "$DIR" | tail -n +4 | xargs -I {} rm -f "$DIR/{}" 2>/dev/null
