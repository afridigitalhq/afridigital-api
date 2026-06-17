import * as d3 from "d3-force";

export function createSimulation(nodes, links) {
  const sim = d3.forceSimulation(nodes)
    .force("link", d3.forceLink(links).id(d => d.id).distance(120))
    .force("charge", d3.forceManyBody().strength(-400))
    .force("center", d3.forceCenter(window.innerWidth / 2, window.innerHeight / 2))
    .force("collision", d3.forceCollide(30));

  return sim;
}
