import React from "react";

/**
 * 📊 DIFF VIEWER MODAL
 */

export default function DiffModal({ diff, onClose }) {
  if (!diff) return null;

  return (
    <div style={overlay}>
      <div style={modal}>
        <h2>📊 System Diff Viewer</h2>

        <pre>{JSON.stringify(diff, null, 2)}</pre>

        <button onClick={onClose}>Close</button>
      </div>
    </div>
  );
}

const overlay = {
  position: "fixed",
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  background: "rgba(0,0,0,0.7)"
};

const modal = {
  background: "#000",
  color: "#fff",
  padding: 20,
  margin: "10% auto",
  width: "60%",
  borderRadius: 10
};
