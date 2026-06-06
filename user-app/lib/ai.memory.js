export class AIMemory {
  constructor() {
    this.session = {
      messages: [],
      lastIntent: null,
      lastTrace: [],
      context: {}
    };
  }

  addMessage(role, text) {
    this.session.messages.push({ role, text, time: Date.now() });
  }

  setIntent(intent) {
    this.session.lastIntent = intent;
  }

  addTrace(step) {
    this.session.lastTrace.push({
      ...step,
      time: Date.now()
    });
  }

  getContext() {
    return {
      lastIntent: this.session.lastIntent,
      lastMessages: this.session.messages.slice(-10),
      lastTrace: this.session.lastTrace.slice(-20)
    };
  }

  clearSession() {
    this.session.messages = [];
    this.session.lastIntent = null;
    this.session.lastTrace = [];
  }
}
