import React, { useEffect, useState } from "react";

import PersonalizedDashboard from "./PersonalizedDashboard";
import MorphingDashboard from "./MorphingDashboard";
import CoPilot from "./CoPilot";

export default function DashboardEntry() {

  const userId = "user-001";
  const [mode, setMode] = useState(null);

  useEffect(() => {

    const load = async () => {

      const res = await fetch(
        `https://afridigital-fmdash.onrender.com/api/ui/router/${userId}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            sessions: 5,
            earnings: 120,
            jobsCreated: 1,
            actions: 15
          })
        }
      );

      const json = await res.json();
      setMode(json.mode);
    };

    load();

  }, []);

  const render = () => {

    switch (mode) {

      case "COPILOT":
        return <CoPilot />;

      case "MORPHING":
        return <MorphingDashboard />;

      case "PERSONALIZED":
        return <PersonalizedDashboard />;

      default:
        return <div style={{ color: "#0ff" }}>STATIC DASHBOARD</div>;
    }
  };

  return (
    <div style={{ background: "#050a18", minHeight: "100vh" }}>
      <h2 style={{ color: "#0ff", padding: 10 }}>
        🧠 Unified AI Dashboard Router
      </h2>

      {render()}
    </div>
  );
}
