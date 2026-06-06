import { useEffect, useState } from "react";
import { executeCommand } from "../command/commandBus";
import { startVoiceControl } from "../voice/voiceController";

export default function AiController() {
  const [input, setInput] = useState("");

  useEffect(() => {
    // Auto-enable voice control
    startVoiceControl();
  }, []);

  return (
    <div style={{
      position: "fixed",
      top: 10,
      right: 10,
      width: 260,
      background: "rgba(10,15,25,0.7)",
      backdropFilter: "blur(20px)",
      border: "1px solid rgba(0,229,255,0.25)",
      borderRadius: 12,
      padding: 10,
      color: "#fff"
    }}>
      <h4>🧠 AI Controller</h4>

      <input
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="open logs / close flowgraph"
        style={{
          width: "100%",
          padding: 8,
          borderRadius: 8,
          border: "none",
          outline: "none"
        }}
      />

      <button
        onClick={() => {
          executeCommand(input);
          setInput("");
        }}
        style={{
          marginTop: 8,
          width: "100%",
          padding: 8,
          background: "#00e5ff",
          border: "none",
          borderRadius: 8
        }}
      >
        Execute
      </button>
    </div>
  );
}
