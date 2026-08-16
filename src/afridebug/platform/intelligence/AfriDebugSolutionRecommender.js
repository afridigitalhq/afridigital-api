const AfriDebugSolutionRecommender = {

  recommend(results = []) {

    if (!results.length) {
      return {
        found: false,
        confidence: "NONE",
        recommendation: null
      };
    }

    const best = results[0];

    return {
      found: true,
      confidence:
        best.similarity >= 0.90 ? "HIGH" :
        best.similarity >= 0.60 ? "MEDIUM" :
        "LOW",
      recommendation: {
        issue: best.issue,
        resolution: best.resolution,
        similarity: best.similarity,
        verified: best.verified ?? false
      }
    };

  },

  health() {
    return {
      service: "AfriDebugSolutionRecommender",
      status: "healthy"
    };
  }

};

export default AfriDebugSolutionRecommender;
