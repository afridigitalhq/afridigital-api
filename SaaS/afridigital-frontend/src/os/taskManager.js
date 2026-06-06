import { Kernel } from "../kernel/core";

export function getProcesses() {
  return Array.from(Kernel.processes.values());
}
