const { request } = require("undici");

async function post(url, { headers = {}, body = {} }) {
  const res = await request(url, {
    method: "POST",
    headers: {
      "content-type": "application/json",
      ...headers
    },
    body: JSON.stringify(body)
  });

  const data = await res.body.text();

  return {
    status: res.statusCode,
    data: safeParse(data)
  };
}

function safeParse(str) {
  try { return JSON.parse(str); }
  catch { return str; }
}

module.exports = { post };
