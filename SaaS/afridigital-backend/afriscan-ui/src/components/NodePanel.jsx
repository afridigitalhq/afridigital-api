export default function NodePanel({ snapshot }) {
  if (!snapshot) return <div>Loading AFRISCAN...</div>;

  return (
    <div style={{ padding: 20, fontFamily: "monospace", color: "#00f5ff" }}>
      <h2>🧠 AFRISCAN LIVE CONTROL TOWER</h2>

      <h3>📦 Runtime</h3>
      <pre>{JSON.stringify(snapshot.runtime, null, 2)}</pre>

      <h3>🧬 Dependencies</h3>
      <pre>{JSON.stringify(snapshot.dependencies, null, 2)}</pre>

      <h3>⚡ Health Score</h3>
      <h1>{snapshot.health}/100</h1>
    </div>
  );
}
