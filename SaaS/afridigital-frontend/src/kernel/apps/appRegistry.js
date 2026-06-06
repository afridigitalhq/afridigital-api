const apps = [
  { id: "dashboard", title: "Dashboard" },
  { id: "logs", title: "System Logs" },
  { id: "flowgraph", title: "FlowGraph" },
  { id: "monitor", title: "System Monitor" }
];

export const appRegistry = {
  init() {},

  getAll() {
    return apps;
  },

  find(id) {
    return apps.find(a => a.id === id);
  }
};
