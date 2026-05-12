const nodemailer = require("nodemailer");

class FinanceAlertBus {

  constructor() {

    this.emailTarget = "afridigitalhq@gmail.com";

    this.transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.ALERT_EMAIL_USER,
        pass: process.env.ALERT_EMAIL_PASS
      }
    });

    this.websocketClients = new Set();
  }

  /**
   * 🖥️ REGISTER ADMIN WEB DASHBOARD CLIENT
   */
  registerWebClient(ws) {
    this.websocketClients.add(ws);
  }

  /**
   * 📲 WHATSAPP ALERT HOOK (external integration assumed)
   */
  sendWhatsApp(alert) {
    console.log("📲 WHATSAPP ALERT:", alert);
  }

  /**
   * 🖥️ WEB DASHBOARD ALERT
   */
  sendWeb(alert) {

    for (const client of this.websocketClients) {
      try {
        client.send(JSON.stringify(alert));
      } catch (e) {}
    }
  }

  /**
   * 📧 EMAIL ALERT (CRITICAL FINANCE EVENTS)
   */
  async sendEmail(alert) {

    const mail = {
      from: "AFRIDIGITAL ALERT SYSTEM",
      to: this.emailTarget,
      subject: `🚨 Finance Alert: ${alert.type}`,
      text: JSON.stringify(alert, null, 2)
    };

    try {
      await this.transporter.sendMail(mail);
    } catch (err) {
      console.error("EMAIL ALERT FAILED:", err.message);
    }
  }

  /**
   * 🚨 MASTER DISPATCHER
   */
  async dispatch(alert) {

    const payload = {
      time: new Date().toISOString(),
      ...alert
    };

    // 📲 WhatsApp (admin ops)
    this.sendWhatsApp(payload);

    // 🖥️ Web dashboard (real-time)
    this.sendWeb(payload);

    // 📧 Email (critical financial trace)
    await this.sendEmail(payload);

    return true;
  }
}

module.exports = new FinanceAlertBus();
