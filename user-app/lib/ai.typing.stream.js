export class AiTypingStream {
  constructor(onUpdate, onFinish) {
    this.buffer = "";
    this.onUpdate = onUpdate;
    this.onFinish = onFinish;
  }

  start() {
    this.buffer = "";
    this.onUpdate("");
  }

  pushToken(token) {
    this.buffer += token;
    this.onUpdate(this.buffer);
  }

  finish() {
    this.onFinish(this.buffer);
  }

  // fallback simulator (when backend is not streaming yet)
  simulate(text, speed = 30) {
    this.start();

    let i = 0;
    const interval = setInterval(() => {
      if (i >= text.length) {
        clearInterval(interval);
        this.finish();
        return;
      }

      this.pushToken(text[i]);
      i++;
    }, speed);
  }
}
