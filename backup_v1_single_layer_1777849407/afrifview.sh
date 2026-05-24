#!/bin/bash

echo "📁 AFRIDIGITAL FILE VIEWER"
echo "=============================="

echo ""
echo "🧠 FRONTEND STRUCTURE"
cd ~/AfriDigitalHub && ls -R SaaS/afridigital-frontend | head -200

echo ""
echo "🧠 UI SYSTEM STRUCTURE"
cd ~/AfriDigitalHub && ls -R ui | head -200

echo ""
echo "🧠 HERO + INDEX PREVIEW"
cd ~/AfriDigitalHub && sed -n '1,160p' SaaS/afridigital-frontend/index.html

echo ""
echo "🧠 BACKEND STRUCTURE (CORE)"
cd ~/AfriDigitalHub && ls -R SaaS/afridigital-backend | head -120

echo ""
echo "=============================="
echo "✅ AFRIFVIEW COMPLETE"
