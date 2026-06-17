export class LiveReplayEngine {
  constructor() {
    this.history = [];
    this.index = 0;
  }

  push(event) {
    this.history.push(event);
  }

  seek(i) {
    this.index = Math.max(0, Math.min(i, this.history.length - 1));
    return this.history[this.index];
  }

  latest() {
    return this.history[this.history.length - 1];
  }
}
