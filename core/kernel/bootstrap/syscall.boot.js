import { createRequire } from "module";

const require = createRequire(import.meta.url);
const { enforceNoMultipleInstances } = require("../_enforce/syscallgate.guard.cjs");

const mod = await import("../syscall/SyscallGate.hardened.cjs");
const SyscallGate = mod.SyscallGate;

enforceNoMultipleInstances();

export function createKernel(core){
  if(!core){
    throw new Error("Kernel boot failed: missing core runtime");
  }

  const gate = new SyscallGate(core);

  return {
    dispatch:(event)=>gate.dispatch(event),
    snapshot:()=>gate.snapshot ? gate.snapshot() : {},
    telemetry:()=>gate.telemetry ? gate.telemetry() : {},
    ledger:()=>gate.ledger ? gate.ledger() : [],
    gate
  };
}
