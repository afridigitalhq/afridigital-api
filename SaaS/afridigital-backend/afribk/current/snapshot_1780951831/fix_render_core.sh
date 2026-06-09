#!/bin/bash

FILE="server.js"

echo "🧠 CLEANING SERVER FOR SINGLE GATEWAY MODE"

# 1. Remove ALL direct AI routes if they exist
sed -i '/app.post.*api\/ai/d' $FILE
sed -i '/app.use.*apiGateway/d' $FILE
sed -i '/app.use.*streamGateway/d' $FILE

# 2. Inject CLEAN unified gateway ONCE
cat >> $FILE << 'CODE'

/* ===== UNIFIED OS ROUTER v1 (LOCKED) ===== */
const apiGateway = require('./core/gateway/apiGateway');
const streamGateway = require('./core/gateway/streamGateway');

app.use('/api', apiGateway);
app.use('/stream', streamGateway);
/* ===== END ROUTER ===== */

CODE

echo "🚀 SERVER CLEANED + UNIFIED GATEWAY RESTORED"
