class OllamaProvider {
  constructor() {
    this.baseUrl = "http://127.0.0.1:11434";
  }

  async *generate({ text, model = "qwen2:0.5b" }) {
    try {
      const res = await fetch(`${this.baseUrl}/api/generate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ model, prompt: text, stream: true })
      });

      if (!res.ok) throw new Error("ollama fail");

      const reader = res.body.getReader();
      const decoder = new TextDecoder();

      while (true) {
        const { value, done } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value);
        for (const line of chunk.split("\n")) {
          try {
            const j = JSON.parse(line);
            if (j.response) yield { response: j.response };
          } catch {}
        }
      }
    } catch (e) {
      yield { response: "[OLLAMA_FALLBACK]" };
    }
  }
}
module.exports = new OllamaProvider();
