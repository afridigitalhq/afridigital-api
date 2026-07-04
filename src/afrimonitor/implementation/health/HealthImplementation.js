export class HealthImplementation {
  constructor() {
    this.name = "HealthImplementation";
  }
  check() { return { status: "ok" }; }
}
