import React, { useEffect, useState } from "react";
import FlowGraphView from "../../components/flowgraph/FlowGraphView";

export default function FlowGraphPage() {

  const [graph, setGraph] = useState({ nodes: [], edges: [] });
  const [selectedNode, setSelectedNode] = useState(null);

  useEffect(() => {

    const load = async () => {

      const res = await fetch("https://afridigital-fmdash.onrender.com/api/admin/flowgraph");
      const json = await res.json();

      setGraph(json.graph);
    };

    load();

    const interval = setInterval(load, 2000);

    return () => clearInterval(interval);

  }, []);

  return (
    <div style={{ display: "flex", height: "100vh", background: "#050b1a", color: "#0ff" }}>

      {/* GRAPH AREA */}
      <div style={{ flex: 3 }}>
        <FlowGraphView
          graph={graph}
          onSelectNode={setSelectedNode}
        />
      </div>

      {/* INSPECTOR PANEL */}
      <div style={{
        flex: 1,
        borderLeft: "1px solid #0ff3",
        padding: 20,
        overflow: "auto"
      }}>
        <h3>🧠 Node Inspector</h3>

        {selectedNode ? (
          <pre style={{ fontSize: 12 }}>
            {JSON.stringify(selectedNode, null, 2)}
          </pre>
        ) : (
          <p>Select a node to inspect AI decision trace</p>
        )}
      </div>

    </div>
  );
}
