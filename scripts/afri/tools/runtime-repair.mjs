import { ModuleBootstrapper } from "../../../src/afrimonitor/runtime/wiring/ModuleBootstrapper.js";

try {
  const mb = new ModuleBootstrapper();
  const container = mb.wire();

  const report = {
    hasContainer: !!container,
    hasResolve: typeof container?.resolve === "function",
    hasRegistry: !!mb.registry,
    hasFactory: !!mb.factory,
    serviceCount:
      container?.container?.container?.services?.size || 0
  };

  console.log("🧪 AFRI RUNTIME REPAIR REPORT");
  console.log("--------------------------------");
  console.log(report);

  const ok =
    report.hasContainer &&
    report.hasResolve &&
    report.hasRegistry &&
    report.hasFactory &&
    report.serviceCount > 0;

  if (!ok) throw new Error("RUNTIME REPAIR FAILED");

  console.log("--------------------------------");
  console.log("🟢 RUNTIME LAYER STABLE");

} catch (e) {
  console.error("🔴 RUNTIME ERROR:", e.message);
  process.exit(1);
}
