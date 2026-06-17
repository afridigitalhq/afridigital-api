function enforce(provider) {
  if (!provider) throw new Error("Missing provider");

  if (provider.stream && !provider.generate) {
    provider.generate = provider.stream;
    delete provider.stream;
  }

  return provider;
}

module.exports = { enforce };
