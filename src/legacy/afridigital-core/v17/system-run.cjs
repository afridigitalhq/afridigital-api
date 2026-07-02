require("./services/ai");
require("./services/wallet");
require("./services/jobs");
require("./services/ads");
require("./observability/render-sync");

const bot = require("./bot-engine/whatsapp-bot");

console.log("\n🚀 V17 DISTRIBUTED PRODUCTION SYSTEM ONLINE\n");

bot.receiveMessage("demo_user", "show me available jobs");
