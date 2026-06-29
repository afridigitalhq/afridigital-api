export class PanicModeOverlay {
  activate(severity) {
    return {
      overlay: true,
      color: severity > 70 ? "deep-red" : "orange",
      shake: severity > 80,
      pulse: true,
      lockdownUI: severity > 90
    };
  }
}
