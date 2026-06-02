import React from "react";
import Sidebar from "./components/Sidebar";

export default function AdminShell({ children }) {
  return (
    <div style={{ display: "flex", height: "100vh" }}>
      <Sidebar />

      <div style={{ flex: 1, background: "#0b0f14", color: "white" }}>
        {children}
      </div>
    </div>
  );
}
