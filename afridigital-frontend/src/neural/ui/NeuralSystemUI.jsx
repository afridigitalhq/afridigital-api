import React from "react";

export default function NeuralSystemUI({ state }) {
  return (
    <div style={{
      height: "100vh",
      background: "#05060a",
      color: "#00c2ff",
      padding: 20,
      fontFamily: "monospace"
    }}>
      <h2>NEURAL SYSTEM CONSCIOUSNESS</h2>

      <div style={{ marginTop: 20 }}>
        <h4>System Narrative</h4>
        <p>{state?.narrative}</p>
      </div>

      <div style={{ marginTop: 20 }}>
        <h4>Unified System State</h4>
        <pre>{JSON.stringify(state?.brain, null, 2)}</pre>
      </div>

      <div style={{ marginTop: 20 }}>
        <h4>Cross-System Signals</h4>
        <pre>{JSON.stringify(state?.correlations, null, 2)}</pre>
      </div>

      <div style={{ marginTop: 20 }}>
        <h4>Active Timeline Reality</h4>
        <pre>{state?.activeUniverse}</pre>
      </div>
    </div>
  );
}
