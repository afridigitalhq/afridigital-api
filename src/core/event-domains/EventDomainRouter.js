export class EventDomainRouter {
  constructor() {
    this.domains = new Map();
  }

  register(domain, bus) {
    this.domains.set(domain, bus);
  }

  emit(domain, event, data) {
    this.domains.get(domain)?.emit(event, data);
  }

  on(domain, event, handler) {
    return this.domains.get(domain)?.on(event, handler);
  }
}
