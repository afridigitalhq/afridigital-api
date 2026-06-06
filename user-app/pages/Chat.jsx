import React, { useEffect, useState } from "react";
import PageLayout from "../components/ui/PageLayout";
import ChatWindow from "../components/chat/ChatWindow";
import ExecutionTrace from "../components/chat/ExecutionTrace";
import { createRealtimeClient } from "../lib/realtime.client";
import { AIMemory } from "../lib/ai.memory";

export default function Chat() {
  const [trace, setTrace] = useState([]);
  const [messages, setMessages] = useState([]);
  const [memory] = useState(() => new AIMemory());

  useEffect(() => {
    const rt = createRealtimeClient((event) => {

      memory.addTrace({
        step: event.type || "EVENT",
        detail: JSON.stringify(event.payload || event)
      });

      setTrace(memory.session.lastTrace);

      if (event.type === "CHAT_FLOW") {
        const msg = event.result?.message || "Processed";

        memory.addMessage("system", msg);

        setMessages([...memory.session.messages]);

        memory.setIntent(event.intent || null);
      }
    });

  }, []);

  async function handleSend(message) {

    memory.addMessage("user", message);
    setMessages([...memory.session.messages]);

    setTrace((prev) => [
      ...prev,
      { step: "USER_INPUT", detail: message }
    ]);

    await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        message,
        traceId: Date.now().toString(),
        context: memory.getContext()
      })
    });
  }

  return (
    <PageLayout
      title="AfriAI Chat"
      subtitle="Memory-aware conversational system"
    >

      <div style={{
        display: "grid",
        gridTemplateColumns: "1fr 1fr",
        gap: "15px"
      }}>

        {/* CHAT */}
        <div className="card">
          <ChatWindow onSend={handleSend} />

          <div style={{ marginTop: "10px" }}>
            {messages.map((m, i) => (
              <p key={i}>
                <b>{m.role}:</b> {m.text}
              </p>
            ))}
          </div>
        </div>

        {/* TRACE */}
        <ExecutionTrace trace={trace} />

      </div>

    </PageLayout>
  );
}
