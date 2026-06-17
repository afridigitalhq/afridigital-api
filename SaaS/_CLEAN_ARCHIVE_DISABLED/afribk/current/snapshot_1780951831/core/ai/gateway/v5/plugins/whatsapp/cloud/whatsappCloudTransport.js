let AUTH = {
  token: null,
  phoneId: null
};

module.exports.setAuth = (token, phoneId) => {
  AUTH.token = token;
  AUTH.phoneId = phoneId;
};

module.exports.sendText = async (to, text) => {
  console.log("📡 CLOUD SEND:", to);

  if (!AUTH.token || !AUTH.phoneId) {
    console.log("⚠️ Missing WhatsApp credentials (Render env not injected)");
    return { ok: false, error: "missing_credentials" };
  }

  const url = `https://graph.facebook.com/v19.0/${AUTH.phoneId}/messages`;

  const res = await fetch(url, {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${AUTH.token}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      messaging_product: "whatsapp",
      to,
      type: "text",
      text: { body: text }
    })
  });

  const data = await res.json().catch(() => ({}));

  return {
    status: res.status,
    body: data
  };
};
