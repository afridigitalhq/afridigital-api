const https = require("https");

const PAYSTACK_SECRET = process.env.PAYSTACK_SECRET || null;

function request(path, data) {
  return new Promise((resolve, reject) => {
    if (!PAYSTACK_SECRET) return resolve({ mock: true });

    const options = {
      hostname: "api.paystack.co",
      path,
      method: "POST",
      headers: {
        Authorization: `Bearer ${PAYSTACK_SECRET}`,
        "Content-Type": "application/json"
      }
    };

    const req = https.request(options, res => {
      let body = "";
      res.on("data", chunk => body += chunk);
      res.on("end", () => resolve(JSON.parse(body)));
    });

    req.on("error", reject);
    req.write(JSON.stringify(data));
    req.end();
  });
}

async function createPayment(email, amount) {
  return request("/transaction/initialize", {
    email,
    amount: amount * 100
  });
}

async function verify(ref) {
  return request(`/transaction/verify/${ref}`, {});
}

module.exports = { createPayment, verify };
