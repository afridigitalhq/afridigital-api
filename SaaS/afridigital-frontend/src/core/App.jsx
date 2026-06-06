import { useState } from "react";
import AdminHome from "../pages/AdminHome";

export default function App() {
  const [page, setPage] = useState("home");

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "#05070f", color: "#fff" }}>
      <div style={{ width: "220px", background: "rgba(255,255,255,0.05)", padding: "20px" }}>
        <h3>🧠 Control Plane</h3>
        <button onClick={() => setPage("home")}>Home</button><br/>
        <button onClick={() => setPage("whatsapp")}>WhatsApp</button><br/>
        <button onClick={() => setPage("flow")}>FlowGraph</button><br/>
        <button onClick={() => setPage("logs")}>Logs</button>
      </div>

      <div style={{ flex: 1, padding: "20px" }}>
        {page === "home" && <AdminHome />}
        {page !== "home" && <div>🚧 Module coming in v1 expansion</div>}
      </div>
    </div>
  );
}
