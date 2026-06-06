import React, { useEffect, useState } from "react";

export default function ExecutionPipeline() {

  const [data, setData] = useState(null);

  const load = async () => {

    const res = await fetch(
      "https://afridigital-fmdash.onrender.com/api/admin/execution-pipeline"
    );

    const json = await res.json();
    setData(json);
  };

  const approve = async (item) => {

    await fetch(
      "https://afridigital-fmdash.onrender.com/api/admin/execute-insight",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ insight: item, approved: true })
      }
    );

    alert("⚙️ Insight Executed");
    load();
  };

  useEffect(() => {
    load();
  }, []);

  return (
    <div style={{ padding: 20, background: "#050a18", color: "#0ff" }}>

      <h2>🔥 Insight → Execution Pipeline</h2>

      {data?.queue?.map((item, i) => (
        <div key={i} style={{ border: "1px solid #0ff3", margin: 10, padding: 10 }}>

          <h3>{item.insight}</h3>

          <div>Score: {item.score}</div>
          <div>Priority: {item.priority}</div>

          <button onClick={() => approve(item)}>
            ✔ Approve & Execute
          </button>

        </div>
      ))}

    </div>
  );
}
