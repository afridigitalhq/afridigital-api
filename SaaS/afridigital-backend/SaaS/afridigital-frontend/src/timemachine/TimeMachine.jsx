import { useEffect, useState } from "react";
import { useV8Stream } from "../stream/v8Stream";

/**
 * 🧠 A3.9 AFRI TIME MACHINE UI
 * Event replay + timeline scrubber system
 */

export default function TimeMachine() {
  const events = useV8Stream("wss://afridigital-api.onrender.com");
  const [selected, setSelected] = useState(null);

  return (
    <div style={{ padding: 20, color: "#fff" }}>

      <h1>🧠 AfriAI Time Machine (A3.9)</h1>

      {/* SCRUBBER */}
      <div style={scrubber}>
        <p>⏳ Timeline Scrubber (latest → oldest)</p>
        <input
          type="range"
          min="0"
          max={events.length}
          onChange={(e) => setSelected(events[e.target.value])}
          style={{ width: "100%" }}
        />
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>

        {/* TIMELINE */}
        <div style={panel}>
          <h2>📜 Event Timeline</h2>

          <div style={logBox}>
            {events.map((e, i) => (
              <div
                key={i}
                style={eventCard}
                onClick={() => setSelected(e)}
              >
                <b>{e.type}</b>
                <pre>{JSON.stringify(e.payload, null, 2)}</pre>
              </div>
            ))}
          </div>
        </div>

        {/* REPLAY PANEL */}
        <div style={panel}>
          <h2>🎬 Replay Inspector</h2>

          {selected ? (
            <div>
              <h3>Event Type: {selected.type}</h3>
              <pre>{JSON.stringify(selected, null, 2)}</pre>

              <hr />

              <p>🧠 Interpretation Layer:</p>
              <p style={{ opacity: 0.8 }}>
                This event represents a system transition in the AfriAI kernel.
                It can be replayed for debugging or audit tracing.
              </p>
            </div>
          ) : (
            <p>Select an event to inspect replay</p>
          )}
        </div>

      </div>
    </div>
  );
}

const panel = {
  background: "#0a0a0a",
  padding: 15,
  borderRadius: 10
};

const logBox = {
  maxHeight: 500,
  overflow: "auto"
};

const eventCard = {
  background: "#111",
  marginBottom: 10,
  padding: 10,
  borderRadius: 8,
  cursor: "pointer"
};

const scrubber = {
  marginBottom: 20,
  padding: 10,
  background: "#111",
  borderRadius: 10
};
