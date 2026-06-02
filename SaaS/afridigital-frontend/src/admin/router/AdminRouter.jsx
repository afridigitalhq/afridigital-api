import { Routes, Route } from "react-router-dom";
import AdminShell from "../layout/AdminShell";
import plugins from "../plugins";

import Overview from "../pages/Overview";
import Traces from "../pages/Traces";
import Graph from "../pages/Graph";
import Metrics from "../pages/Metrics";
import Logs from "../pages/Logs";
import Store from "../pages/Store";

const map = {
  overview: Overview,
  traces: Traces,
  graph: Graph,
  metrics: Metrics,
  logs: Logs,
  store: Store
};

export default function AdminRouter() {
  return (
    <Routes>
      <Route path="/admin" element={<AdminShell />}>
        {plugins.map(p => {
          const Component = map[p.name];
          return (
            <Route
              key={p.name}
              path={p.name === "overview" ? "" : p.name}
              element={<Component />}
            />
          );
        })}
      </Route>
    </Routes>
  );
}
