import React from "react";
import { useLocation, useNavigate } from "react-router-dom";

const links = [
  { path: "/", label: "Home" },
  { path: "/chat", label: "Chat" },
  { path: "/services", label: "Services" },
  { path: "/jobs", label: "Jobs" },
  { path: "/earn", label: "Earn" },
  { path: "/boost", label: "Boost" },
  { path: "/social", label: "Social" },
  { path: "/wallet", label: "Wallet" },
  { path: "/profile", label: "Profile" }
];

export default function Sidebar() {
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <div style={styles.sidebar}>
      <h3 style={{ color: "#00e5ff" }}>AfriDigital</h3>

      {links.map((item) => {
        const active = location.pathname === item.path;

        return (
          <div
            key={item.path}
            onClick={() => navigate(item.path)}
            style={{
              ...styles.item,
              background: active
                ? "rgba(0,229,255,0.15)"
                : "rgba(255,255,255,0.02)",
              borderLeft: active ? "3px solid #00e5ff" : "3px solid transparent"
            }}
          >
            {item.label}
          </div>
        );
      })}
    </div>
  );
}

const styles = {
  sidebar: {
    width: "220px",
    padding: "12px",
    background: "rgba(255,255,255,0.03)",
    borderRight: "1px solid rgba(255,255,255,0.08)"
  },
  item: {
    padding: "10px",
    marginTop: "6px",
    borderRadius: "8px",
    cursor: "pointer",
    transition: "all 0.2s ease"
  }
};
