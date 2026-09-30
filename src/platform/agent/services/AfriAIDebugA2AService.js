import AfriDebugInvestigationAPI
  from "../../../afridebug/interfaces/api/investigation/AfriDebugInvestigationAPI.js";

const AfriAIDebugA2AService = {

  async analyze(payload = {}, context = {}) {

    const submittedRepository =
      payload.repository && typeof payload.repository === "object"
        ? payload.repository
        : null;

    if (
      submittedRepository?.path ||
      submittedRepository?.repositoryPath
    ) {
      throw new Error("A2A_REPOSITORY_PATH_FORBIDDEN");
    }

    const repository = submittedRepository
      ? {
          name: submittedRepository.name || null,
          branch: submittedRepository.branch || "main",
          type: submittedRepository.type || "remote",
          url: submittedRepository.url || null
        }
      : null;

    const investigation =
      AfriDebugInvestigationAPI.create({
        objective:
          payload.objective ||
          "Diagnose the submitted repository/runtime issue",

        category:
          payload.category ||
          "DEBUG",

        constraints:
          Array.isArray(payload.constraints)
            ? payload.constraints
            : [],

        repository,

        handoffId:
          payload.handoffId ||
          context.taskId ||
          null,

        mode:
          "ROOT_CAUSE_ANALYSIS"
      });

    return {
      service: "AfriDebug",
      capability: "debug.analyze",
      investigation
    };

  }

};

export default AfriAIDebugA2AService;
