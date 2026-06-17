const Base = require('./base');

class OllamaProvider extends Base {
  constructor() {
    super("ollama");
    this.url = "http://127.0.0.1:11434/api/generate";
  }

  async generate({ text, model = "qwen2:0.5b" }) {
    const res = await fetch(this.url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model,
        prompt: text,
        stream: true
      })
    });

    if (!res.ok) throw new Error("Ollama failed");

    return res.body; // raw stream (we normalize later)
  }
}

module.exports = new OllamaProvider();
