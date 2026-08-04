import Lifecycle from "./lifecycle/AfriDebugConnectorLifecycleManager.js";
import Health from "./health/AfriDebugConnectorHealthMonitor.js";
import Events from "./events/AfriDebugEcosystemEventBus.js";
import Router from "./routing/AfriDebugCrossPlatformInvestigationRouter.js";
import Discovery from "./discovery/AfriDebugEcosystemDiscoveryRuntime.js";
import Dependency from "./dependency/AfriDebugRuntimeDependencyGraph.js";
import Aggregator from "./aggregation/AfriDebugEcosystemHealthAggregator.js";
import Certification from "./certification/AfriDebugEcosystemCertificationRuntime.js";

const modules=[
Lifecycle,
Health,
Events,
Router,
Discovery,
Dependency,
Aggregator,
Certification
];

const AfriDebugEcosystemRuntime={
health(){
return{
service:"AfriDebugEcosystemRuntime",
modules:modules.length,
components:modules.map(m=>m.health()),
status:modules.every(m=>m.health().status==="healthy")?"healthy":"degraded"
};
}
};

export default AfriDebugEcosystemRuntime;
