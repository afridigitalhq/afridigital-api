import React from "react";
import { getProcesses } from "../../os/taskManager";

export default function SystemMonitor() {
  const processes = getProcesses();

  return (
    <div>
      <h3>⚙️ System Monitor</h3>
      {processes.map((p) => (
        <div key={p.pid}>
          {p.pid} - {p.state}
        </div>
      ))}
    </div>
  );
}
