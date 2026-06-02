import React, { useState } from "react";

/**
 * 🧠 FLOATING WINDOW SYSTEM
 * used for FlowGraph + inspectors
 */

export default function FloatingWindow({ title, children }) {

  const [pos, setPos] = useState({ x: 100, y: 100 });

  return (
    <div
      className="window"
      style={{
        transform: `translate(${pos.x}px, ${pos.y}px)`
      }}
    >

      <div className="header">
        {title}
      </div>

      <div className="body">
        {children}
      </div>

      <style>{`
        .window {
          position: absolute;
          width: 400px;
          height: 300px;
          background: #0f0f0f;
          border: 1px solid #333;
        }

        .header {
          height: 30px;
          background: #111;
          cursor: move;
          padding: 5px;
        }

        .body {
          padding: 10px;
          height: calc(100% - 30px);
          overflow: auto;
        }
      `}</style>

    </div>
  );
}
