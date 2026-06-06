import React, { useEffect, useState } from "react";
import { taskManager } from "../../kernel/desktop/taskManager.js";

export default function Taskbar() {
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    taskManager.subscribe(setTasks);
  }, []);

  return (
    <div style={{
      position: "absolute",
      bottom: 0,
      left: 0,
      right: 0,
      height: 50,
      display: "flex",
      gap: 10,
      padding: 8,
      background: "rgba(0,0,0,0.6)",
      backdropFilter: "blur(10px)"
    }}>
      {tasks.map(t => (
        <div
          key={t.id}
          style={{
            padding: "6px 12px",
            borderRadius: 8,
            background: t.active ? "#00e5ff" : "#222",
            color: "#fff",
            cursor: "pointer"
          }}
        >
          {t.title}
        </div>
      ))}
    </div>
  );
}
