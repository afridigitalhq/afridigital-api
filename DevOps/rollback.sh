#!/bin/bash
echo "🔁 ROLLBACK INITIATED"
git reset --hard HEAD~1 || true
git push origin main --force || true
echo "🟢 ROLLBACK COMPLETE"
