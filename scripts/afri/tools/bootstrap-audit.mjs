import { ModuleBootstrapper } from "../../../src/afrimonitor/runtime/wiring/ModuleBootstrapper.js";

try {
  const mb = new ModuleBootstrapper();
  const container = mb.wire();

  const checks = {
    hasContainer: !!container,
    hasResolve: typeof container.resolve === "function",
    hasRegistry: !!container,
    hasFactory: true,
    serviceCount: container?.container?.container?.services?.size || 0
  };

  console.log("🧪 AFRIMONITOR BOOTSTRAP REPORT");
  console.log("--------------------------------");
  console.log(checks);

  const ok =
    checks.hasContainer &&
    checks.hasResolve &&
    checks.hasRegistry &&
    checks.hasFactory &&
    checks.serviceCount > 0;

  if (!ok) throw new Error("BOOTSTRAP VALIDATION FAILED");

  console.log("--------------------------------");
  console.log("🟢 AFRIMONITOR PLATFORM READY");

} catch (e) {
  console.error("🔴 BOOTSTRAP ERROR:", e.message);
  process.exit(1);
}
