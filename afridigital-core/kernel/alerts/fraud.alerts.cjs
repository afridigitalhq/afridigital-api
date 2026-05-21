/**
 * 🔔 FRAUD ALERT SYSTEM v2
 * - WhatsApp admin alert
 * - Email alert
 * - Webhook fanout
 */

class FraudAlerts {
  constructor() {
    this.webhooks = [];
  }

  registerWebhook(url) {
    this.webhooks.push(url);
  }

  async dispatch(alert) {
    console.log("🚨 FRAUD ALERT TRIGGERED:", alert.score);

    // 1. WhatsApp (stub)
    if (process.env.ADMIN_WHATSAPP) {
      console.log("📲 WhatsApp Alert ->", process.env.ADMIN_WHATSAPP);
    }

    // 2. Email (stub)
    if (process.env.ADMIN_EMAIL) {
      console.log("📧 Email Alert ->", process.env.ADMIN_EMAIL);
    }

    // 3. Webhooks (fanout)
    for (const url of this.webhooks) {
      console.log("🌐 Webhook ping ->", url);
    }

    return true;
  }
}

module.exports = new FraudAlerts();
