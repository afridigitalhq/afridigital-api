/**
 * ⚙ A3.18.7 SCHEDULER WORKER
 * Executes scheduled jobs + integrates governor
 */

const { runScheduler } = require("../scheduler/reminder.scheduler");
const { processOutbound } = require("../governor/send.governor");
const { registerCheckin } = require("../rewards/reward.engine");

/**
 * Main worker loop
 */
function tick() {

  // 1. trigger scheduled messages
  runScheduler(Date.now());

}

/**
 * Hook event stream → WhatsApp automation
 */
function attachWhatsAppAutomation(bus) {

  bus.subscribe("LEGACY_EVENT_BLOCKED", (event) => {

    // scheduled trigger
    if (event.type === "WHATSAPP_SCHEDULE_TRIGGERED") {

      processOutbound({
        to: event.payload.userId,
        message: event.payload.message
      });
    }

    // daily reward → send WhatsApp message
    if (event.type === "DAILY_CHECKIN") {

      const rewardText = event.payload.reward
        ? `🎁 You earned: ${event.payload.reward.value}`
        : "👋 Daily check-in complete!";

      processOutbound({
        to: event.payload.userId,
        message: rewardText
      });
    }
  };
}

module.exports = { tick, attachWhatsAppAutomation };
