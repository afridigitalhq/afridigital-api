const journal = require("../journal/event.journal");

class ReplayRecovery {
  rebuild(handler) {
    const events = journal.readAll();

    let state = {};

    for (const event of events) {
      state = handler(state, event);
    }

    console.log("[RECOVERY] Replay rebuild complete");

    return state;
  }
}

module.exports = new ReplayRecovery();
