import { useAfriscanGraph } from "../graph/useAfriscanGraph";

export default function LiveGraph() {
  const nodes = useAfriscanGraph();

  return (
    <div style={{ padding: 20, color: "#00ffff", fontFamily: "monospace" }}>
      <h2>🧠 AFRISCAN LIVE GRAPH</h2>

      <div style={{ marginBottom: 10 }}>
        Nodes: {nodes.length}
      </div>

      <div style={{ maxHeight: 500, overflow: "auto" }}>
        {nodes.slice(-20).map((n) => (
          <div key={n.id} style={{ marginBottom: 8 }}>
            <div>⚡ {n.type}</div>
            <pre style={{ fontSize: 12 }}>
              {JSON.stringify(n.payload, null, 2)}
            </pre>
          </div>
        ))}
      </div>
    </div>
  );
}
