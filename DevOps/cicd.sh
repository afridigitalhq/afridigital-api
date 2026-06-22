#!/bin/bash
set -e

echo "🚀 CI/CD START"

git add .

git commit -m "auto deploy $(date)" || echo "no changes"

git pull --rebase origin main || {
  echo "⚠️ merge conflict detected → aborting safe mode"
  git reset --hard HEAD
  exit 1
}

git push origin main

echo "✅ CI/CD SUCCESS"
