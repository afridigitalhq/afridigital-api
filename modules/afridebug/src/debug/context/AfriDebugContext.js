const AfriDebugContext = {

  create(data = {}) {

    return {
      developerId: data.developerId || null,
      projectId: data.projectId || null,
      repositoryId: data.repositoryId || null,
      sessionId: `DEBUG-SESSION-${Date.now()}`,
      createdAt: Date.now()
    };

  }

};

export default AfriDebugContext;
