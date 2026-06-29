function buildWebGLPayload(timeline, graph, prediction) {
  return {
    nodes: graph?.nodes || [],
    edges: graph?.edges || [],
    timelineSize: timeline?.length || 0,
    risk: prediction?.risk || "LOW",
    heat: prediction?.rate || 0
  };
}

module.exports = { buildWebGLPayload };
