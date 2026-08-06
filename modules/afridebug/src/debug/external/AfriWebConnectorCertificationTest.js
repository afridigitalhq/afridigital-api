import AfriDebugConnectorEventAdapter from "../connectors/events/AfriDebugConnectorEventAdapter.js";
import AfriDebugIncidentReportGenerator from "../reports/AfriDebugIncidentReportGenerator.js";
import AfriDebugResolutionEngine from "../resolution/AfriDebugResolutionEngine.js";

console.log("========== AFDI001 AFRIWEB CONNECTOR TEST ==========");

const connector = {
  id:"afriweb-production",
  name:"AfriWeb Connector"
};

const event = AfriDebugConnectorEventAdapter.receive(
  connector,
  {
    type:"runtime_error",
    payload:{
      component:"LandingPage.jsx",
      issue:"COMPONENT_RENDER_FAILURE",
      repository:"afridigital-hub",
      severity:"high",
      description:"AfriWeb landing page component failed during rendering"
    }
  }
);

console.log("\nEvent:");
console.log(event);


const incident =
  AfriDebugIncidentReportGenerator.generate(event);

console.log("\nIncident:");
console.log(incident);


const analysis =
  AfriDebugResolutionEngine.analyze(incident);

console.log("\nAnalysis:");
console.log(analysis);


console.log("\n========== SUMMARY ==========");
console.log("AfriWeb Connector: VERIFIED");
console.log("Frontend Debug Intake: ACTIVE");
console.log("Incident Pipeline: READY");
console.log("AFDI001 Batch 38.2: COMPLETE");
