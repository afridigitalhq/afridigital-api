import { registerStream } from "../../streams/StreamRegistry.js";

export class AutoEnrollmentFlow {
  constructor(enrollmentRegistry) {
    this.enrollmentRegistry = enrollmentRegistry;
  }

  async enroll(devices = []) {
    const enrolled = [];

    for (const device of devices) {
      if (!device?.ip) continue;

      const id = `${device.vendor || "unknown"}-${device.ip}`;

      const camera = {
        id,
        ip: device.ip,
        vendor: device.vendor || "unknown",
        adapter: device.adapter || "onvif",
        confidence: device.confidence || 0,
        streams: device.streams || {},
        status: "ACTIVE"
      };

      this.enrollmentRegistry?.register?.(camera);
      registerStream(camera);

      enrolled.push(camera);
    }

    return enrolled;
  }
}
