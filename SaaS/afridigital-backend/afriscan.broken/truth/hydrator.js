function hydrate(truth = {}) {
  return {
    ...truth,

    metrics: {
      files: truth.metrics?.files ?? 0,
      listenHits: truth.metrics?.listenHits ?? 1,
      expressHits: truth.metrics?.expressHits ?? 0
    },

    brain: {
      status: truth.core?.brain?.status || "ACTIVE",
      uptime: truth.core?.uptime || 0
    },

    infra: {
      ...truth.infra,
      latency: truth.infra?.latency ?? 0,
      availability: truth.infra?.availability ?? 0
    },

    tree: truth.tree || {
      mode: "derived",
      note: "stable snapshot mode"
    },

    hydrated: true
  };
}

module.exports = hydrate;
