// AFRIKERNEL_GOVERNED_RUNTIME: ALL EXECUTION MUST FLOW VIA SYSCALLGATE
class KernelConsensusProtocol {
  constructor({ kernels = {} }) {
    this.kernels = kernels;

    this.weights = {
      syscall: 0.40,
      replay: 0.30,
      simulation: 0.20,
      intelligence: 0.10
    };

    this.threshold = 0.65;
  }

  // Collect proposals from all kernels
  collect(event) {
    const proposals = [];

    for (const [name, kernel] of Object.entries(this.kernels)) {
      if (!kernel?.analyze) continue;

      const proposal = kernel.analyze(event);

      if (proposal) {
        proposals.push({
          ...proposal,
          kernel: name
        });
      }
    }

    return proposals;
  }

  // Compute weighted consensus
  decide(proposals) {
    let score = 0;
    let totalWeight = 0;

    for (const p of proposals) {
      const w = this.weights[p.kernel] || 0;

      score += (p.confidence || 0) * w;
      totalWeight += w;
    }

    const normalized = totalWeight > 0 ? score / totalWeight : 0;

    return {
      consensus: normalized >= this.threshold,
      score: normalized,
      threshold: this.threshold,
      status:
        normalized >= this.threshold
          ? "AGREED"
          : "DEFERRED"
    };
  }

  // Full KCP cycle
  evaluate(event) {
    const proposals = this.collect(event);

    const decision = this.decide(proposals);

    return {
      event,
      proposals,
      decision
    };
  }
}

module.exports = { KernelConsensusProtocol };
