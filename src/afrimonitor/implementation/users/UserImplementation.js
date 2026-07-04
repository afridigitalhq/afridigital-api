export class UserImplementation {
  constructor() {
    this.name = "UserImplementation";
    this.users = new Map();
  }

  createUser(id, data) {
    this.users.set(id, data);
    return { ok: true };
  }

  getUser(id) {
    return this.users.get(id) || null;
  }

  listUsers() {
    return Array.from(this.users.entries());
  }
}
