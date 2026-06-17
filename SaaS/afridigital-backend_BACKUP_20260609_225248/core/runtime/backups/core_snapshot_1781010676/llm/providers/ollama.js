const http = require("http");

async function stream({ prompt, streamId, onToken }) {
  return new Promise((resolve, reject) => {

    const req = http.request({
      hostname: "127.0.0.1",
      port: 11434,
      path: "/api/generate",
      method: "POST",
      headers: { "Content-Type": "application/json" }
    });

    req.write(JSON.stringify({
      model: "qwen2:0.5b",
      prompt,
      stream: true
    }));

    req.end();

    req.on("response", (res) => {
      res.on("data", (chunk) => {
        const lines = chunk.toString().split("\n").filter(Boolean);

        for (const line of lines) {
          try {
            const json = JSON.parse(line);

            if (json.response && onToken) {
              onToken(json.response);
            }

            if (json.done) resolve();
          } catch {}
        }
      });
    });

    req.on("error", reject);
  });
}

module.exports = { stream };
