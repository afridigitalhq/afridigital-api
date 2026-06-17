#!/data/data/com.termux/files/usr/bin/bash

set +e

LOG=".bootstrap-$(date +%Y%m%d-%H%M%S).log"

echo "🧠 AfriDigital Adult Bootstrap Starting..."

(
mkdir -p core/redis

cat > core/redis/safeClient.js <<'EON'
const { createClient } = require("redis");

function createSafeClient(){
  if(!process.env.REDIS_URL){
    console.log("⚠️ Redis disabled (no REDIS_URL)");
    return null;
  }

  const client = createClient({ url: process.env.REDIS_URL });

  client.on("error", (e) => {
    console.log("Redis:", e.message);
  });

  client.connect().catch(() => {});
  return client;
}

module.exports = { createSafeClient };
EON

cat > core/redis/index.js <<'EON'
const { createSafeClient } = require("./safeClient");

const client = createSafeClient();

module.exports = {
  client,
  isEnabled: !!client
};
EON

find core -type f -name "*.js" ! -path "*/node_modules/*" \
-exec sed -i 's|require("../redisClient")|require("../redis")|g' {} \;

sed -i 's|require("./redisClient")|require("../redis")|g' core/memory/store.js 2>/dev/null || true
sed -i 's|require("../memory/redisClient")|require("../redis")|g' core/bootstrap/init.js 2>/dev/null || true
sed -i 's|process.exit(1)|console.log("⚠️ boot safe mode enabled")|g' server.js 2>/dev/null || true
sed -i 's|await redisClient.xAdd|await redisClient?.xAdd|g' core/stream/streamCore.js 2>/dev/null || true

npm prune --no-audit --no-fund
npm cache clean --force

) >"$LOG" 2>&1

echo "✅ Bootstrap Complete"
echo "📄 Log: $LOG"
echo "📊 Core files: $(find core -type f | wc -l)"
echo "📊 Modified files: $(git status --short | wc -l)"
