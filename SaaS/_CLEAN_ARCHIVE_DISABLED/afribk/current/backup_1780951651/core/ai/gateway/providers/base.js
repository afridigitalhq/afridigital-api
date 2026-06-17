class BaseProvider {
  constructor(name) {
    this.name = name;
  }

  async generate() {
    throw new Error("generate() not implemented");
  }
}

module.exports = BaseProvider;
