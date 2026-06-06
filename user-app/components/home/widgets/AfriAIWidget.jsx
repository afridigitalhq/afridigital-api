import React, { useState } from "react";
import BaseWidget from "./_BaseWidget";

export default function AfriAIWidget() {
  const [text, setText] = useState("");

  return (
    <BaseWidget title="🧠 AfriAI Assistant">
      <input
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Ask AfriAI..."
        style={{
          width: "100%",
          padding: "10px",
          background: "transparent",
          border: "1px solid rgba(255,255,255,0.2)",
          borderRadius: "8px",
          color: "white"
        }}
      />

      <div style={{ marginTop: "10px", opacity: 0.7 }}>
        Try: "find jobs", "check wallet", "earn tasks"
      </div>
    </BaseWidget>
  );
}
