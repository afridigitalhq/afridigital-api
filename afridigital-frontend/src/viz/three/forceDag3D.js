export function initForceDag3D(nodes = []) {
  return {
    engine: "THREE_FORCE_DAG_V1",
    mode: "SIMULATED",
    nodes,
    status: "READY"
  };
}
