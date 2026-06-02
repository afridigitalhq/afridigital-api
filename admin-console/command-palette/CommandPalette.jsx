import React, { useState, useEffect } from "react";

/**
 * 🧠 AI OS COMMAND PALETTE UI
 * Ctrl+K style system control interface
 */
export default function CommandPalette({ socket }) {

  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);

  useEffect(() => {

    const handler = (e) => {
      if (e.key === "k" && e.ctrlKey) {
        setOpen(o => !o);
      }
    };

    window.addEventListener("keydown", handler);

    return () => window.removeEventListener("keydown", handler);

  }, []);

  useEffect(() => {

    if (!query) return;

    fetch(`/command/search?q=${query}`)
      .then(r => r.json())
      .then(setResults);

  }, [query]);

  function run(cmd) {
    socket.emit("COMMAND_RUN", {
      command: cmd,
      args: {}
    });

    setOpen(false);
  }

  if (!open) return null;

  return (
    <div style={{
      position: "fixed",
      top: "20%",
      left: "30%",
      width: "40%",
      background: "#111",
      border: "1px solid #333",
      padding: 10,
      zIndex: 9999
    }}>

      <input
        autoFocus
        placeholder="Search commands..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        style={{ width: "100%", padding: 8 }}
      />

      <div>
        {results.map((r, i) => (
          <div
            key={i}
            onClick={() => run(r)}
            style={{ padding: 6, cursor: "pointer" }}
          >
            {r}
          </div>
        ))}
      </div>

    </div>
  );
}
