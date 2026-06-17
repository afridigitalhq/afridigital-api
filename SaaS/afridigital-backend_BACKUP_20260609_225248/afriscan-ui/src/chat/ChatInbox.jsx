import { useEffect, useState } from "react";

export default function ChatInbox() {
  const [messages, setMessages] = useState([]);
  const [to, setTo] = useState("");
  const [text, setText] = useState("");

  useEffect(() => {
    const ws = new WebSocket("ws://localhost:9090");

    ws.onmessage = (msg) => {
      const data = JSON.parse(msg.data);

      if (data.type === "chat_message") {
        setMessages((prev) => [...prev, data.payload]);
      }
    };

    return () => ws.close();
  }, []);

  const sendMessage = async () => {
    await fetch("http://localhost:9090/whatsapp/send", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ to, message: text })
    });
  };

  return (
    <div style={{ padding: 20, color: "white" }}>
      <h2>📱 WhatsApp Control Room</h2>

      <div style={{ marginBottom: 20 }}>
        {messages.map((m, i) => (
          <div key={i} style={{ padding: 5, borderBottom: "1px solid #222" }}>
            <b>{m.from || "system"}:</b> {m.text}
          </div>
        ))}
      </div>

      <input
        placeholder="To"
        value={to}
        onChange={(e) => setTo(e.target.value)}
        style={{ display: "block", marginBottom: 10 }}
      />

      <textarea
        placeholder="Message"
        value={text}
        onChange={(e) => setText(e.target.value)}
        style={{ width: "100%", height: 80 }}
      />

      <button onClick={sendMessage} style={{ marginTop: 10 }}>
        Send
      </button>
    </div>
  );
}
