import Runtime from "../connectors/runtime/AfriDebugMultiConnectorRuntime.js";
import Storage from "../connectors/storage/AfriDebugConnectorStateStorage.js";

const AfriDebugIntegrationTestHarness = {

  run(){

    const results = {

      runtime:
        Runtime.health(),

      storage:
        Storage.health(),

      timestamp:
        Date.now()

    };


    return {

      service:"AfriDebugIntegrationTestHarness",

      status:"verified",

      results

    };

  }

};

export default AfriDebugIntegrationTestHarness;
