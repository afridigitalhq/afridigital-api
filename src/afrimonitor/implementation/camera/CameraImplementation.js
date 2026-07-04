export class CameraImplementation {
  constructor() {
    this.name = "CameraImplementation";
  }

  capture() {
    return { ok: true, frame: "mock-frame" };
  }
}
