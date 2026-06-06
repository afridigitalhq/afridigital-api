import { osOrchestrator } from "../os/orchestrator/osOrchestrator";

/**
 * Frontend-safe OS bridge
 * UI → Orchestrator → Command Bus → State
 */
export const OS = {
  run(command, payload) {
    return osOrchestrator.execute(command, payload);
  }
};
