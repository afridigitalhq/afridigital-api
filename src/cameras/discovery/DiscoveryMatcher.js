export class DiscoveryMatcher {
  match(devices = []) {
    return devices.map(device => ({
      ...device,
      vendor: null,
      adapter: null,
      confidence: 0
    }));
  }
}
