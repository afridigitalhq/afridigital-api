import { AfriDebugConnector } from "../integration/AfriDebugConnector.js";
import { AfriNucBatchPlanner } from "../batch/AfriNucBatchPlanner.js";
import { AfriNucBatchExecutor } from "../batch/AfriNucBatchExecutor.js";
import { AfriEvidenceGenerator } from "../evidence/AfriEvidenceGenerator.js";
import { AfriCertificationReport } from "../evidence/AfriCertificationReport.js";

export class AfriDebugToNucPipeline {

  async run(issue){

    const debug = new AfriDebugConnector();
    const planner = new AfriNucBatchPlanner();
    const executor = new AfriNucBatchExecutor();
    const evidenceEngine = new AfriEvidenceGenerator();
    const certification = new AfriCertificationReport();

    const investigation = debug.investigate(issue);

    const plan = planner.plan(
      investigation.recommendedActions.map(
        item=>item.module
      )
    );

    const execution = await executor.execute(
      plan.batches[0]
    );

    const evidence = evidenceEngine.generate(
      execution
    );

    const certificate = certification.certify(
      evidence
    );

    return {
      investigation,
      plan,
      execution,
      evidence,
      certificate
    };
  }
}
