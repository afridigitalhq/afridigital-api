const jobs = require("../ai-jobs/jobs.engine.cjs");
const ads = require("../ai-ads/ad.engine.cjs");

function handle(message) {
  console.log(`💬 WhatsApp Message: ${message}`);

  if (message.includes("job")) {
    console.log("💼 Jobs:", jobs.listJobs());
  }

  console.log("📢 Sponsored Ad:", ads.getAd());
}

module.exports = { handle };
