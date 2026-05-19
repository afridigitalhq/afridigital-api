const { assertApiVersion } = require("../runtime/safety/api.guard");
const { detectIntent } = require('./afriai.router');
const AfriAIAgent = require('./afriai.agent');
const adEngine = require('./ad.engine');
const jobEngine = require('./job.engine');

const OS = require('./afrios.core');

async function dispatchMessage(text, from) {

  const intent = detectIntent(text);
  const session = OS.getSession(from);

  session.lastIntent = intent;

  OS.emit("MESSAGE_RECEIVED", { from, text, intent });

  console.log("🧭 INTENT:", intent);

  switch (intent) {

    case "ADS": {
      const ad = adEngine.getRandomAd();
      OS.addPoints(from, 5, "view_ad");

      OS.emit("AD_VIEWED", { from, ad: ad.id });

      return adEngine.buildAdCard(ad);
    }

    case "JOB": {
      OS.addPoints(from, 2, "job_search");
      OS.emit("JOB_VIEWED", { from });

      return jobEngine.generateJobResponse(text);
    }

    case "PAYMENT": {
      return `💳 AfriOS Wallet Active
Balance tracking enabled.
(Phase 4: full wallet coming)`;
    }

    case "CHAT":
    default: {
      return await AfriAIAgent(text, from);
    }
  }
}

module.exports = dispatchMessage;
