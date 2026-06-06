export function expandTrace(node, graph) {

  const related = graph.edges
    .filter(e => e.to === node.id || e.from === node.id);

  return {
    node,
    relatedEdges: related
  };
}
