import { useState } from "react";

export default function WhatsAppPanel() {
  const [to, setTo] = useState("");
  const [message, setMessage] = useState("");

  const sendMessage = async () => {
    await fetch("http://localhost:9090/whatsapp/send", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ to, message })
    });
  };

  return (
    <div style={{
      padding: 20,
      border: "1px solid #1f2a44",
      borderRadius: 10,
      marginTop: 20,
      color: "white"
    }}>
      <h3>📱 WhatsApp Control Panel</h3>

      <input
        placeholder="Recipient"
        value={to}
        onChange={(e) => setTo(e.target.value)}
        style={{ display: "block", marginBottom: 10 }}
      />

      <textarea
        placeholder="Message"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        style={{ display: "block", width: "100%", height: 80 }}
      />

      <button onClick={sendMessage} style={{ marginTop: 10 }}>
        Send
      </button>
    </div>
  );
}
