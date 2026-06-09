#!/bin/bash
export NODE_ENV=production
export PORT=${PORT:-3000}

echo "🚀 Starting AfriAi Kernel (Render Safe Mode)"
node server.js
