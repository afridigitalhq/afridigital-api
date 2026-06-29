export class SOCReplayEngine {
  constructor(events) {
    this.events = events;
    this.timeIndex = 0;
    this.frozen = false;
  }

  tick() {
    if (this.frozen) return this.events[this.timeIndex];

    return this.events[this.timeIndex++];
  }

  freeze() {
    this.frozen = true;
  }

  rewind(step = 10) {
    this.timeIndex = Math.max(0, this.timeIndex - step);
  }
}
