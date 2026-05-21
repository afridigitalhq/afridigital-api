/**
 * 🛡️ FRAUD CONTROL PLANE v2
 * Unified fraud orchestration layer
 */

const eventCore = require("../stable/event.core.cjs");
const fraudEngine = require("./fraud.engine.cjs");
const alerts = require("../alerts/fraud.alerts.cjs");

class FraudControlPlane {
  constructor() {
    this.active = false;
    this.threshold = 70;
  }

  start() {
    if (this.active) {
      console.log("⚠️ FRAUD CONTROL already active");
      return;
    }

    this.active = true;

    eventCore.on("PAYMENT_EVENT", async (packet) => {
      await this.handle(packet);
    });

    eventCore.on("TXN_FAIL", async (packet) => {
      await this.handle(packet);
    });

    eventCore.on("WITHDRAWAL_EVENT", async (packet) => {
      await this.handle(packet);
    });

    console.log("🛡️ FRAUD CONTROL PLANE ACTIVE");
  }

  async handle(packet) {
    try {
      const result = fraudEngine.analyze(packet);

      if (!result) return;

      console.log("🧠 FRAUD SCORE:", result.score);

      // STREAM ALERT EVENT
      eventCore.emit("FRAUD_ALERT", {
        score: result.score,
        event: packet.event,
        payload: packet.payload
      });

      // ACTIVE BLOCK MODE
      if (result.score >= this.threshold) {

        const blocked = {
          type: "FRAUD_BLOCKED",
          score: result.score,
          event: packet.event,
          payload: packet.payload,
          ts: Date.now()
        };

        console.log("⛔ FRAUD BLOCKED:", blocked.score);

        // EMIT SYSTEM EVENT
        eventCore.emit("FRAUD_BLOCKED", blocked);

        // ADMIN ALERTS
        await alerts.dispatch(blocked);
      }

    } catch (e) {
      console.log("❌ FRAUD CONTROL ERROR:", e.message);
    }
  }
}

module.exports = new FraudControlPlane();
