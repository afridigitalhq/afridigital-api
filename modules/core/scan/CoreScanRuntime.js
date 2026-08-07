import CoreRepositoryMapper from "./CoreRepositoryMapper.js";
import CoreDuplicateFinder from "./CoreDuplicateFinder.js";
import CoreSecurityRuntime from "../security/runtime/CoreSecurityRuntime.js";
import CoreDependencyGraph from "../dependency/CoreDependencyGraph.js";
import CoreEvidenceEngine from "../evidence/CoreEvidenceEngine.js";
import CoreScanReport from "./CoreScanReport.js";

const CoreScanRuntime = {

  execute(repository = {}) {

    const mapped = CoreRepositoryMapper.scan(repository);

    const duplicates = CoreDuplicateFinder.scan(
      mapped.files
    );

    const security = CoreSecurityRuntime.inspect(
      repository
    );

    const dependencies = CoreDependencyGraph.build({
      repository
    });

    const evidence = CoreEvidenceEngine.collect(
      "AFRISCAN_RESULT",
      {
        mapped,
        duplicates,
        security,
        dependencies
      }
    );

    return {
      component:"Core Scan Runtime",
      status:"SCAN_COMPLETED",
      mapped,
      duplicates,
      security,
      dependencies,
      evidence,
      completedAt:new Date().toISOString()
    };

  }

};

export default CoreScanRuntime;
