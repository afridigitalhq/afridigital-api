import { useWindowStore } from "../store/windowStore";

export default function StartMenu() {
  const { openWindow } = useWindowStore();

  const apps = [
    { id: "logs", title: "Logs", component: <div>System Logs</div> },
    { id: "flow", title: "FlowGraph", component: <div>FlowGraph Engine</div> },
    { id: "whatsapp", title: "WhatsApp", component: <div>Live Stream</div> }
  ];

  return (
    <div style={{
      position: "fixed",
      top: 10,
      left: 10,
      background: "rgba(10,15,25,0.7)",
      backdropFilter: "blur(20px)",
      padding: 10,
      borderRadius: 12,
      border: "1px solid rgba(0,229,255,0.2)"
    }}>
      <h4>🚀 Apps</h4>

      {apps.map(app => (
        <div
          key={app.id}
          onClick={() => openWindow(app)}
          style={{ cursor: "pointer", padding: 6 }}
        >
          {app.title}
        </div>
      ))}
    </div>
  );
}
