import React from "react";
import { useNavigate, useLocation } from "react-router-dom";

const items = [
  { name: "Home", path: "/" },
  { name: "Chat", path: "/chat" },
  { name: "Services", path: "/services" },
  { name: "Jobs", path: "/jobs" },
  { name: "Earn", path: "/earn" },
  { name: "Boost", path: "/boost" },
  { name: "Social", path: "/social" },
  { name: "Wallet", path: "/wallet" },
  { name: "Profile", path: "/profile" }
];

export default function Sidebar() {
  const nav = useNavigate();
  const location = useLocation();

  return (
    <div className="sidebar">
      <h2>AfriDigital</h2>

      {items.map(i => (
        <div
          key={i.path}
          onClick={() => nav(i.path)}
          style={{
            padding: "10px",
            cursor: "pointer",
            background: location.pathname === i.path ? "#1a2a55" : "transparent",
            borderRadius: "6px"
          }}
        >
          {i.name}
        </div>
      ))}
    </div>
  );
}
