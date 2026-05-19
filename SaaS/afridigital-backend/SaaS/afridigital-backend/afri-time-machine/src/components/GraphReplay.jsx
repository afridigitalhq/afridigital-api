import React, { useEffect, useState } from "react";
import ReactFlow, { Background, Controls } from "reactflow";
import "reactflow/dist/style.css";

export default function GraphReplay() {

  const [traces, setTraces] = useState([]);
  const [playhead, setPlayhead] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  const load = async () => {
    try {
      const res = await fetch("http://localhost:3000/api/traces");
      const data = await res.json();
      setTraces(data.traces || []);
    } catch (e) {}
  };

  useEffect(() => {
    load();
    const t = setInterval(load, 1000);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    let t;
    if (isPlaying) {
      t = setInterval(() => {
        setPlayhead(p => Math.min(p + 1, traces.length));
      }, 800);
    }
    return () => clearInterval(t);
  }, [isPlaying, traces.length]);

  const visible = traces.slice(0, playhead);

  const getColor = (health) => {
    if (health === "OK") return "#00ff88";
    if (health === "WARN") return "#ffcc00";
    return "#ff4d4d";
  };

  const nodes = visible.map((t, i) => ({
    id: t.id,
    data: {
      label: t.event.stage,
      health: t.event.health
    },
    position: { x: i * 260, y: 160 },
    style: {
      background: getColor(t.event.health),
      color: "#000",
      padding: 10,
      borderRadius: 8,
      fontWeight: "bold"
    }
  }));

  const edges = visible.slice(1).map((t, i) => ({
    id: "e" + i,
    source: visible[i].id,
    target: t.id,
    animated: true,
    style: {
      stroke: getColor(t.event.health)
    }
  }));

  return (
    <div style={{ width: "100vw", height: "100vh", background: "#0b0f14" }}>

      <div style={{ padding: 10, color: "white" }}>
        <button onClick={() => setIsPlaying(!isPlaying)}>
          {isPlaying ? "Pause" : "Play"}
        </button>

        <input
          type="range"
          min="0"
          max={traces.length}
          value={playhead}
          onChange={(e) => setPlayhead(Number(e.target.value))}
          style={{ width: 320, marginLeft: 10 }}
        />
      </div>

      <ReactFlow nodes={nodes} edges={edges} fitView>
        <Background />
        <Controls />
      </ReactFlow>

    </div>
  );
}
