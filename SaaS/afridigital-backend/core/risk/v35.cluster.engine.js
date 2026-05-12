const { assertApiVersion } = require("../runtime/safety/api.guard");
const crypto = require("crypto");

let VectorEngine = null;
try {
  VectorEngine = require("../../workers/vector-engine");
} catch (e) {
  VectorEngine = null;
}

class ClusterEngineV35 {
  constructor() {
    this.clusters = new Map();     // clusterId → vectors
    this.userClusterMap = new Map();
    this.threshold = 0.65;         // similarity threshold
  }

  // -----------------------------
  // VECTORIZE SIGNAL
  // -----------------------------
  vectorize(features) {
    return [
      features.amount || 0,
      features.highValue || 0,
      features.deviceMismatch || 0,
      features.geoRisk || 0,
      features.isDebit || 0,
      features.hour || 0
    ];
  }

  // -----------------------------
  // COSINE SIMILARITY
  // -----------------------------
  similarity(a, b) {
    let dot = 0, magA = 0, magB = 0;

    for (let i = 0; i < a.length; i++) {
      dot += a[i] * b[i];
      magA += a[i] * a[i];
      magB += b[i] * b[i];
    }

    magA = Math.sqrt(magA);
    magB = Math.sqrt(magB);

    if (magA === 0 || magB === 0) return 0;

    return dot / (magA * magB);
  }

  // -----------------------------
  // ASSIGN TO CLUSTER
  // -----------------------------
  assignCluster(userId, vector) {
    let bestCluster = null;
    let bestScore = 0;

    for (const [clusterId, members] of this.clusters.entries()) {
      const avgVector = this.averageVector(members);
      const score = this.similarity(vector, avgVector);

      if (score > bestScore) {
        bestScore = score;
        bestCluster = clusterId;
      }
    }

    if (bestScore >= this.threshold) {
      this.clusters.get(bestCluster).push(vector);
      this.userClusterMap.set(userId, bestCluster);
      return { clusterId: bestCluster, similarity: bestScore };
    }

    // create new cluster
    const newId = crypto.randomUUID();
    this.clusters.set(newId, [vector]);
    this.userClusterMap.set(userId, newId);

    return { clusterId: newId, similarity: 1.0 };
  }

  // -----------------------------
  // AVERAGE VECTOR
  // -----------------------------
  averageVector(vectors) {
    const len = vectors[0].length;
    const avg = new Array(len).fill(0);

    for (const v of vectors) {
      for (let i = 0; i < len; i++) {
        avg[i] += v[i];
      }
    }

    return avg.map(x => x / vectors.length);
  }

  // -----------------------------
  // ANOMALY DETECTION
  // -----------------------------
  detectAnomaly(vector, clusterAvg) {
    const sim = this.similarity(vector, clusterAvg);

    return {
      anomalyScore: 1 - sim,
      isAnomaly: sim < 0.4
    };
  }

  // -----------------------------
  // MAIN ENTRY
  // -----------------------------
  evaluate(userId, features) {
    const vector = this.vectorize(features);

    const clusterResult = this.assignCluster(userId, vector);
    const clusterVectors = this.clusters.get(clusterResult.clusterId);
    const clusterAvg = this.averageVector(clusterVectors);

    const anomaly = this.detectAnomaly(vector, clusterAvg);

    const result = {
      userId,
      clusterId: clusterResult.clusterId,
      similarity: clusterResult.similarity,
      anomalyScore: anomaly.anomalyScore,
      isAnomaly: anomaly.isAnomaly,
      ts: Date.now()
    };

    // optional vector engine persistence
    if (VectorEngine) {
      try {
        VectorEngine.store({
          type: "FRAUD_CLUSTER",
          vector,
          clusterId: result.clusterId,
          ts: result.ts
        });
      } catch (e) {}
    }

    return result;
  }

  getClusters() {
    return Object.fromEntries(
      [...this.clusters.entries()].map(([k, v]) => [k, v.length])
    );
  }

  getUserCluster(userId) {
    return this.userClusterMap.get(userId) || null;
  }
}

module.exports = new ClusterEngineV35();
