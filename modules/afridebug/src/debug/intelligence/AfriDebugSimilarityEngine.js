const normalize = text =>
  String(text || "")
    .toLowerCase()
    .replace(/[^a-z0-9 ]/g, " ")
    .split(/\s+/)
    .filter(Boolean);

const score = (issue, candidate) => {
  const a = normalize(issue);
  const b = normalize(candidate);

  const common = a.filter(word => b.includes(word));

  return {
    score: a.length ? Number((common.length / a.length).toFixed(2)) : 0,
    matchedWords: common
  };
};

const AfriDebugSimilarityEngine = {

  compare(issue = "", cases = []) {

    return cases
      .map(item => {
        const result = score(issue, item.issue);

        return {
          ...item,
          similarity: result.score,
          matchedWords: result.matchedWords
        };
      })
      .sort((a, b) => b.similarity - a.similarity);

  },

  health() {

    return {
      service: "AfriDebugSimilarityEngine",
      status: "healthy"
    };

  }

};

export default AfriDebugSimilarityEngine;
