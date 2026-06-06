import React, { useEffect, useState } from "react";

export default function AdminConsole() {

  const [data, setData] = useState(null);

  useEffect(() => {

    const load = async () => {

      const res = await fetch(
        "https://afridigital-fmdash.onrender.com/api/admin/console"
      );

      const json = await res.json();
      setData(json);
    };

    load();
    const interval = setInterval(load, 3000);

    return () => clearInterval(interval);

  }, []);

  return (
    <div style={{
      display: "grid",
      gridTemplateColumns: "1fr 1fr 1fr",
      height: "100vh",
      background: "#050a18",
      color: "#0ff"
    }}>

      {/* FLOWGRAPH */}
      <div style={{ padding: 10, borderRight: "1px solid #0ff3" }}>
        <h3>🔥 FlowGraph</h3>
        <pre style={{ fontSize: 10 }}>
          {JSON.stringify(data?.flowgraph, null, 2)}
        </pre>
      </div>

      {/* POLICY + PREDICTION */}
      <div style={{ padding: 10, borderRight: "1px solid #0ff3" }}>
        <h3>🧭 Policy + Predictions</h3>
        <pre style={{ fontSize: 10 }}>
          {JSON.stringify(data?.policy, null, 2)}
        </pre>

        <h4>📡 Live Predictions</h4>
        <pre style={{ fontSize: 10 }}>
          {JSON.stringify(data?.predictions, null, 2)}
        </pre>
      </div>

      {/* CONTROL CENTER */}
      <div style={{ padding: 10 }}>
        <h3>🎛 Control Center</h3>

        <button>Pause Stream</button>
        <button>Resume Stream</button>
        <button>Flag Signal</button>
        <button>Override Decision</button>

        <h4>🧠 System Mode</h4>
        <pre style={{ fontSize: 10 }}>
          {data?.control?.systemMode}
        </pre>
      </div>

    </div>
  );
}
