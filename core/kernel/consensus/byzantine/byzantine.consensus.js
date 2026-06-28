// AFRIKERNEL_GOVERNED_RUNTIME: ALL EXECUTION MUST FLOW VIA SYSCALLGATE

/**
 * BYZANTINE FAULT TOLERANT CONSENSUS LAYER
 * Ensures majority-valid kernel state agreement
 */

class ByzantineConsensus {
  constructor({ nodes }) {
    this.nodes = nodes || [];
  }

  propose(state) {
    return this._gatherVotes(state);
  }

  _gatherVotes(state) {
    const votes = this.nodes.map(n => ({
      node: n.id,
      vote: n.validate?.(state) ?? false
    }));

    const approved = votes.filter(v => v.vote === true).length;
    const required = Math.ceil(this.nodes.length * 2 / 3);

    return {
      approved,
      required,
      accepted: approved >= required,
      votes
    };
  }
}

module.exports = { ByzantineConsensus };
