import React, { useEffect, useState } from "react";

export default function GrowthEngine() {

  const [data, setData] = useState(null);

  useEffect(() => {

    const load = async () => {

      const res = await fetch(
        "https://afridigital-fmdash.onrender.com/api/marketplace/growth/analyze",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            jobs: [],
            services: []
          })
        }
      );

      const json = await res.json();
      setData(json);
    };

    load();

    const interval = setInterval(load, 4000);

    return () => clearInterval(interval);

  }, []);

  return (
    <div style={{ padding: 20, background: "#050a18", color: "#0ff", height: "100vh" }}>
      <h2>📊 Marketplace Growth Engine</h2>
      <pre>{JSON.stringify(data, null, 2)}</pre>
    </div>
  );
}
