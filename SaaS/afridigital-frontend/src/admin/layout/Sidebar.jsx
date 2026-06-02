import { NavLink } from "react-router-dom";
import plugins from "../plugins/index";

export default function Sidebar() {
  return (
    <div style={{ width: 260, background: "#0f172a", color: "#fff" }}>
      <h3 style={{ padding: 12 }}>AfriDigital OS</h3>

      {plugins.filter(p => p.enabled).map(p => (
        <NavLink
          key={p.route}
          to={p.route}
          style={{ display: "block", padding: 10, color: "#fff" }}
        >
          {p.sidebar}
        </NavLink>
      ))}
    </div>
  );
}
