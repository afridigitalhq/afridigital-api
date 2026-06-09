function buildGraphFromLLM(llmOutput) {
  try {
    const match = llmOutput.match(/```json([\s\S]*?)```/);

    if (!match) return null;

    const graph = JSON.parse(match[1]);

    if (!graph.nodes) return null;

    return graph;

  } catch (err) {
    return null;
  }
}

module.exports = {
  buildGraphFromLLM
};
