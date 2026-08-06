import AfriAIErrorAnalyzer from "./AfriAIErrorAnalyzer.js";
import AfriAIStackTraceReader from "./AfriAIStackTraceReader.js";
import AfriAIImportTracer from "./AfriAIImportTracer.js";
import AfriAIBuildFailureAnalyzer from "./AfriAIBuildFailureAnalyzer.js";
import AfriAIRuntimeInspector from "./AfriAIRuntimeInspector.js";
import AfriAIDebugMemory from "./AfriAIDebugMemory.js";
import AfriAIKnowledgeGapAnalyzer from "./AfriAIKnowledgeGapAnalyzer.js";
import AfriAIRuntimeEvidenceCollector from "./AfriAIRuntimeEvidenceCollector.js";
import AfriAIKnowledgeRepairMapper from "./AfriAIKnowledgeRepairMapper.js";
import AfriAIKnowledgeRegistryLocator from "./AfriAIKnowledgeRegistryLocator.js";

const AfriDebugEngine = {

  analyze(input = {}){

    const report = {

      id:
        `DEBUG-${Date.now()}`,

      status:
        "ANALYZED",

      findings: [],

      createdAt:
        Date.now()

    };


    if(input.error){

      report.findings.push(
        AfriAIErrorAnalyzer.analyze(input.error)
      );

    }


    if(input.stack){

      report.findings.push(
        AfriAIStackTraceReader.read(input.stack)
      );

    }


    if(input.importTrace){

      report.findings.push(
        AfriAIImportTracer.analyze(
          input.importTrace
        )
      );

    }


    if(input.build){

      report.findings.push(
        AfriAIBuildFailureAnalyzer.analyze(
          input.build
        )
      );

    }


    if(input.runtime){

      report.findings.push(
        AfriAIRuntimeInspector.inspect(
          input.runtime
        )
      );

    }


    if(input.knowledge){

      report.findings.push(
        AfriAIKnowledgeGapAnalyzer.analyze(
          input.knowledge
        )
      );

    }


    if(input.aiResponse){

      const evidence =
        AfriAIRuntimeEvidenceCollector.collect(
          input.aiResponse
        );

      report.evidence = evidence;

      if(evidence.knowledge.response){

        const finding =
          AfriAIKnowledgeGapAnalyzer.analyze(
            evidence.knowledge
          );

        report.findings.push(
          finding
        );

        report.repairPlan =
          AfriAIKnowledgeRepairMapper.map(
            finding
          );

        report.registryLocation =
          AfriAIKnowledgeRegistryLocator.locate(
            evidence.knowledge
          );

      }

    }


    AfriAIDebugMemory.remember(report);


    return report;

  }

};

export default AfriDebugEngine;
