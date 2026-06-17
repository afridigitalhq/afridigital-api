#!/bin/bash

FILE="server.js"

echo "🧠 Cleaning server.js routing..."

# remove any old api/stream mounts
sed -i '/app.use.*\/api/d' $FILE
sed -i '/app.use.*\/stream/d' $FILE

# append clean unified routing block if missing
grep -q "UNIFIED API GATEWAY V1" $FILE

if [ $? -ne 0 ]; then
cat >> $FILE << 'ROUTE'

/* ===== UNIFIED API GATEWAY V1 ===== */
const apiGateway = require('./core/gateway/apiGateway');
const streamGateway = require('./core/gateway/streamGateway');

app.use('/api', apiGateway);
app.use('/stream', streamGateway);
/* ===== END GATEWAY ===== */

ROUTE
fi

echo "🚀 server.js patched cleanly"
