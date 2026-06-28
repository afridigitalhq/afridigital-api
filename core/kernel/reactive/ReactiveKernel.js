// AFRIKERNEL_GOVERNED_RUNTIME: ALL EXECUTION MUST FLOW VIA SYSCALLGATE
class ReactiveKernel {
  constructor({ ledger, router, validator, broadcaster, policyEngine }) {
    this.ledger = ledger;
    this.router = router;
    this.validator = validator;
    this.broadcaster = broadcaster;
    this.policyEngine = policyEngine;

    this.state = { value: "INIT" };
    this.streamBuffer = [];
  }

  ingest(event) {
    this.streamBuffer.push(event);
  }

  tick() {
    const batch = this.streamBuffer.splice(0, this.streamBuffer.length);

    for (const event of batch) {

      // 1. Validate base event
      if (this.validator && !this.validator.validate(event)) {
        continue;
      }

      // 2. AI/Policy proposes mutation (NOT direct execution)
      const proposal = this.policyEngine?.evaluate
        ? this.policyEngine.evaluate(event, this.state)
        : null;

      // 3. Kernel decides final authority
      if (proposal?.mutateState) {
        this.state = proposal.nextState || this.state;
      }

      if (proposal?.mutateEvent) {
        event = proposal.event;
      }

      // 4. Persist + route
      this.ledger?.append?.({
        event,
        state: this.state,
        proposal
      });

      const routed = this.router?.route
        ? this.router.route(event)
        : event;

      this.broadcaster?.emit?.(routed);
    }
  }

  start(intervalMs = 50) {
    setInterval(() => this.tick(), intervalMs);
  }
}

module.exports = { ReactiveKernel };
