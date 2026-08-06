const knowledge = [];

const AfriDebugKnowledgeRuntime = {

  remember(entry = {}) {
    const item = {
      id: `KNOW-${Date.now()}`,
      type: entry.type || "debug-case",
      problem: entry.problem || null,
      solution: entry.solution || null,
      verified: entry.verified || false,
      createdAt: Date.now()
    };

    knowledge.push(item);
    return item;
  },

  search(query = "") {
    return knowledge.filter(item =>
      JSON.stringify(item)
        .toLowerCase()
        .includes(query.toLowerCase())
    );
  },

  list() {
    return knowledge;
  },

  stats() {
    return {
      records: knowledge.length
    };
  }

};

export default AfriDebugKnowledgeRuntime;
