export class SOCReplayEngine {
  constructor(stream = []) {
    this.timeline = stream;
    this.pointer = 0;
  }

  load(stream) {
    this.timeline = stream;
    this.pointer = stream.length;
  }

  rewind(steps = 10) {
    this.pointer = Math.max(0, this.pointer - steps);
    return this.getState();
  }

  forward(steps = 10) {
    this.pointer = Math.min(this.timeline.length, this.pointer + steps);
    return this.getState();
  }

  jumpTo(timestamp) {
    const index = this.timeline.findIndex(e => e.time === timestamp);
    if (index !== -1) this.pointer = index;
    return this.getState();
  }

  getState() {
    return this.timeline.slice(0, this.pointer);
  }
}
