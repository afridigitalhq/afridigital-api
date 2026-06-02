import React, { useEffect, useRef, useState } from "react";

/**
 * READ-ONLY TIME SCRUB BRIDGE
 * Connects backend timeline → FlowGraph renderer
 */
export default function FlowGraphTimeBridge({ engine, socket }) {
  const [timeIndex, setTimeIndex] = useState(0);
  const [timeline, setTimeline] = useState([]);

  useEffect(() => {
    // pull initial snapshot
    socket.emit("TIMELINE_REQUEST");

    socket.on("TIMELINE_DATA", (data) => {
      setTimeline(data || []);
    });

    return () => socket.off("TIMELINE_DATA");
  }, []);

  useEffect(() => {
    if (!engine || !timeline.length) return;

    const slice = timeline.slice(0, timeIndex);

    engine.loadFrame(slice); // READ ONLY RENDER UPDATE
  }, [timeIndex, timeline]);

  return (
    <div style={{ padding: 12 }}>
      <h3>🧠 Time Travel Scrubber</h3>

      <input
        type="range"
        min="0"
        max={timeline.length}
        value={timeIndex}
        onChange={(e) => setTimeIndex(Number(e.target.value))}
      />

      <div style={{ marginTop: 10 }}>
        <strong>Frame:</strong> {timeIndex} / {timeline.length}
      </div>
    </div>
  );
}
