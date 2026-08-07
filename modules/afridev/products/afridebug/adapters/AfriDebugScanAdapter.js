import CoreScanEngine from "../../../../core/scan/CoreScanEngine.js";

const AfriDebugScanAdapter = {

  scan(repository = {}) {

    return CoreScanEngine.scan(
      repository
    );

  }

};

export default AfriDebugScanAdapter;
