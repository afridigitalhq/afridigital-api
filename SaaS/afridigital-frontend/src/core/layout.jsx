export default function Layout({ children }) {
  return (
    <div style={{
      display: "grid",
      gridTemplateColumns: "240px 1fr",
      minHeight: "100vh",
      background: "#05070f",
      color: "#fff"
    }}>
      <div style={{
        background: "rgba(255,255,255,0.04)",
        padding: 20,
        borderRight: "1px solid rgba(255,255,255,0.1)"
      }}>
        <h2>🧠 Control Plane v2</h2>
        <p style={{opacity:0.6}}>AfriDigital AI Ops</p>
      </div>

      <div style={{ padding: 20 }}>
        {children}
      </div>
    </div>
  );
}
