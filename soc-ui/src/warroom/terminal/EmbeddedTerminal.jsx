import React from "react";

export default function EmbeddedTerminal() {
  return (
    <div className="soc-terminal-overlay">
      <div className="terminal-header">AfriDigital SOC Terminal</div>
      <pre className="terminal-body">
        $ run audit --soc {"{live:true}"}{"\n"}
        $ emit stream.watch --dag{"\n"}
        $ forecast.run --anomaly-check{"\n"}
      </pre>
    </div>
  );
}
