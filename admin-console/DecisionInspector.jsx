import React from "react";
import useDecisionStore from "./useDecisionStore";

export default function DecisionInspector({ trace }) {
  const decisions = useDecisionStore(trace);

  if (!trace) {
    return <div style={{ opacity: 0.6 }}>Select trace to inspect decisions</div>;
  }

  return (
    <div>
      <h3>🧠 Decision Reasoning Inspector</h3>

      <div style={{ fontSize: 12, opacity: 0.7 }}>
        Decisions captured: {decisions.length}
      </div>

      <div style={{ marginTop: 15 }}>
        {decisions.map((d) => (
          <div
            key={d.id}
            style={{
              marginBottom: 12,
              padding: 10,
              borderRadius: 8,
              background: "rgba(255,255,255,0.03)",
              border: "1px solid rgba(255,255,255,0.05)"
            }}
          >
            <div style={{ color: "#00F5FF", fontSize: 12 }}>
              {d.stage}
            </div>

            <div style={{ fontWeight: "bold", marginTop: 4 }}>
              Decision: {d.decision}
            </div>

            <div style={{ fontSize: 12, opacity: 0.8, marginTop: 4 }}>
              Reason: {d.reason}
            </div>

            {d.confidence !== null && (
              <div style={{ fontSize: 12, color: "#A855F7", marginTop: 4 }}>
                Confidence: {Math.round(d.confidence * 100)}%
              </div>
            )}

            {d.alternatives?.length > 0 && (
              <div style={{ marginTop: 6, fontSize: 11, opacity: 0.7 }}>
                Alternatives:
                <ul>
                  {d.alternatives.map((a, i) => (
                    <li key={i}>{a}</li>
                  ))}
                </ul>
              </div>
            )}

            <pre style={{ fontSize: 10, marginTop: 8, opacity: 0.6 }}>
              {JSON.stringify(d.payload, null, 2)}
            </pre>
          </div>
        ))}
      </div>
    </div>
  );
}
