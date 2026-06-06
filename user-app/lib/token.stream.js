export class TokenStream {
  constructor(onUpdate, onFinish) {
    this.buffer = "";
    this.onUpdate = onUpdate;
    this.onFinish = onFinish;
  }

  reset() {
    this.buffer = "";
    this.onUpdate("");
  }

  push(token) {
    this.buffer += token;
    this.onUpdate(this.buffer);
  }

  finish() {
    this.onFinish(this.buffer);
  }

  // fallback: simulate backend streaming if needed
  simulate(text, speed = 25) {
    this.reset();

    let i = 0;
    const interval = setInterval(() => {
      if (i >= text.length) {
        clearInterval(interval);
        this.finish();
        return;
      }

      this.push(text[i]);
      i++;
    }, speed);
  }
}
