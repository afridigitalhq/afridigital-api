export class WarNarrator {
  speak(threatLevel) {
    if (typeof window === "undefined") return;

    const msg = new SpeechSynthesisUtterance();

    if (threatLevel > 80) {
      msg.text = "Critical system breach probability rising";
    } else if (threatLevel > 50) {
      msg.text = "Suspicious propagation detected across nodes";
    } else {
      msg.text = "System stable. Monitoring active threats.";
    }

    window.speechSynthesis.speak(msg);
  }
}
