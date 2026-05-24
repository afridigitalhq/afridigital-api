/**
 * 🧹 AFRI EVENT FILTER v1
 * - Filters events by domain (payments, whatsapp, system)
 */

class EventFilter {
  constructor() {
    this.rules = {
      payments: (e) => e.includes("PAYMENT") || e.includes("TXN"),
      whatsapp: (e) => e.includes("WHATSAPP") || e.includes("MESSAGE"),
      all: () => true
    };
  }

  match(type, eventName) {
    const rule = this.rules[type] || this.rules.all;
    return rule(eventName.toUpperCase());
  }

  filter(events, type) {
    return events.filter(e => this.match(type, e.event));
  }
}

module.exports = new EventFilter();
