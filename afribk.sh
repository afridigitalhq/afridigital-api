#!/bin/bash

echo "📦 AFRIDIGITAL BACKUP ENGINE"

ROOT=~/AfriDigitalHub
BACKUP_DIR=~/AfriDigitalHub-Backup

mkdir -p $BACKUP_DIR

TIMESTAMP=$(date +"%Y%m%d_%H%M%S")
SNAPSHOT=$BACKUP_DIR/snapshot_$TIMESTAMP

echo "🧭 Creating snapshot: $SNAPSHOT"

rsync -av --exclude='node_modules' \
           --exclude='.git' \
           --exclude='dist' \
           --exclude='.vite' \
           --exclude='*.log' \
           $ROOT/ $SNAPSHOT/

echo "🧹 Keeping only last 3 backups..."

cd $BACKUP_DIR
ls -dt snapshot_* | tail -n +4 | xargs -r rm -rf

echo "✅ BACKUP COMPLETE"
