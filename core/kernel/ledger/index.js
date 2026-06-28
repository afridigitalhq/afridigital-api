// AFRIKERNEL_GOVERNED_RUNTIME: ALL EXECUTION MUST FLOW VIA SYSCALLGATE
const { AuditLedger } = require("./AuditLedger");
const { ReplayEngine } = require("./ReplayEngine");
const { PDFExporter } = require("./PDFExporter");

const ledger = new AuditLedger();
const replay = new ReplayEngine(ledger);
const exporter = new PDFExporter();

module.exports = {
  ledger,
  replay,
  exporter
};
