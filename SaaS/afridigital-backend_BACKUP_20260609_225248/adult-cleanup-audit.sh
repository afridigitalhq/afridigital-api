#!/data/data/com.termux/files/usr/bin/bash

echo
echo "========================================"
echo "🧠 AFRIDIGITAL ADULT CLEANUP AUDIT START"
echo "========================================"
echo

echo "📦 Creating inventory..."
find . -type f | sort > project-files.txt
echo "✔ project-files.txt generated"
echo

echo "================ REDIS / CACHE FILES ================"
find . -type f | grep -Ei 'redis|cache' || true
echo

echo "================ AI / BRAIN FILES ================"
find core -type f 2>/dev/null | grep -Ei 'brain|agent|coordinator' || true
echo

echo "================ BOOT / RUNTIME FILES ================"
find . -type f | grep -Ei 'server|bootstrap|init|runtime|kernel' || true
echo

echo "================ process.exit SCAN ================"
grep -R "process.exit" -n . 2>/dev/null || true
echo

echo "================ LOCALHOST SCAN ================"
grep -R "127.0.0.1\|localhost" -n . 2>/dev/null || true
echo

echo "================ REDIS createClient SCAN ================"
grep -R "createClient" -n . 2>/dev/null || true
echo

echo "================ FIX/PATCH FILES ================"
find . -type f | grep -Ei 'fix|patch|legacy|backup|old|temp' || true
echo

echo "================ SUMMARY ================"
echo "Inventory file: project-files.txt"
echo "Review output above for:"
echo "- duplicate redis layers"
echo "- duplicate brain implementations"
echo "- startup conflicts"
echo "- process.exit calls"
echo "- localhost assumptions"
echo "- direct redis creation"
echo "- leftover patch files"
echo
echo "✅ ADULT CLEANUP AUDIT COMPLETE"
