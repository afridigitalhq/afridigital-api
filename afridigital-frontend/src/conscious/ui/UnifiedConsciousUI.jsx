import React from "react";

export default function UnifiedConsciousUI({ brain, obs }) {
  return (
    <div style={{ display: "grid", gridTemplateColumns: "260px 1fr 320px", height: "100vh", background: "#05060a", color: "#00c2ff" }}>

      {/* SIDEBAR OBS MODULES */}
      <div style={{ borderRight: "1px solid #111", padding: 10 }}>
        <h3>OBS MODULES</h3>
        <ul>
          <li>Payment OBS</li>
          <li>AfriAI OBS</li>
          <li>User Control OBS</li>
          <li>WhatsApp Stream OBS</li>
          <li>Ads + Commerce OBS</li>
        </ul>
      </div>

      {/* CENTER: CONSCIOUS CORE */}
      <div style={{ padding: 10 }}>
        <h2>SYSTEM CONSCIOUSNESS CORE</h2>

        <div style={{ marginTop: 10 }}>
          <p>{brain?.narrative?.narrative}</p>
        </div>

        <div style={{ marginTop: 20 }}>
          <h4>System State</h4>
          <pre>{JSON.stringify(brain?.brain, null, 2)}</pre>
        </div>
      </div>

      {/* RIGHT: LIVE OPS FEED */}
      <div style={{ borderLeft: "1px solid #111", padding: 10 }}>
        <h3>LIVE OPS FEED</h3>
        <pre>{JSON.stringify(obs, null, 2)}</pre>
      </div>

    </div>
  );
}
