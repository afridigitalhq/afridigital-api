import { EventEmitter } from "events";

export const Kernel = new EventEmitter();

Kernel.processes = new Map();

Kernel.createProcess = (proc) => {
  const pid = Date.now().toString();
  const process = { pid, state: "running", ...proc };
  Kernel.processes.set(pid, process);
  Kernel.emit("process:create", process);
  return process;
};
