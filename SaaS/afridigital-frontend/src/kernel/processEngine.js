export const ProcessEngine = {
  processes: new Map(),

  create(type, data) {
    const pid = Date.now().toString();

    const process = {
      pid,
      type,
      state: "running",
      data,
      createdAt: Date.now()
    };

    this.processes.set(pid, process);
    return process;
  },

  kill(pid) {
    const p = this.processes.get(pid);
    if (p) {
      p.state = "killed";
      this.processes.set(pid, p);
    }
  }
};
