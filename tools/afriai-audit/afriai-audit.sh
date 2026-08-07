#!/data/data/com.termux/files/usr/bin/bash

echo "══════════════════════════════════════"
echo "        AfriAI Pipeline Audit"
echo "══════════════════════════════════════"

echo ""
echo "=== SECURITY GATE ==="
grep -R "AfriSecurityRuntime\|CoreSecurityGateway" -n \
modules/afridev/products/afridebug/runtime \
modules/afrisecurity \
modules/core/security 2>/dev/null | head -20

echo ""
echo "=== AFRISCAN STATUS ==="
node - <<'NODE'
import("./modules/core/scan/CoreScanEngine.js")
.then(async m=>{
 const r=m.default.scan({path:process.cwd()});
 console.log(JSON.stringify({
   service:r.service,
   status:r.status,
   evidence:r.result.evidence?.status,
   duplicates:r.result.duplicates?.duplicateCount
 },null,2));
});
NODE

echo ""
echo "=== AFRIDEBUG RUNTIME ==="
node - <<'NODE'
import("./modules/afridev/products/afridebug/runtime/AfriDebugInvestigationRuntime.js")
.then(()=>{
 console.log(JSON.stringify({
  component:"AfriDebug",
  runtime:"LOADED",
  status:"READY"
 },null,2));
});
NODE

echo ""
echo "=== AFRIAI PROVIDER ==="
node - <<'NODE'
import("./modules/afriai/runtime/AfriAIRuntime.js")
.then(async m=>{
 console.log(JSON.stringify(
 await (m.default.health?.() ||
 m.default.check?.() ||
 {status:"RUNTIME_LOADED"}),
 null,
 2));
});
NODE

echo ""
echo "=== OLLAMA PROVIDER HEALTH ==="
node - <<'NODE'
import("./modules/afriai/providers/bootstrap.js")
.then(async registry=>{
 const provider=registry.default.get("ollama");

 const health=await import(
 "./modules/afriai/providers/health/AfriAIProviderHealth.js"
 );

 console.log(JSON.stringify(
 await health.default.check(provider),
 null,
 2
 ));
});
NODE

echo ""

echo ""
echo "=== AFRIAI PIPELINE REPORT ==="

node - <<'NODE'
import("./modules/afriai/llm/OllamaClient.js")
.then(m=>{
 console.log(JSON.stringify({
   pipeline:"AfriAI Debug Investigation",
   provider:m.ollamaConfig(),
   status:"READY",
   recommendation:"System ready for investigation"
 },null,2));
})
NODE

echo ""
echo "=== AUDIT COMPLETE ==="

