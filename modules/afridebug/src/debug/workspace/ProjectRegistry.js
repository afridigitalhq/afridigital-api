const projects = [];

const ProjectRegistry = {

  create(data = {}) {

    const project = {
      id: `PROJECT-${Date.now()}`,
      developerId: data.developerId || null,
      name: data.name || "Untitled Project",
      repository: null,
      debugRuns: 0,
      createdAt: Date.now()
    };

    projects.push(project);

    return project;
  },


  list() {
    return projects;
  }

};

export default ProjectRegistry;
