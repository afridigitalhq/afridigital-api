const DeveloperWorkspace = {

  create(data = {}) {

    return {
      id: `DEV-${Date.now()}`,
      name: data.name || "Anonymous Developer",
      projects: [],
      repositories: [],
      plan: "free",
      credits: 10,
      createdAt: Date.now()
    };

  }

};

export default DeveloperWorkspace;
