import React from "react";

/**
 * 🪟 OS WINDOW WRAPPER
 */
export default function Window({ id, state, children }) {

  if (!state?.visible) return null;

  return (
    <div
      style={{
        position: "absolute",
        top: state.y,
        left: state.x,
        width: state.w,
        height: state.h,
        zIndex: state.z,
        background: "#111",
        border: "1px solid #333"
      }}
    >
      <div style={{ padding: 6, background: "#222" }}>
        🪟 {id}
      </div>

      <div style={{ padding: 10 }}>
        {children}
      </div>
    </div>
  );
}
