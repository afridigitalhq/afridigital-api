#!/bin/bash

echo "🧠 AFRAI FULL EXECUTION TRACE START"

URL="https://afridigital-api.onrender.com/webhook"

echo ""
echo "📡 STEP 1: Trigger webhook"
curl -s -X POST "$URL" \
-H "Content-Type: application/json" \
-d '{
  "entry":[{
    "changes":[{
      "value":{
        "messages":[{
          "from":"TRACE_ENGINE",
          "text":{"body":"FULL LOOP DIAGNOSTIC"}
        }]
      }
    }]
  }]
}'

echo ""
echo "📊 STEP 2: Root health check"
curl -s https://afridigital-api.onrender.com/ | jq .

echo ""
echo "🧪 STEP 3: Expected logs (CHECK RENDER DASHBOARD):"
echo "   - 🔥 WEBHOOK HIT"
echo "   - 📥 INCOMING"
echo "   - 🚀 CALLING PROCESSJOB"
echo "   - 📤 META SUCCESS"

echo ""
echo "✅ TRACE COMPLETE"
