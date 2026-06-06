import React, { useEffect, useState } from "react";

export default function AppShell({ children }) {

  const [layout, setLayout] = useState(null);

  const user = { id: "demo-user", history: ["wallet", "jobs"] };

  useEffect(() => {

    fetch("https://afridigital-fmdash.onrender.com/api/layout/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        user,
        feed: []
      })
    })
      .then(res => res.json())
      .then(data => setLayout(data.layout))
      .catch(() => setLayout(null));

  }, []);

  return (
    <div className="app-shell">

      {/* SIDEBAR */}
      <aside className="sidebar">
        {layout?.sidebar?.map(item => (
          <div key={item} className="nav-item">
            {item.toUpperCase()}
          </div>
        ))}
      </aside>

      {/* MAIN GRID */}
      <main className="main-grid">
        {children}
      </main>

    </div>
  );
}
