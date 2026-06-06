class VoiceController {
  constructor() {
    this.recognition = null;
    this.enabled = false;
  }

  init(onCommand) {
    if (!("webkitSpeechRecognition" in window)) {
      console.warn("⚠️ Voice not supported in this environment");
      return;
    }

    this.recognition = new webkitSpeechRecognition();
    this.recognition.continuous = true;
    this.recognition.interimResults = false;

    this.recognition.onresult = (event) => {
      const text = event.results[event.results.length - 1][0].transcript;
      console.log("🎤 Voice:", text);
      onCommand(text);
    };

    this.recognition.start();
    this.enabled = true;
  }
}

export const voiceController = new VoiceController();
