export default function App() {
  return (
    <div style={{
      minHeight:"100vh",
      background:"#050b1f",
      color:"#fff",
      fontFamily:"Inter,sans-serif",
      padding:"24px"
    }}>
      <h1>AfriDigital Command Center</h1>
      <p>Real-Time Intelligence • Infrastructure • Operations</p>

      <div style={{
        display:"grid",
        gridTemplateColumns:"repeat(6,1fr)",
        gap:"16px",
        marginTop:"24px"
      }}>
        {[
          "Active Users",
          "AI Events",
          "Worker Jobs",
          "WhatsApp",
          "System Health",
          "Response Time"
        ].map(item=>(
          <div key={item}
            style={{
              background:"#0b1430",
              border:"1px solid rgba(255,255,255,.08)",
              borderRadius:"16px",
              padding:"20px"
            }}>
            <h3>{item}</h3>
            <h2>0</h2>
          </div>
        ))}
      </div>
    </div>
  );
}
