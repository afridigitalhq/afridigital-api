import { useV8Stream } from "../stream/v8Stream";

export default function LiveStream() {
  const events = useV8Stream();

  return (
    <div style={{ padding: 20 }}>
      <h1>🌐 A3 STREAM BRIDGE (LIVE)</h1>

      <div style={{
        maxHeight: 520,
        overflow: "auto",
        background: "#0b0b0b",
        padding: 12,
        borderRadius: 8
      }}>
        {events.map((e, i) => (
          <pre key={i} style={{ color: "#00ff88", fontSize: 12 }}>
            {JSON.stringify(e, null, 2)}
          </pre>
        ))}
      </div>
    </div>
  );
}
