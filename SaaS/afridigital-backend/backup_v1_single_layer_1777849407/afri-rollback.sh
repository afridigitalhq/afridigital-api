#!/bin/bash

echo "🧯 AFRIDIGITAL EMERGENCY ROLLBACK"

BACKUP_DIR=~/AfriDigitalHub-Backup
ROOT=~/AfriDigitalHub

LAST=$(ls -t $BACKUP_DIR | head -n 1)

if [ -z "$LAST" ]; then
  echo "❌ No snapshot available"
  exit 1
fi

echo "♻️ Restoring snapshot: $LAST"

rsync -av --delete "$BACKUP_DIR/$LAST/" "$ROOT/"

echo "✅ ROLLBACK COMPLETE"
