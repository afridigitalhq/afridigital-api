import axios from "axios";
import { commandBus } from "../commandBus.js";

/**
 * LLM Router (safe abstraction layer)
 * NEVER touches UI directly
 * ONLY outputs structured commands
 */

export const llmRouter = {
  async ask(prompt) {
    try {
      const res = await axios.post(
        "https://api.openai.com/v1/chat/completions",
        {
          model: "gpt-4o-mini",
          messages: [
            {
              role: "system",
              content:
                "You are an OS command engine. Output ONLY JSON commands. No explanations."
            },
            { role: "user", content: prompt }
          ]
        },
        {
          headers: {
            Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
            "Content-Type": "application/json"
          }
        }
      );

      const text = res.data.choices?.[0]?.message?.content;

      let command;
      try {
        command = JSON.parse(text);
      } catch (e) {
        console.log("LLM returned non-JSON:", text);
        return;
      }

      // SAFE EXECUTION LAYER
      commandBus.execute(command);
    } catch (err) {
      console.error("LLM ERROR:", err.message);
    }
  }
};
