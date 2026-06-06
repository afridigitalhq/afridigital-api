class CommandBus {
  constructor() {
    this.handlers = {};
  }

  register(cmd, handler) {
    this.handlers[cmd] = handler;
  }

  async execute(cmd, payload) {
    if (!this.handlers[cmd]) {
      console.warn("Unknown command:", cmd);
      return;
    }
    return await this.handlers[cmd](payload);
  }
}

export const commandBus = new CommandBus();
