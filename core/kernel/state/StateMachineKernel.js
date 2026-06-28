// AFRIKERNEL_GOVERNED_RUNTIME: ALL EXECUTION MUST FLOW VIA SYSCALLGATE
class StateMachineKernel {
  constructor({ ledger, router, validator, broadcaster }) {
    this.ledger = ledger;
    this.router = router;
    this.validator = validator;
    this.broadcaster = broadcaster;

    this.state = {
      value: "INIT"
    };

    this.transitions = new Map();
  }

  defineTransition(from, to, handler) {
    if (!this.transitions.has(from)) {
      this.transitions.set(from, []);
    }

    this.transitions.get(from).push({ to, handler });
  }

  dispatch(event) {
    const current = this.state.value;

    const possible = this.transitions.get(current) || [];

    for (const t of possible) {
      if (!this.validator || this.validator.validate(event)) {
        const nextState = t.handler(event, this.state);

        if (nextState) {
          this.state.value = t.to;

          const payload = {
            event,
            from: current,
            to: t.to,
            state: this.state
          };

          this.ledger?.append?.(payload);

          const routed = this.router?.route
            ? this.router.route(payload)
            : payload;

          this.broadcaster?.emit?.(routed);

          return { ok: true, state: t.to };
        }
      }
    }

    return { ok: false, state: current };
  }
}

module.exports = { StateMachineKernel };
