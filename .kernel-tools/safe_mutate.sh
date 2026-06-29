#!/bin/bash

set -e

TARGET=$1
PATTERN=$2
REPLACE=$3

if [ -z "$TARGET" ] || [ -z "$PATTERN" ] || [ -z "$REPLACE" ]; then
  echo "usage: safe_mutate <file> <pattern> <replace>"
  exit 1
fi

if [ ! -f "$TARGET" ]; then
  echo "SKIP (missing): $TARGET"
  exit 0
fi

cp "$TARGET" "$TARGET.kbak"

perl -pi -e "s/\Q$PATTERN\E/$REPLACE/g" "$TARGET"

echo "OK: $TARGET"
