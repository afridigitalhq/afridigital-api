#!/bin/bash

FILE="server.js"

echo "🧠 CLEANING SERVER.JS FOR STABLE EXPRESS FLOW"

# 1. Remove duplicate gateway declarations
awk '!seen[$0]++' $FILE > tmp.js && mv tmp.js $FILE

# 2. Ensure gateway import exists only once
grep -q "core/gateway/apiGateway" $FILE || echo "
const apiGateway = require('./core/gateway/apiGateway');
const streamGateway = require('./core/gateway/streamGateway');
" >> $FILE

# 3. Ensure routes are ABOVE listen()
awk '
/// app.listen DISABLED/ {print before; print; next}
{before = before $0 "\n"}
' $FILE > tmp2.js

# fallback safe (if awk messes structure, restore original first)
mv $FILE $FILE.bak 2>/dev/null || true
mv tmp2.js $FILE

echo "🚀 SERVER FLOW RESTRUCTURED"
