require("dotenv").config({ path: require("path").resolve(__dirname, "../../../../.env"), override: true });
require("dotenv").config();

console.log("\n🚀 AFRIDIGITAL V30 GLOBAL AI CLOUD BOOT\n");

require("../core/redis.spine.cjs");

require("../../services/render-sync/render.heartbeat.cjs");

require("../../workers/training-engine/trainer.cjs");

require("../../services/telegram-bot/bot.engine.cjs");

console.log("🧠 AI Economy Online");
console.log("💼 AfriWork Marketplace Online");
console.log("📢 Ads Marketplace Online");
console.log("💳 Wallet Economy Online");
console.log("🔴 Redis Event Spine Online");
console.log("🌐 Multi-platform AI Ecosystem Active");

console.log("\n✅ V30 FULLY OPERATIONAL\n");
