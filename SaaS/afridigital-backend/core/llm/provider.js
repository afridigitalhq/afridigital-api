const http = require("http");

/**
 * STREAMING OLLAMA ADAPTER
 * - sends prompt to local Ollama
 * - streams tokens back via callback
 */
async function streamLLM(prompt, onToken) {
  return new Promise((resolve, reject) => {
    const req = http.request(
      {
        hostname: "127.0.0.1",
        port: 11434,
        path: "/api/generate",
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        }
      },
      (res) => {
        let buffer = "";

        res.on("data", (chunk) => {
          buffer += chunk.toString();

          const lines = buffer.split("\n");
          buffer = lines.pop();

          for (const line of lines) {
            if (!line.trim()) continue;

            try {
              const json = JSON.parse(line);
              if (json.response) {
                onToken(json.response);
              }
              if (json.done) {
                resolve();
              }
            } catch (e) {}
          }
        });

        res.on("end", () => resolve());
      }
    );

    req.on("error", reject);

    req.write(
      JSON.stringify({
        model: "llama3",
        prompt,
        stream: true
      })
    );

    req.end();
  });
}

module.exports = { streamLLM };
