import React from "react";
import useAutoFixEngine from "./useAutoFixEngine";
import useSelfDiagnostic from "./useSelfDiagnostic";

export default function AutoFixPanel({ trace }) {
  const diagnosis = useSelfDiagnostic(trace);
  const fix = useAutoFixEngine(trace, diagnosis);

  if (!trace) return <div>Select trace</div>;
  if (!fix) return <div>No fix required</div>;

  return (
    <div>
      <h3>🔴 Autonomous Fix Engine (Guarded Mode)</h3>

      <div style={{
        padding: 10,
        borderRadius: 8,
        border: "1px solid rgba(255,255,255,0.1)",
        background: "rgba(255,0,80,0.05)"
      }}>
        <div><b>Mode:</b> {fix.mode}</div>
        <div><b>Risk Level:</b> {fix.riskLevel}</div>

        <div style={{ marginTop: 10 }}>
          <b>Proposed Patch</b>
          <pre style={{ fontSize: 12 }}>
            {JSON.stringify(fix.patch, null, 2)}
          </pre>
        </div>

        <div style={{ marginTop: 10 }}>
          <b>Explanation</b>
          <div style={{ fontSize: 12 }}>
            {fix.explanation}
          </div>
        </div>

        {fix.requiresApproval && (
          <div style={{ marginTop: 10, color: "#FF4D6D" }}>
            ⚠️ Requires manual approval before execution
          </div>
        )}
      </div>
    </div>
  );
}
