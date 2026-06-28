// AFRIKERNEL_GOVERNED_RUNTIME: ALL EXECUTION MUST FLOW VIA SYSCALLGATE

/**
 * ZERO TRUST KERNEL EXECUTION FIREWALL
 * Hard isolation between all execution layers
 */

class ZeroTrustFirewall {
  constructor({ validator, ledger }) {
    this.validator = validator;
    this.ledger = ledger;
  }

  allow(event) {
    const trusted = this.validator?.verify(event);

    if (!trusted) {
      this.ledger?.log?.({
        type: "BLOCKED_EVENT",
        reason: "ZERO_TRUST_VIOLATION",
        event
      });

      throw new Error("FIREWALL_BLOCK: Untrusted kernel event");
    }

    return true;
  }
}

module.exports = { ZeroTrustFirewall };
