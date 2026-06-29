export class SOCRewind {
  constructor(events = []) {
    this.events = events;
    this.index = 0;
  }

  play() {
    return this.events[this.index++];
  }

  reset() {
    this.index = 0;
  }

  seek(time) {
    return this.events.filter(e => e.timestamp <= time);
  }
}
