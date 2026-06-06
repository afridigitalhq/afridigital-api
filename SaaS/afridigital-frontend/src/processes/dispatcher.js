import { Kernel } from "../kernel/core";

export function dispatch(event, data) {
  return Kernel.createProcess({
    event,
    data,
    state: "running"
  });
}
