export class DiscoveryEngine {
  constructor(scanner, matcher) {
    this.scanner = scanner;
    this.matcher = matcher;
  }

  async discover(options = {}) {
    const devices = await this.scanner.scan(options);
    return this.matcher.match(devices);
  }
}
