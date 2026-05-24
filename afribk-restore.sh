#!/bin/bash

BACKUP_DIR=~/AfriDigitalHub-Backup
ROOT=~/AfriDigitalHub

echo "📦 AVAILABLE SNAPSHOTS:"
ls $BACKUP_DIR

echo ""
read -p "Enter snapshot name: " SNAP

TARGET=$BACKUP_DIR/$SNAP

if [ ! -d "$TARGET" ]; then
  echo "❌ Snapshot not found"
  exit 1
fi

echo "⚠️ This will overwrite current project"
read -p "Proceed? (yes/no): " CONFIRM

if [ "$CONFIRM" != "yes" ]; then
  echo "❌ Restore cancelled"
  exit 1
fi

echo "♻️ Restoring..."

rsync -av --delete \
  --exclude='node_modules' \
  --exclude='.git' \
  $TARGET/ $ROOT/

echo "✅ RESTORE COMPLETE"
