class EmailSenderV10_3 {

  constructor() {

    this.sent = [];
  }

  send(to, subject, body) {

    const payload = {

      id:
        "EMAIL_" + Date.now(),

      to,
      subject,
      body,

      channel: "email",

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

module.exports = new EmailSenderV10_3();
