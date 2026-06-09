import { useGraph } from "../graph/useGraph";

export default function GraphView() {
  const nodes = useGraph();

  return (
    <div style={{
      padding: 20,
      background: "#0a0f1f",
      color: "#00ffe1",
      height: "100vh",
      fontFamily: "monospace"
    }}>
      <h2>🧠 AFRISCAN CONTROL TOWER</h2>

      <div style={{ marginTop: 20 }}>
        {nodes.map((n) => (
          <div key={n.id} style={{
            padding: 10,
            marginBottom: 8,
            border: "1px solid #1f2a44",
            borderRadius: 6,
            background: "#0e162b"
          }}>
            <div>⚡ TYPE: {n.type}</div>
            <div>📦 DATA: {JSON.stringify(n.payload)}</div>
            <div style={{ fontSize: 10, opacity: 0.6 }}>
              {new Date(n.ts).toLocaleTimeString()}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
