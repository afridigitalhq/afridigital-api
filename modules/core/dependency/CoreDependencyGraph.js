import fs from "fs";
import path from "path";

const CoreDependencyGraph = {
  build({ repository = {} } = {}) {
    const repoPath = repository.path || process.cwd();
    const packageFile = path.join(repoPath, "package.json");

    let dependencies = {};
    let devDependencies = {};

    if (fs.existsSync(packageFile)) {
      try {
        const pkg = JSON.parse(fs.readFileSync(packageFile, "utf8"));
        dependencies = pkg.dependencies || {};
        devDependencies = pkg.devDependencies || {};
      } catch {
        // Ignore malformed package.json
      }
    }

    return {
      repository,
      nodes: [
        ...Object.keys(dependencies),
        ...Object.keys(devDependencies)
      ],
      edges: [],
      dependencyCount: Object.keys(dependencies).length,
      devDependencyCount: Object.keys(devDependencies).length,
      generatedAt: new Date().toISOString(),
      status: "GRAPH_BUILT"
    };
  }
};

export default CoreDependencyGraph;
