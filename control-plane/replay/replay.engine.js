class ReplayEngine {
  constructor(timeline) {
    this.timeline = timeline;
    this.pointer = 0;
  }

  seek(index) {
    this.pointer = index;
    return this.timeline[index] || null;
  }

  forward() {
    return this.seek(this.pointer + 1);
  }

  reset() {
    this.pointer = 0;
  }
}

module.exports = { ReplayEngine };
