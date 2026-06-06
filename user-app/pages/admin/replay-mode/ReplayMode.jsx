import React, { useEffect, useState } from "react";

export default function ReplayMode() {

  const [data, setData] = useState(null);

  const load = async () => {

    const res = await fetch(
      "https://afridigital-fmdash.onrender.com/api/admin/replay"
    );

    const json = await res.json();
    setData(json);
  };

  useEffect(() => {
    load();
  }, []);

  return (
    <div style={{ padding: 20, background: "#050a18", color: "#0ff" }}>

      <h2>⏪ Admin Decision Replay Mode</h2>

      {data?.traces?.map((t, i) => (
        <div
          key={i}
          style={{
            border: "1px solid #0ff3",
            margin: 10,
            padding: 10
          }}
        >

          <h3>🧠 Trace #{t.traceId}</h3>

          <div>⏱ {t.timestamp}</div>

          <h4>📥 Input Event</h4>
          <pre>{JSON.stringify(t.inputEvent, null, 2)}</pre>

          <h4>🧠 AI Outputs</h4>
          <pre>{JSON.stringify(t.agentOutputs, null, 2)}</pre>

          <h4>📊 Ranked Insights</h4>
          <pre>{JSON.stringify(t.rankedInsights, null, 2)}</pre>

          <h4>⚙️ Execution</h4>
          <pre>{JSON.stringify(t.executionAction, null, 2)}</pre>

          <h4>🔁 State Change</h4>
          <pre>{JSON.stringify({
            before: t.beforeState,
            after: t.afterState
          }, null, 2)}</pre>

        </div>
      ))}

    </div>
  );
}
