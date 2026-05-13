class BalanceProjector {
  apply(state, event) {
    if (!state[event.userId]) state[event.userId] = 0;

    switch (event.type) {
      case "ledger.credit":
        state[event.userId] += event.amount;
        break;

      case "ledger.debit":
        state[event.userId] -= event.amount;
        break;
    }

    return state;
  }

  rebuild(events) {
    return events.reduce((state, e) => this.apply(state, e), {});
  }
}

module.exports = new BalanceProjector();
