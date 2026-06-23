import React, { useState } from "react";

export default function AfriAICommandBox({ onCommand }) {
  const [text, setText] = useState("");

  const submit = () => {
    if (!text.trim()) return;
    onCommand(text);
    setText("");
  };

  return (
    <div style={{ display: "flex", gap: 10 }}>
      <input
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="AfriAI command..."
        style={{ flex: 1 }}
      />

      <button onClick={submit}>Send</button>

      <button onClick={() => alert("🎤 voice input placeholder")}>
        🎤
      </button>
    </div>
  );
}
