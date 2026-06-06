import { useEffect, useState } from "react";
import { io } from "socket.io-client";

export default function AdminHome() {
  const [events, setEvents] = useState([]);
  const [logs, setLogs] = useState([]);
  const [aiCmd, setAiCmd] = useState("");

  useEffect(() => {
    const socket = io("https://afridigital-api.onrender.com");

    socket.on("whatsapp:event", (data) => {
      setEvents((p) => [data, ...p]);
    });

    socket.on("system:log", (log) => {
      setLogs((p) => [log, ...p]);
    });

    socket.on("ai:event", (msg) => {
      setLogs((p) => [{ type: "ai", msg }, ...p]);
    });

    return () => socket.disconnect();
  }, []);

  const runCommand = (cmd) => {
    const c = cmd.toLowerCase();

    if (c.includes("open logs")) {
      alert("Logs panel active");
    }

    if (c.includes("whatsapp")) {
      alert("WhatsApp stream active");
    }

    setAiCmd("");
  };

  return (
    <div style={styles.shell}>
      {/* TOP BAR */}
      <div style={styles.topbar}>
        <h2>🧠 AfriDigital V10-C OS Controller</h2>
        <input
          value={aiCmd}
          onChange={(e) => setAiCmd(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && runCommand(aiCmd)}
          placeholder="AI command: open logs / whatsapp / system status"
          style={styles.input}
        />
      </div>

      {/* GRID */}
      <div style={styles.grid}>
        <div style={styles.panel}>
          <h3>📡 System Logs</h3>
          {logs.map((l, i) => (
            <div key={i} style={styles.item}>
              {JSON.stringify(l)}
            </div>
          ))}
        </div>

        <div style={styles.panel}>
          <h3>📱 WhatsApp Stream</h3>
          {events.map((e, i) => (
            <div key={i} style={styles.item}>
              <b>{e.from}</b>: {e.text}
            </div>
          ))}
        </div>

        <div style={styles.panel}>
          <h3>🤖 AI Stream</h3>
          <div style={styles.item}>AI orchestration layer active</div>
        </div>

        <div style={styles.panel}>
          <h3>⚙️ System Health</h3>
          <div style={styles.item}>API: CONNECTED</div>
          <div style={styles.item}>Socket: LIVE</div>
          <div style={styles.item}>Render Backend: OK</div>
        </div>
      </div>
    </div>
  );
}

const styles = {
  shell: {
    minHeight: "100vh",
    background: "linear-gradient(135deg,#05070f,#070b1a,#0a1024)",
    color: "#fff",
    fontFamily: "sans-serif",
    padding: 16,
  },
  topbar: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  input: {
    padding: 10,
    width: 320,
    borderRadius: 10,
    border: "1px solid rgba(0,229,255,0.3)",
    background: "rgba(255,255,255,0.05)",
    color: "#fff",
    outline: "none",
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: 12,
  },
  panel: {
    padding: 12,
    borderRadius: 14,
    background: "rgba(255,255,255,0.04)",
    border: "1px solid rgba(0,229,255,0.15)",
    backdropFilter: "blur(10px)",
  },
  item: {
    padding: 6,
    fontSize: 12,
    opacity: 0.9,
  },
};
