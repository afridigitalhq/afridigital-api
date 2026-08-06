import fs from "fs";
import path from "path";

const CoreRepositoryIntake = {
  scan(repository = {}) {
    const repoPath = repository.path || process.cwd();

    const exists = fs.existsSync(repoPath);

    const packageJson = path.join(repoPath, "package.json");

    return {
      repository,
      path: repoPath,
      exists,
      packageJson: fs.existsSync(packageJson),
      files: exists ? fs.readdirSync(repoPath).length : 0,
      scannedAt: new Date().toISOString(),
      status: "SCANNED"
    };
  }
};

export default CoreRepositoryIntake;
