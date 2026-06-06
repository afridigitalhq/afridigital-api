import { useWindowStore } from "../store/windowStore";

export default function WindowManager({ children }) {
  const { windows, activeId, focusWindow, closeWindow, minimizeWindow } =
    useWindowStore();

  return (
    <>
      {windows.map((w, i) => (
        !w.minimized && (
          <div
            key={w.id}
            onMouseDown={() => focusWindow(w.id)}
            style={{
              position: "absolute",
              top: w.y || 80,
              left: w.x || 80,
              width: w.width || 420,
              zIndex: activeId === w.id ? 999 : i,
              background: "rgba(10,15,25,0.65)",
              backdropFilter: "blur(20px)",
              border: "1px solid rgba(0,229,255,0.25)",
              borderRadius: 12,
              color: "#fff"
            }}
          >
            <div style={{
              display: "flex",
              justifyContent: "space-between",
              padding: 8,
              borderBottom: "1px solid rgba(255,255,255,0.1)"
            }}>
              <span>🪟 {w.title}</span>

              <div style={{ display: "flex", gap: 8 }}>
                <button onClick={() => minimizeWindow(w.id)}>➖</button>
                <button onClick={() => closeWindow(w.id)}>✖</button>
              </div>
            </div>

            <div style={{ padding: 12 }}>
              {w.component}
            </div>
          </div>
        )
      ))}
    </>
  );
}
