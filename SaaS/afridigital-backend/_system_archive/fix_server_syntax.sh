#!/bin/bash

FILE="server.js"

echo "🧠 FIXING BROKEN REGEX ROUTE SYNTAX"

# fix broken regex route line
sed -i "s|app.use(/api|app.use('/api'|g" $FILE

echo "🚀 SYNTAX FIXED"
