const GitRepositoryAdapter = {

  normalize(repository = {}) {

    return {
      source: "git",
      repository: {
        provider: repository.provider || "unknown",
        url: repository.url || null,
        branch: repository.branch || "main",
        commit: repository.commit || null
      },
      metadata: {
        receivedAt: Date.now()
      }
    };

  }

};

export default GitRepositoryAdapter;
