#!/data/data/com.termux/files/usr/bin/bash

set +e

echo "🔒 Locking Redis Architecture Layer..."

# 1. FORCE SINGLE REDIS ENTRYPOINT
mkdir -p core/redis

cat > core/redis/index.js <<'EON'
const { createSafeClient } = require("./safeClient");

const client = createSafeClient();

module.exports = {
  client,
  isEnabled: !!client
};
EON

# 2. REMOVE ALL LEGACY REDIS CLIENT IMPORTS SAFELY
find core -type f -name "*.js" ! -path "*/node_modules/*" \
-exec sed -i 's|../../redisClient|../redis|g' {} \;

find core -type f -name "*.js" ! -path "*/node_modules/*" \
-exec sed -i 's|../redisClient|../redis|g' {} \;

# 3. PATCH STREAM SAFETY ONLY IF EXISTS
if [ -f core/stream/streamCore.js ]; then
  sed -i 's|await redisClient.xAdd|await redisClient?.xAdd|g' core/stream/streamCore.js
  sed -i 's|redisClient = client|const { client: redisClient } = require("../redis")|g' core/stream/streamCore.js
fi

# 4. VERIFY CLEAN STATE (NO OUTPUT FLOOD)
echo "📊 Redis references remaining:"
grep -R "redisClient" core | wc -l

echo "✅ Redis Architecture Locked"
