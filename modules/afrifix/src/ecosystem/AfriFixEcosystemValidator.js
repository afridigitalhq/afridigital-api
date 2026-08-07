import fs from "fs";

export class AfriFixEcosystemValidator {
  validate(modules = []) {
    const results = modules.map(module => ({
      module,
      status: fs.existsSync(`modules/${module}`)
        ? "READY"
        : "MISSING"
    }));

    const report = {
      component: "AfriFix Ecosystem Validator",
      status: results.every(r => r.status === "READY")
        ? "PASSED"
        : "FAILED",
      modules: results,
      timestamp: new Date().toISOString()
    };

    fs.writeFileSync(
      "modules/afrifix/evidence/ecosystem-validation.json",
      JSON.stringify(report, null, 2)
    );

    return report;
  }
}
