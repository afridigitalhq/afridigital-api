console.log("\n🚀 AFRIDIGITAL V29 STARTING\n");

require("./redis/redis.core.cjs");
require("./queues/queue.engine.cjs");
require("./metrics/system.metrics.cjs");
require("./security/security.guard.cjs");

require("./gateway/api.gateway.cjs");

require("./wallet/wallet.service.cjs");
require("./payments/paystack.gateway.cjs");

require("./jobs/jobs.market.cjs");
require("./ads/ads.market.cjs");

require("./ai/ai.economy.cjs");

require("./whatsapp/whatsapp.bot.cjs");
require("./telegram/telegram.bot.cjs");

console.log("\n✅ V29 DISTRIBUTED AI ECONOMY ONLINE\n");
