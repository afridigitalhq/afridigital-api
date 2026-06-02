import React from "react";
import useReplayEngine from "./useReplayEngine";

export default function TraceReplay({ trace }) {
  const replay = useReplayEngine(trace);

  if (!trace) {
    return <div style={{ opacity: 0.6 }}>Select trace to replay</div>;
  }

  return (
    <div>
      <h3>🔁 Trace Replay Engine</h3>

      <div style={{ marginBottom: 10 }}>
        <button onClick={replay.play}>▶ Play</button>
        <button onClick={replay.pause}>⏸ Pause</button>
        <button onClick={replay.step}>⏭ Step</button>
        <button onClick={replay.reset}>🔄 Reset</button>
      </div>

      <div style={{ fontSize: 12, opacity: 0.7 }}>
        Step: {replay.index + 1} / {replay.events.length}
      </div>

      <div style={{ marginTop: 15 }}>
        {replay.currentEvent ? (
          <div style={{
            padding: 10,
            border: "1px solid rgba(255,255,255,0.1)",
            borderRadius: 8,
            background: "rgba(0,0,0,0.3)"
          }}>
            <div style={{ color: "#00F5FF" }}>
              {replay.currentEvent.type}
            </div>

            <div style={{ opacity: 0.7 }}>
              {replay.currentEvent.stage}
            </div>

            <pre style={{ fontSize: 11 }}>
              {JSON.stringify(replay.currentEvent.payload, null, 2)}
            </pre>
          </div>
        ) : (
          <div style={{ opacity: 0.6 }}>
            No event loaded
          </div>
        )}
      </div>
    </div>
  );
}
