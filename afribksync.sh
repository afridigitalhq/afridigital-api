#!/bin/bash

echo "🟢 AFRIBKSYNC SNAPSHOT MODE (SAFE ADAPTER)"

BASE_DIR=~/AfriDigitalHub

cd "$BASE_DIR" || exit 1

# NO git add, NO commit, NO push
echo "📦 CAPTURING SNAPSHOT ONLY (READ-ONLY)"

TIMESTAMP=$(date +%s)

mkdir -p .snapshots

tar -czf ".snapshots/snapshot_$TIMESTAMP.tar.gz" \
  --exclude=node_modules \
  --exclude=.git \
  .

echo "🧠 SNAPSHOT CREATED: snapshot_$TIMESTAMP.tar.gz"
echo "🔐 NO EXECUTION RIGHTS (GIT DISABLED)"
echo "📊 THIS IS A BACKUP LAYER ONLY"
