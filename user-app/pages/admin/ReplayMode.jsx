import React, { useEffect, useState } from "react";

export default function ReplayMode() {

  const [traces, setTraces] = useState([]);
  const [index, setIndex] = useState(0);

  useEffect(() => {

    const load = async () => {

      const res = await fetch("https://afridigital-fmdash.onrender.com/api/admin/replay/traces");
      const json = await res.json();

      setTraces(json.traces);
    };

    load();

  }, []);

  const current = traces[index];

  return (
    <div style={{ display: "flex", height: "100vh", background: "#050a18", color: "#0ff" }}>

      {/* TIMELINE */}
      <div style={{ flex: 2, padding: 20 }}>
        <h2>⏪ AI Replay Engine</h2>

        <input
          type="range"
          min="0"
          max={traces.length - 1}
          value={index}
          onChange={(e) => setIndex(Number(e.target.value))}
        />

        <pre style={{ fontSize: 11 }}>
          {current ? JSON.stringify(current, null, 2) : "No data"}
        </pre>
      </div>

      {/* INSPECTOR */}
      <div style={{ flex: 1, borderLeft: "1px solid #0ff3", padding: 20 }}>
        <h3>🧠 Frame Inspector</h3>

        {current ? (
          <div>
            <div><b>Intent:</b> {current.intent}</div>
            <div><b>Trace ID:</b> {current.traceId}</div>
            <div><b>Time:</b> {new Date(current.timestamp).toLocaleTimeString()}</div>
          </div>
        ) : (
          <p>No frame selected</p>
        )}
      </div>

    </div>
  );
}
