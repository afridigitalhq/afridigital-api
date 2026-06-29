import React from "react";
import LiveDAGWebGL from "./dag/LiveDAGWebGL";
import EmbeddedTerminal from "./terminal/EmbeddedTerminal";
import AIForecastGlass from "./forecast/AIForecastGlass";

export default function AfriDigitalWarRoom() {
  return (
    <div className="afridigital-war-room">
      
      {/* LEFT COMMAND RAIL */}
      <div className="command-rail">
        <h2>AFRIDIGITAL SOC</h2>
        <ul>
          <li>Live DAG</li>
          <li>Forecast</li>
          <li>Terminal</li>
        </ul>
      </div>

      {/* MAIN DAG VIEW */}
      <div className="main-dag">
        <LiveDAGWebGL />
      </div>

      {/* FLOATING PANELS */}
      <div className="floating-panels">
        <AIForecastGlass />
        <EmbeddedTerminal />
      </div>

    </div>
  );
}
