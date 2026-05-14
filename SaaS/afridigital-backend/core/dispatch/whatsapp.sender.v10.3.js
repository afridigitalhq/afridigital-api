class WhatsAppSenderV10_3 {

  constructor() {

    this.sent = [];
  }

  send(to, message) {

    const payload = {

      id:
        "WA_" + Date.now(),

      to,
      message,

      channel: "whatsapp",

      ts: Date.now(),

      status: "SENT"
    };

    this.sent.push(payload);

    return {
      ok: true,
      payload
    };
  }

  snapshot() {

    return {
      ok: true,
      sent: this.sent.length
    };
  }
}

module.exports = new WhatsAppSenderV10_3();
