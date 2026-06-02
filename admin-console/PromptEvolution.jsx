import React from "react";
import usePromptEvolution from "./usePromptEvolution";

export default function PromptEvolution({ trace }) {
  const steps = usePromptEvolution(trace);

  if (!trace) {
    return <div style={{ opacity: 0.6 }}>Select trace to inspect prompt evolution</div>;
  }

  return (
    <div>
      <h3>🧠 Prompt Evolution Engine</h3>

      <div style={{ fontSize: 12, opacity: 0.7 }}>
        Prompt transformations: {steps.length}
      </div>

      <div style={{ marginTop: 15 }}>
        {steps.map((s) => (
          <div
            key={s.id}
            style={{
              marginBottom: 14,
              padding: 10,
              borderRadius: 8,
              background: "rgba(255,255,255,0.03)",
              border: "1px solid rgba(255,255,255,0.05)"
            }}
          >
            <div style={{ color: "#00F5FF", fontSize: 12 }}>
              Stage: {s.stage}
            </div>

            {s.raw && (
              <div style={{ marginTop: 6 }}>
                <div style={{ fontSize: 11, opacity: 0.7 }}>Raw</div>
                <pre style={{ fontSize: 11 }}>{s.raw}</pre>
              </div>
            )}

            {s.normalized && (
              <div style={{ marginTop: 6 }}>
                <div style={{ fontSize: 11, opacity: 0.7 }}>Normalized</div>
                <pre style={{ fontSize: 11 }}>{s.normalized}</pre>
              </div>
            )}

            {s.enriched && (
              <div style={{ marginTop: 6 }}>
                <div style={{ fontSize: 11, opacity: 0.7 }}>Enriched</div>
                <pre style={{ fontSize: 11 }}>{s.enriched}</pre>
              </div>
            )}

            {s.final && (
              <div style={{ marginTop: 6 }}>
                <div style={{ fontSize: 11, opacity: 0.7 }}>Final Prompt</div>
                <pre style={{ fontSize: 11 }}>{s.final}</pre>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
