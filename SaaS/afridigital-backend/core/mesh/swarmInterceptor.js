/**
 * 🧠 Swarm Interceptor Layer (NON-INTRUSIVE)
 * - wraps emit/publish calls externally
 * - does NOT modify kernel
 */

class SwarmInterceptor {
  constructor(adaptiveTrust, consensus) {
    this.adaptive = adaptiveTrust;
    this.consensus = consensus;
  }

  /**
   * evaluate event BEFORE it enters system
   */
  evaluate(nodeId, event) {
    // observe first
    this.adaptive.observe(event, nodeId);

    // compute trust weight
    const weight = this.adaptive.trust.get(nodeId);

    return {
      allowed: weight > 0.25,   // soft threshold only
      weight,
      event
    };
  }

  /**
   * post-process hook (after event commit)
   */
  commit(nodeId, event) {
    this.adaptive.observe(event, nodeId);
  }
}

module.exports = SwarmInterceptor;
