export class EventScrubber {
  constructor(events = []) {
    this.events = events;
    this.index = 0;
  }
  seek(i) {
    this.index = Math.max(0, Math.min(i, this.events.length - 1));
    return this.events[this.index];
  }
  next() { return this.seek(this.index + 1); }
  prev() { return this.seek(this.index - 1); }
}
