import { sendAfriAI } from "./afriai.websocket";

export async function askAfriAI(message) {
  const text = String(message || "").trim();

  if (!text) {
    return {
      success: false,
      error: "EMPTY_MESSAGE"
    };
  }

  try {
    sendAfriAI(text);

    const res = await fetch("/api/afriai/ask", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ message: text })
    });

    return await res.json();

  } catch (e) {
    return {
      success: false,
      error: "AFRIAI_UNAVAILABLE"
    };
  }
}
