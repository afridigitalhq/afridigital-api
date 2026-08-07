export class AfriFixPipelineRegistry {
  constructor() {
    this.pipelines = {
      afridebug: "AfriFix Execution Pipeline",
      afrifix: "AfriFix Execution Pipeline",
      afriai: "AfriFix Execution Pipeline",
      afridesign: "AfriFix Execution Pipeline",
      core: "AfriFix Execution Pipeline",
      platform: "AfriFix Execution Pipeline"
    };
  }

  register(module, pipeline) {
    this.pipelines[module] = pipeline;
    return this.pipelines;
  }

  resolve(module) {
    return this.pipelines[module] || null;
  }

  list() {
    return this.pipelines;
  }
}
