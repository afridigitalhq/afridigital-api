import React, { useRef } from "react";

import SocLiveWall from "../../soc/livewall/SocLiveWall";
import DagWebGL from "../../dag/webgl/DagWebGL";
import NeuralSystemUI from "../../neural/ui/NeuralSystemUI";
import UnifiedConsciousUI from "../../conscious/ui/UnifiedConsciousUI";
import HealthDashboard from "../../health/HealthDashboard";

import { useLiveConsciousness } from "../hub/useLiveConsciousness";

export default function ConsciousnessShell() {
  const worldRef = useRef(null);

  const live = useLiveConsciousness();

  // convert Map → Array for renderer
  const nodes = Array.from(live.nodes.values());
  const edges = live.edges;

  return (
    <div style={styles.root}>

      <div style={styles.header}>
        🧠 LIVE CONSCIOUSNESS SYSTEM — REAL EVENT GRAPH
      </div>

      <div style={styles.world} ref={worldRef}>

        <div style={styles.layer}>
          <SocLiveWall events={edges} />
        </div>

        <div style={styles.layer}>
          <DagWebGL nodes={nodes} edges={edges} />
        </div>

        <div style={styles.layer}>
          <NeuralSystemUI />
        </div>

        <div style={styles.layer}>
          <HealthDashboard />
        </div>

        <div style={styles.overlay}>
          <UnifiedConsciousUI state={{ nodes, edges }} />
        </div>

      </div>

      <div style={styles.timeline}>
        ⏱ LIVE EVENTS: {edges.length} • NODES: {nodes.length}
      </div>

    </div>
  );
}

const styles = {
  root: {
    height: "100vh",
    width: "100vw",
    background: "#05060a",
    color: "#00c2ff",
    overflow: "hidden",
    fontFamily: "monospace"
  },
  header: {
    height: "40px",
    display: "flex",
    alignItems: "center",
    paddingLeft: "12px",
    borderBottom: "1px solid #1a1a1a"
  },
  world: {
    position: "relative",
    height: "calc(100vh - 80px)"
  },
  layer: {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%"
  },
  overlay: {
    position: "absolute",
    bottom: "20px",
    right: "20px",
    zIndex: 10
  },
  timeline: {
    height: "40px",
    display: "flex",
    alignItems: "center",
    paddingLeft: "12px",
    borderTop: "1px solid #1a1a1a"
  }
};
