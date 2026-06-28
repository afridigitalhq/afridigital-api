export class SOCSandbox {

  async execute(command) {

    // Simulated isolation boundary
    return new Promise((resolve) => {

      setTimeout(() => {
        resolve({
          commandId: command.id,
          status: "EXECUTED_IN_SANDBOX",
          result: {
            ok: true,
            type: command.type,
            preview: "sandboxed output only"
          }
        });
      }, 50);
    });
  }
}
