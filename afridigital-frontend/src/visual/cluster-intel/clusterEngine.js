/**
 * 🧠 Cluster Intelligence Layer
 * NOT a simulation engine
 * PURE inference over existing wave field
 */

export class ClusterEngine {
  constructor() {
    this.clusterDistance = 160;
  }

  _distance(a, b) {
    const dx = a.x - b.x;
    const dy = a.y - b.y;
    return Math.sqrt(dx * dx + dy * dy);
  }

  _createCluster(id, waves) {
    let sumX = 0;
    let sumY = 0;
    let totalIntensity = 0;

    for (const w of waves) {
      sumX += w.x;
      sumY += w.y;
      totalIntensity += w.intensity || 0;
    }

    const n = waves.length;

    return {
      id,
      center: {
        x: sumX / n,
        y: sumY / n
      },
      strength: totalIntensity,
      size: n,
      velocityHint: totalIntensity / n,
      waves
    };
  }

  /**
   * Build clusters from shockwave engine output
   */
  compute(waves) {
    const visited = new Set();
    const clusters = [];

    let clusterId = 0;

    for (const wave of waves) {
      if (visited.has(wave.id)) continue;

      const group = [wave];
      visited.add(wave.id);

      for (const other of waves) {
        if (visited.has(other.id)) continue;

        if (this._distance(wave, other) < this.clusterDistance) {
          group.push(other);
          visited.add(other.id);
        }
      }

      clusters.push(this._createCluster(`cluster-${clusterId++}`, group));
    }

    return clusters;
  }
}
