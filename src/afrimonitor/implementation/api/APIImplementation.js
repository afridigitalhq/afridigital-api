export class APIImplementation {
  constructor() {
    this.name = "APIImplementation";
  }

  handle(request) {
    return { ok: true, request };
  }
}
