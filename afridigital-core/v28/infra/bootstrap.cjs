console.log("\n🚀 V28 DISTRIBUTED MICROSERVICE SYSTEM STARTING\n");

require("../services/wallet/wallet.service.cjs");
require("../services/ads/ads.service.cjs");
require("../services/jobs/jobs.service.cjs");
require("../services/ai/ai.service.cjs");

const app = require("../gateway/api.gateway.cjs");

app.listen(3000, () => {
  console.log("🌐 GATEWAY RUNNING ON PORT 3000");
});
