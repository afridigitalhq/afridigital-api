import React, { useEffect, useState } from "react";

export default function CoEvolutionPanel() {

  const [data, setData] = useState(null);

  useEffect(() => {

    const load = async () => {

      const res = await fetch(
        "https://afridigital-fmdash.onrender.com/api/coevolution/insights"
      );

      const json = await res.json();
      setData(json);
    };

    load();

    const interval = setInterval(load, 5000);

    return () => clearInterval(interval);

  }, []);

  return (
    <div style={{ padding: 20, background: "#050a18", color: "#0ff" }}>
      <h2>🔥 Marketplace + UI Co-Evolution System</h2>

      <pre>{JSON.stringify(data, null, 2)}</pre>
    </div>
  );
}
