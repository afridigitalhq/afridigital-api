import React from "react";
import AppShell from "./components/appshell/AppShell";
import useAfriOS from "./hooks/useAfriOS";

export default function App() {

  const user = {
    id: "demo-user",
    history: ["wallet", "jobs"],
    input: ""
  };

  const dataset = {
    jobs: [],
    earn: [],
    services: []
  };

  const os = useAfriOS(user, dataset);

  return (
    <AppShell>
      <pre style={{ color: "#0ff" }}>
        {JSON.stringify(os, null, 2)}
      </pre>
    </AppShell>
  );
}
