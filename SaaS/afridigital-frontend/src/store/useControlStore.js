import { create } from "zustand";

export const useControlStore = create((set) => ({
  logs: [],
  events: [],
  traces: [],

  pushLog: (log) =>
    set((s) => ({ logs: [log, ...s.logs].slice(0, 200) })),

  pushEvent: (event) =>
    set((s) => ({ events: [event, ...s.events].slice(0, 200) })),

  pushTrace: (trace) =>
    set((s) => ({ traces: [trace, ...s.traces].slice(0, 200) })),
}));
