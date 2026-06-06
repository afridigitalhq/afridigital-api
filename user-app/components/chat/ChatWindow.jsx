import React, { useState } from "react";
import { TokenStream } from "../../lib/token.stream";

export default function ChatWindow({ onSend }) {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [isStreaming, setStreaming] = useState(false);

  function handleSend() {
    if (!input) return;

    onSend(input);

    const stream = new TokenStream(
      (partial) => {
        setOutput(partial);
        setStreaming(true);
      },
      (final) => {
        setOutput(final);
        setStreaming(false);
      }
    );

    // 🔁 TEMP STREAM (until backend token stream is enabled)
    stream.simulate("Processing request through AfriAI execution engine...");

    setInput("");
  }

  return (
    <div className="card" style={{ display: "flex", flexDirection: "column", gap: "10px" }}>

      {/* LIVE OUTPUT */}
      <div style={{
        minHeight: "120px",
        padding: "10px",
        border: "1px solid rgba(255,255,255,0.05)",
        borderRadius: "8px"
      }}>
        {output || "AfriAI ready..."}
        {isStreaming && (
          <span style={{ opacity: 0.5 }}> ▍streaming</span>
        )}
      </div>

      {/* INPUT */}
      <input
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Ask AfriAI..."
        style={{
          padding: "10px",
          borderRadius: "8px",
          border: "1px solid rgba(255,255,255,0.1)",
          background: "transparent",
          color: "white"
        }}
      />

      {/* SEND */}
      <button
        onClick={handleSend}
        className="glow"
        style={{
          padding: "10px",
          background: "rgba(0,229,255,0.1)",
          color: "white",
          border: "1px solid rgba(0,229,255,0.3)",
          borderRadius: "8px",
          cursor: "pointer"
        }}
      >
        Send
      </button>

    </div>
  );
}
