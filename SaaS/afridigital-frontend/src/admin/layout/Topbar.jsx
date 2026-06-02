export default function Topbar({ traceId, status }) {
  return (
    <div style={{ height: 50, background: "#111827", color: "#fff", display: "flex", justifyContent: "space-between", padding: 10 }}>
      <div>🧠 AfriDigital Control OS</div>
      <div>Trace: {traceId || "—"} | {status}</div>
    </div>
  );
}
