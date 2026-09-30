import afriAIRuntime from "../../runtime/AfriAIRuntime.js";

const AfriAITaskExecutor = {
  async execute(task = {}) {
    const message = task.message || task.prompt || task.objective || "";

    if (!message.trim()) {
      return {
        ...task,
        status: "FAILED",
        error: "AFRIAI_TASK_MESSAGE_REQUIRED"
      };
    }

    const response = await afriAIRuntime.ask(
      message,
      task.context || {}
    );

    return {
      ...task,
      response,
      status: "EXECUTED"
    };
  }
};

export default AfriAITaskExecutor;
