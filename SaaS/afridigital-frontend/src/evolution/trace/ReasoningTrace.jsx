import React from "react";

/**
 * 🧠 AI REASONING TRACE VIEWER
 */

export default function ReasoningTrace({ proposal }) {
  if (!proposal) return null;

  return (
    <div style={box}>
      <h3>🧠 AI Reasoning Trace</h3>

      <p><b>Decision:</b> {proposal.title}</p>
      <p><b>Why:</b> {proposal.explanation}</p>

      <p><b>Risk Score:</b> {proposal.riskScore}</p>
      <p><b>Impact:</b> {proposal.impact}</p>

      <hr />

      <p><b>Diff Hint:</b></p>
      <pre>{JSON.stringify(proposal.diffHint, null, 2)}</pre>
    </div>
  );
}

const box = {
  background: "#111",
  padding: 15,
  borderRadius: 10,
  color: "#fff",
  marginTop: 10
};
