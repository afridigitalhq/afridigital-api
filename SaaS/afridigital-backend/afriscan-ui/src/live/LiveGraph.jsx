import { useEffect, useState } from "react";
import { connectAfriscan } from "./ws.client";

export default function LiveGraph() {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    const ws = connectAfriscan(setEvents);
    return () => ws.close();
  }, []);

  return (
    <div style={{
      background: "#0b0f1a",
      color: "white",
      height: "100vh",
      padding: 20,
      fontFamily: "monospace"
    }}>
      <h2>🧠 AFRISCAN LIVE CONTROL TOWER</h2>

      <div style={{ marginTop: 20 }}>
        {events.map((e, i) => (
          <div key={i} style={{
            padding: 10,
            marginBottom: 8,
            border: "1px solid #1f2a44",
            borderRadius: 8
          }}>
            <div>🔵 TYPE: {e.type}</div>
            <div style={{ fontSize: 12, opacity: 0.7 }}>
              {JSON.stringify(e.payload)}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
