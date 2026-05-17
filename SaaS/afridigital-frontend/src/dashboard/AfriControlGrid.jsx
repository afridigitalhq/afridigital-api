import { useEffect, useState } from "react";
import { useV8Stream } from "../stream/v8Stream";

/**
 * 📊 A3.8 AFRI CONTROL GRID
 * Real-time system observability dashboard
 */

export default function AfriControlGrid() {
  const events = useV8Stream("wss://afridigital-api.onrender.com");
  const [metrics, setMetrics] = useState(null);

  useEffect(() => {
    const interval = setInterval(async () => {
      try {
        const res = await fetch("https://afridigital-api.onrender.com/api/system/health");
        const data = await res.json();
        setMetrics(data);
      } catch (e) {}
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div style={{ padding: 20, color: "#fff" }}>

      <h1>📊 AfriAI Control Grid (A3.8)</h1>

      {/* SYSTEM METRICS */}
      <div style={{ display: "flex", gap: 20, marginBottom: 20 }}>

        <div style={card}>
          <h3>⚙ Kernel Status</h3>
          <p>{metrics?.status || "loading..."}</p>
        </div>

        <div style={card}>
          <h3>📡 Events</h3>
          <p>{metrics?.totalEvents || 0}</p>
        </div>

        <div style={card}>
          <h3>🧠 Ingest Rate</h3>
          <p>{metrics?.ingestRate || 0}</p>
        </div>

        <div style={card}>
          <h3>⚠ Risk</h3>
          <p>{metrics?.risk || "NORMAL"}</p>
        </div>

      </div>

      {/* LIVE STREAM PANEL */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>

        <div style={panel}>
          <h2>🌐 Live Event Stream</h2>
          <div style={streamBox}>
            {events.slice(0, 30).map((e, i) => (
              <pre key={i} style={{ fontSize: 11 }}>
                {JSON.stringify(e, null, 2)}
              </pre>
            ))}
          </div>
        </div>

        <div style={panel}>
          <h2>🐕 Watchdog Alerts</h2>
          <p>System anomaly feed will appear here</p>
        </div>

      </div>

    </div>
  );
}

const card = {
  background: "#111",
  padding: 15,
  borderRadius: 10,
  flex: 1
};

const panel = {
  background: "#0a0a0a",
  padding: 15,
  borderRadius: 10
};

const streamBox = {
  maxHeight: 400,
  overflow: "auto",
  background: "#000",
  padding: 10
};
