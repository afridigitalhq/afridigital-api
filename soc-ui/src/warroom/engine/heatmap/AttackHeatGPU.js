export class AttackHeatGPU {
  constructor() {
    this.intensity = 0;
  }

  computeHeat(events = []) {
    const base = events.length * 0.7;
    const anomalyBoost = events.filter(e => e.anomaly).length * 2;

    this.intensity = Math.min(100, base + anomalyBoost);

    return {
      heat: this.intensity,
      gradient: `rgba(255,0,0,${this.intensity / 100})`
    };
  }
}
