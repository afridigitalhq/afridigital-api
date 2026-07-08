import { cameraHealthMonitor } from "../../health/CameraHealthMonitor.js";
import { systemHealthMonitor } from "../../resilience/health/SystemHealthMonitor.js";
import { operationsMetricsCollector } from "../metrics/OperationsMetricsCollector.js";
import { auditEventIntelligence } from "../audit/AuditEventIntelligence.js";
import { systemPerformanceReporter } from "../reports/SystemPerformanceReporter.js";
import { adminOperationsDataProvider } from "../dashboard/AdminOperationsDataProvider.js";


class ObservabilityIntelligenceOrchestrator {


 observe(target){

  return {

   cameraHealth:
    cameraHealthMonitor.check
     ? cameraHealthMonitor.check(target)
     : null,


   systemHealth:
    systemHealthMonitor.check
     ? systemHealthMonitor.check(target)
     : null,


   metrics:
    operationsMetricsCollector.collect
     ? operationsMetricsCollector.collect(target)
     : null,


   audit:
    auditEventIntelligence.analyze
     ? auditEventIntelligence.analyze(target)
     : null,


   performance:
    systemPerformanceReporter.generate
     ? systemPerformanceReporter.generate(target)
     : null,


   dashboard:
    adminOperationsDataProvider.provide
     ? adminOperationsDataProvider.provide(target)
     : null,


   observedAt: Date.now()

  };

 }

}


export const observabilityIntelligenceOrchestrator =
 new ObservabilityIntelligenceOrchestrator();
