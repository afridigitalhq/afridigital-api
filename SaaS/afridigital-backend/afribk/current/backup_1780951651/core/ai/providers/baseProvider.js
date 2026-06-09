class BaseProvider {
  constructor(name) {
    this.name = name;
  }

  async stream({ text, onToken }) {
    throw new Error("stream() not implemented");
  }
}

module.exports = BaseProvider;
