// AFRIKERNEL_GOVERNED_RUNTIME: ALL EXECUTION MUST FLOW VIA SYSCALLGATE

/**
 * CONTROL PLANE REPLAY VIEWER
 * Timeline-based system state inspector
 */

class ReplayViewer {
  constructor({ ledger }) {
    this.ledger = ledger;
  }

  getTimeline() {
    return this.ledger?.getTimeline?.() || [];
  }

  getSnapshotAt(timestamp) {
    const timeline = this.getTimeline();

    return timeline.reduce((closest, event) => {
      if (event.timestamp <= timestamp) {
        return event;
      }
      return closest;
    }, null);
  }

  scrub(from, to) {
    const timeline = this.getTimeline();

    return timeline.filter(
      (event) => event.timestamp >= from && event.timestamp <= to
    );
  }
}

module.exports = { ReplayViewer };
