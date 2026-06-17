export class DagReplayEngine {
  constructor(events = []) {
    this.events = events;
    this.index = 0;
    this.playing = false;
  }

  play(callback) {
    this.playing = true;

    const step = () => {
      if (!this.playing || this.index >= this.events.length) return;

      callback(this.events[this.index]);
      this.index++;

      setTimeout(step, 500);
    };

    step();
  }

  pause() {
    this.playing = false;
  }

  reset() {
    this.index = 0;
  }
}
