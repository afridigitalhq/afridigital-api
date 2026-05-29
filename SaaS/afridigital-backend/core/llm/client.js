const https = require('https');

function callLLM(prompt) {
  return new Promise((resolve, reject) => {
    const payload = JSON.stringify({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: "You are AfriDigital AI agent. Be concise and structured." },
        { role: "user", content: prompt }
      ]
    });

    const req = https.request(process.env.LLM_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.LLM_KEY}`
      }
    }, (res) => {
      let data = "";

      res.on("data", chunk => data += chunk);
      res.on("end", () => {
        try {
          const json = JSON.parse(data);
          resolve(json?.choices?.[0]?.message?.content || "No response");
        } catch (e) {
          reject(e);
        }
      });
    });

    req.on("error", reject);
    req.write(payload);
    req.end();
  });
}

module.exports = { callLLM };
