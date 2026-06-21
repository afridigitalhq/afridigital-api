/**
 * 🌊 Shockwave Merging Engine
 * Multi-incident propagation fusion system
 *
 * Rule:
 * - nearby incidents = one wavefront
 * - collisions = reinforcement spikes
 * - decay = exponential falloff
 */

export class ShockwaveEngine {
  constructor() {
    this.waves = new Map(); // merged wavefronts
    this.mergeDistance = 120;
  }

  /**
   * Convert incident → wave candidate
   */
  _createWave(event) {
    return {
      id: event.id,
      x: event.x || Math.random() * 800,
      y: event.y || Math.random() * 600,
      radius: 10 + (event.physics?.heat || 0),
      intensity: event.physics?.heat || 10,
      vx: 0,
      vy: 0,
      alive: true
    };
  }

  /**
   * Merge logic (core fusion rule)
   */
  _shouldMerge(a, b) {
    const dx = a.x - b.x;
    const dy = a.y - b.y;
    return Math.sqrt(dx * dx + dy * dy) < this.mergeDistance;
  }

  /**
   * Merge two waves into one amplified system
   */
  _merge(a, b) {
    return {
      id: a.id + ":" + b.id,
      x: (a.x + b.x) / 2,
      y: (a.y + b.y) / 2,
      radius: Math.max(a.radius, b.radius) + 20,
      intensity: a.intensity + b.intensity,
      vx: (a.vx + b.vx) / 2,
      vy: (a.vy + b.vy) / 2,
      fused: true
    };
  }

  /**
   * Ingest WS events → build wave system
   */
  ingest(events) {
    for (const e of events) {
      const wave = this._createWave(e);

      let merged = false;

      for (const [id, existing] of this.waves.entries()) {
        if (this._shouldMerge(wave, existing)) {
          const fused = this._merge(existing, wave);
          this.waves.set(id, fused);
          merged = true;
          break;
        }
      }

      if (!merged) {
        this.waves.set(wave.id, wave);
      }
    }
  }

  /**
   * Simulation tick (shock propagation)
   */
  step() {
    for (const wave of this.waves.values()) {
      // expansion
      wave.radius += 0.8;

      // decay
      wave.intensity *= 0.985;

      // fade out
      if (wave.intensity < 1) {
        wave.alive = false;
      }
    }

    // cleanup dead waves
    for (const [id, w] of this.waves.entries()) {
      if (!w.alive) this.waves.delete(id);
    }

    return Array.from(this.waves.values());
  }
}
