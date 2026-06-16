function normalize(raw) {
  return {
    ...raw,
    score: 0,
    mode: "OBS",
    version: "v3",
    brain: raw.brain || { status: "ACTIVE" },
    infra: raw.infra || {},
    databases: raw.databases || {},
    telemetry: raw.telemetry || {},
    security: raw.security || {},
    ai: raw.ai || {},
    deployments: raw.deployments || {},
    tree: raw.tree || { mode: "derived" }
  };
}

module.exports = normalize;
