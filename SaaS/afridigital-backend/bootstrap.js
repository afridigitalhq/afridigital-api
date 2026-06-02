require('./core/kernel/config/loader');

const worker = require('./core/workers/a2Worker');
const drainer = require('./core/ai/gateway/v5/runtime/a2QueueDrainer');

console.log("🧠 Bootstrapping background systems...");

worker.start?.();
drainer.start?.();

console.log("✅ Background systems ready");
