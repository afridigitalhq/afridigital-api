const http = require('http');

class OllamaProvider {
  async generate({ text, model = "qwen2:0.5b" }) {
    const payload = JSON.stringify({
      model,
      prompt: text,
      stream: true
    });

    return {
      async *[Symbol.asyncIterator]() {
        const response = await new Promise((resolve, reject) => {
          const req = http.request({
            hostname: "127.0.0.1",
            port: 11434,
            path: "/api/generate",
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "Content-Length": Buffer.byteLength(payload)
            }
          }, (res) => {
            resolve(res);
          });

          req.on("error", reject);
          req.write(payload);
          req.end();
        });

        let buffer = "";

        for await (const chunk of response) {
          buffer += chunk.toString();

          const lines = buffer.split("\n");
          buffer = lines.pop();

          for (const line of lines) {
            if (!line.trim()) continue;

            try {
              const json = JSON.parse(line);
              if (json.response) {
                yield { response: json.response };
              }
            } catch {}
          }
        }
      }
    };
  }
}

module.exports = new OllamaProvider();
