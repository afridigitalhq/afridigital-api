import React, { useEffect, useState } from "react";

export default function UILearningMemory() {

  const userId = "user-001";
  const [data, setData] = useState(null);

  useEffect(() => {

    const load = async () => {

      const res = await fetch(
        `https://afridigital-fmdash.onrender.com/api/ui/memory/${userId}`
      );

      const json = await res.json();
      setData(json);
    };

    load();

  }, []);

  return (
    <div style={{ padding: 20, background: "#050a18", color: "#0ff" }}>
      <h2>🧠 UI Learning Memory Engine</h2>

      <pre>{JSON.stringify(data, null, 2)}</pre>
    </div>
  );
}
