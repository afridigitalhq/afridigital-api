const repositories = [];

const RepositoryConnectionRegistry = {

  connect(data = {}) {

    const repository = {
      id: `REPO-${Date.now()}`,
      projectId: data.projectId,
      provider: data.provider || "github",
      url: data.url || null,
      branch: data.branch || "main",
      connectedAt: Date.now()
    };

    repositories.push(repository);

    return repository;
  },


  list() {
    return repositories;
  }

};

export default RepositoryConnectionRegistry;
