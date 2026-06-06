import { useWindowStore } from "../store/windowStore";

export default function Taskbar() {
  const { windows, focusWindow, restoreWindow } = useWindowStore();

  return (
    <div style={{
      position: "fixed",
      bottom: 0,
      left: 0,
      right: 0,
      height: 50,
      background: "rgba(5,7,15,0.85)",
      backdropFilter: "blur(20px)",
      borderTop: "1px solid rgba(0,229,255,0.2)",
      display: "flex",
      alignItems: "center",
      gap: 10,
      padding: "0 10px"
    }}>
      {windows.map(w => (
        <div
          key={w.id}
          onClick={() => {
            restoreWindow(w.id);
            focusWindow(w.id);
          }}
          style={{
            padding: "6px 10px",
            borderRadius: 8,
            cursor: "pointer",
            background: "rgba(255,255,255,0.05)"
          }}
        >
          {w.title}
        </div>
      ))}
    </div>
  );
}
