import TimeMachine from '../timemachine/TimeMachine';
import { useState } from "react";
import "./App.css";
import LiveStream from "./LiveStream";

/**
 * AFRIAI CONTROL ROOM (A3 FIXED SHELL)
 * Clean dashboard taxonomy
 */

function App() {
  const [active, setActive] = useState("time-machine");

  const renderPanel = () => {
    switch (active) {

      case "time-machine":
        return <TimeMachine />;

      case "users":
        return <h1>👤 User Intelligence</h1>;

      case "whatsapp":
        return <h1>📡 WhatsApp OS</h1>;

      case "finance":
        return <h1>💰 Finance Engine</h1>;

      case "revenue":
        return <h1>📊 Revenue Engine</h1>;

      case "risk":
        return <h1>⚠️ Risk Monitor</h1>;

      case "kernel":
        return <h1>⚙️ Kernel Health</h1>;

      case "stream":
        return <div>
          <h1>🌐 Stream Bridge</h1>
          <LiveStream />
        </div>;

      case "watchdog":
        return <h1>🐕 Watch Dog</h1>;

      case "plugins":
        return <h1>🧩 Plug & Play Dashboards</h1>;

      default:
        return <h1>Unknown Module</h1>;
    }
  };

  return (
    <div className="afri-shell">

      {/* SIDEBAR */}
      <aside className="sidebar">
        <h2>AfriAI Control Room</h2>

        <button onClick={() => setActive("time-machine")}>🧠 Time Machine</button>
        <button onClick={() => setActive("users")}>👤 User Intelligence</button>
        <button onClick={() => setActive("whatsapp")}>📡 WhatsApp OS</button>
        <button onClick={() => setActive("finance")}>💰 Finance Engine</button>
        <button onClick={() => setActive("revenue")}>📊 Revenue Engine</button>
        <button onClick={() => setActive("risk")}>⚠️ Risk Monitor</button>
        <button onClick={() => setActive("kernel")}>⚙️ Kernel Health</button>
        <button onClick={() => setActive("stream")}>🌐 Stream Bridge</button>
        <button onClick={() => setActive("watchdog")}>🐕 Watch Dog</button>
        <button onClick={() => setActive("plugins")}>🧩 Plug & Play Dashboards</button>

      </aside>

      {/* MAIN PANEL */}
      <main className="panel">
        {renderPanel()}
      </main>

    </div>
  );
}

export default App;
