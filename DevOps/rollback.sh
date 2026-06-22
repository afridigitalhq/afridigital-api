#!/bin/bash
echo "⛔ rolling back safe state..."
git reset --hard HEAD~1
git push origin main --force
