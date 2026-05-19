class EventRegistryV10 {

  constructor() {

    this.events = {

      "ledger.credit": ["userId","amount"],
      "ledger.debit": ["userId","amount"],

      "transfer.completed": [
        "from",
        "to",
        "amount"
      ],

      "settlement.finalized": [
        "txId",
        "cluster"
      ],

      "affiliate.rewarded": [
        "affiliateId",
        "reward"
      ],

      "report.requested": [
        "userId",
        "range"
      ],

      "report.generated": [
        "reportId",
        "userId"
      ],

      "pdf.generated": [
        "reportId",
        "path"
      ],

      "email.sent": [
        "to",
        "subject"
      ],

      "whatsapp.sent": [
        "to",
        "message"
      ]
    };
  }

  validate(type, payload) {

    if (!this.events[type]) {

      return {
        ok: false,
        error: "unknown_event_type"
      };
    }

    const required = this.events[type];

    for (const field of required) {

      if (!(field in payload)) {

        return {
          ok: false,
          error: "missing_field",
          field
        };
      }
    }

    return {
      ok: true
    };
  }

  snapshot() {

    return {
      ok: true,
      registeredEvents:
        Object.keys(this.events).length,
      events: Object.keys(this.events)
    };
  }
}

module.exports = new EventRegistryV10();
