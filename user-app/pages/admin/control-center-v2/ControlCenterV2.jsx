import React, { useEffect, useState } from "react";

export default function ControlCenterV2() {

  const [data, setData] = useState(null);

  useEffect(() => {

    const load = async () => {

      const res = await fetch(
        "https://afridigital-fmdash.onrender.com/api/admin/control-center"
      );

      const json = await res.json();
      setData(json);
    };

    load();
    const interval = setInterval(load, 3000);

    return () => clearInterval(interval);

  }, []);

  const action = async (path) => {

    await fetch(
      `https://afridigital-fmdash.onrender.com/api/admin/control-center/${path}`,
      { method: "POST" }
    );
  };

  return (
    <div style={{ display: "flex", height: "100vh", background: "#050a18", color: "#0ff" }}>

      {/* LEFT: FLOWGRAPH */}
      <div style={{ flex: 2, padding: 20 }}>
        <h2>🔥 FlowGraph + Prediction Fusion</h2>
        <pre style={{ fontSize: 11 }}>
          {JSON.stringify(data?.flowgraph, null, 2)}
        </pre>
      </div>

      {/* RIGHT: CONTROL PANEL */}
      <div style={{ flex: 1, padding: 20, borderLeft: "1px solid #0ff3" }}>

        <h3>🎛 Control Center</h3>

        <button onClick={() => action("pause")}>Pause Stream</button>
        <button onClick={() => action("resume")}>Resume Stream</button>

        <h4>⚠ Flag Signal</h4>
        <button onClick={() => action("flag")}>Flag</button>

        <h4>🧪 Override Decision</h4>
        <button onClick={() => action("override")}>Override</button>

        <h3>📡 Predictions</h3>
        <pre style={{ fontSize: 11 }}>
          {JSON.stringify(data?.predictions, null, 2)}
        </pre>

      </div>

    </div>
  );
}
