import fs from "fs";
import path from "path";

const LOG_FILES = [
  "error.log",
  "app.log",
  "combined.log",
  "logs/error.log",
  "logs/app.log"
];

const CoreLogCollector = {
  collect(source = {}) {
    const repoPath = source.path || process.cwd();
    const collected = [];

    for (const file of LOG_FILES) {
      const fullPath = path.join(repoPath, file);
      if (fs.existsSync(fullPath)) {
        collected.push({
          file,
          lines: fs.readFileSync(fullPath, "utf8").split("\n").length,
          size: fs.statSync(fullPath).size
        });
      }
    }

    return {
      source,
      logs: collected,
      totalLogs: collected.length,
      collectedAt: new Date().toISOString(),
      status: "COLLECTED"
    };
  }
};

export default CoreLogCollector;
