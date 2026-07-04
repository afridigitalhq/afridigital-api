export class DiscoveryValidator {
  validate(device = {}) {
    return {
      valid: Boolean(device.id && device.name),
      errors: [
        ...(device.id ? [] : ["Missing device id"]),
        ...(device.name ? [] : ["Missing device name"])
      ]
    };
  }
}
