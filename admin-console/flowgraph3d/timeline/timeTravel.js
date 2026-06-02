export class TimeTravel {
  constructor() {
    this.snapshots = [];
    this.currentIndex = -1;
  }

  record(event) {
    this.snapshots.push({
      t: Date.now(),
      event
    });
  }

  seek(index) {
    this.currentIndex = Math.max(0, Math.min(index, this.snapshots.length - 1));
    return this.snapshots[this.currentIndex];
  }

  replay(from = 0, to = this.snapshots.length) {
    return this.snapshots.slice(from, to);
  }

  latest() {
    return this.snapshots[this.snapshots.length - 1];
  }
}
