import fs from "fs";
import os from "os";
import path from "path";
import { spawnSync } from "child_process";

const GITHUB_HOST = "github.com";
const BRANCH_PATTERN = /^[A-Za-z0-9._\/-]+$/;

function parsePublicGitHubRepositoryUrl(value) {
  if (!value || typeof value !== "string") {
    return { ok: false, error: "REPOSITORY_URL_REQUIRED" };
  }

  let parsed;

  try {
    parsed = new URL(value);
  } catch {
    return { ok: false, error: "REPOSITORY_URL_INVALID" };
  }

  if (
    parsed.protocol !== "https:" ||
    parsed.hostname !== GITHUB_HOST ||
    parsed.username ||
    parsed.password ||
    parsed.search ||
    parsed.hash
  ) {
    return { ok: false, error: "REPOSITORY_URL_NOT_ALLOWED" };
  }

  const parts = parsed.pathname
    .replace(/^\/+|\/+$/g, "")
    .split("/")
    .filter(Boolean);

  if (parts.length !== 2) {
    return { ok: false, error: "REPOSITORY_URL_NOT_ALLOWED" };
  }

  const owner = parts[0];
  const repository = parts[1].replace(/\.git$/, "");

  if (!owner || !repository) {
    return { ok: false, error: "REPOSITORY_URL_NOT_ALLOWED" };
  }

  return {
    ok: true,
    normalizedUrl: `https://${GITHUB_HOST}/${owner}/${repository}.git`
  };
}

const AfriDebugRepositoryAcquisitionWorker = {
  execute(input = {}) {
    const repository = input.repository || {};
    const type = String(repository.type || input.type || "").toLowerCase();

    if (type !== "remote") {
      return {
        acquired: false,
        repository
      };
    }

    const parsed = parsePublicGitHubRepositoryUrl(
      repository.url || input.url
    );

    if (!parsed.ok) {
      return {
        acquired: false,
        status: "ACQUISITION_FAILED",
        error: parsed.error
      };
    }

    const branch = repository.branch || input.branch || "main";

    if (!BRANCH_PATTERN.test(branch) || branch.startsWith("-")) {
      return {
        acquired: false,
        status: "ACQUISITION_FAILED",
        error: "REPOSITORY_BRANCH_INVALID"
      };
    }

    const workspace = fs.mkdtempSync(
      path.join(os.tmpdir(), "afridebug-repository-")
    );

    const repositoryPath = path.join(workspace, "repository");

    const result = spawnSync(
      "git",
      [
        "-c",
        "advice.detachedHead=false",
        "clone",
        "--depth",
        "1",
        "--single-branch",
        "--branch",
        branch,
        parsed.normalizedUrl,
        repositoryPath
      ],
      {
        stdio: ["ignore", "ignore", "pipe"],
        encoding: "utf8",
        timeout: 120000
      }
    );

    if (result.error || result.status !== 0) {
      fs.rmSync(workspace, { recursive: true, force: true });

      return {
        acquired: false,
        status: "ACQUISITION_FAILED",
        error: "REPOSITORY_CLONE_FAILED"
      };
    }

    return {
      acquired: true,
      status: "ACQUISITION_COMPLETED",
      repository: {
        ...repository,
        path: repositoryPath,
        repositoryPath,
        connected: true
      },
      cleanupPath: workspace
    };
  },

  cleanup(cleanupPath) {
    if (!cleanupPath) return;

    fs.rmSync(cleanupPath, {
      recursive: true,
      force: true
    });
  }
};

export default AfriDebugRepositoryAcquisitionWorker;
