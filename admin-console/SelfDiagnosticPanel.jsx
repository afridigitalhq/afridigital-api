import React from "react";
import useSelfDiagnostic from "./useSelfDiagnostic";

export default function SelfDiagnosticPanel({ trace }) {
  const report = useSelfDiagnostic(trace);

  if (!trace) {
    return <div style={{ opacity: 0.6 }}>Select trace for diagnostics</div>;
  }

  if (!report) return null;

  return (
    <div>
      <h3>🧠 Self-Diagnostic Engine</h3>

      <div style={{
        padding: 10,
        borderRadius: 8,
        background: report.status === "healthy"
          ? "rgba(0,255,153,0.08)"
          : "rgba(255,0,80,0.08)",
        border: "1px solid rgba(255,255,255,0.08)"
      }}>
        <div style={{ fontSize: 13, fontWeight: "bold" }}>
          Status: {report.status}
        </div>

        {report.status === "healthy" && (
          <div style={{ fontSize: 12, opacity: 0.7 }}>
            {report.message}
          </div>
        )}

        {report.status === "degraded" && (
          <>
            <div style={{ marginTop: 10 }}>
              <strong>Failure Type:</strong> {report.failureType}
            </div>

            <div style={{ marginTop: 10 }}>
              <strong>Root Cause</strong>
              <pre style={{ fontSize: 11 }}>
                {JSON.stringify(report.rootCause, null, 2)}
              </pre>
            </div>

            <div style={{ marginTop: 10 }}>
              <strong>Impact</strong>
              <div style={{ fontSize: 12 }}>
                Affected events: {report.impactSummary.eventCount}
              </div>
            </div>

            <div style={{ marginTop: 10, color: "#A855F7" }}>
              <strong>Suggested Fix</strong>
              <div style={{ fontSize: 12 }}>
                {report.suggestedFix}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
