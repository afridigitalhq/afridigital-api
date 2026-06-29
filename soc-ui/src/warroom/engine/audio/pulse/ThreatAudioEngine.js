export class ThreatAudioEngine {
  constructor() {
    this.volume = 0;
  }

  pulse(level) {
    this.volume = Math.min(1, level / 100);

    return {
      beep: level > 60,
      alarm: level > 80,
      siren: level > 90,
      volume: this.volume
    };
  }
}
