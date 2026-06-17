import useAfriScan from "./hooks/useAfriScan";

export default function App() {
  const data = useAfriScan();

  if (!data) {
    return (
      <div style={{ fontFamily: "monospace", padding: 20 }}>
        Connecting to AfriScan WebSocket...
      </div>
    );
  }

  const b = data.breakdown || {};

  const panel = {
    border: "1px solid #333",
    padding: 12,
    marginBottom: 12,
    borderRadius: 6
  };

  return (
    <div style={{ fontFamily: "monospace", padding: 20 }}>

      <h1>🧠 AFRISCAN LIVE</h1>

      <div style={panel}>
        <h2>CONTROL PANEL</h2>
        <p>STATE: {data.score >= 60 ? "STABLE" : "DEGRADED"}</p>
        <p>SCORE: {data.score}/100</p>
        <p>MODE: LIVE-SAFE v2</p>
        <p>UPTIME: {data.timestamp}</p>
      </div>

      <div style={panel}>
        <h2>BREAKDOWN</h2>
        <p>Infra: {b.infra}</p>
        <p>Databases: {b.databases}</p>
        <p>Security: {b.security}</p>
        <p>AI: {b.ai}</p>
        <p>Telemetry: {b.telemetry}</p>
        <p>Core: {b.core}</p>
      </div>

      <div style={panel}>
        <h2>SYSTEM STATUS</h2>
        <p>
          {data.score >= 60
            ? "🟢 HEALTHY"
            : "⚠️ DEGRADED"}
        </p>
      </div>

    </div>
  );
}
