import { useState } from "react";
import AfriAIRuntime from "../runtime/AfriAIRuntime";

export default function AfriAIChatPanel(){

  const [message,setMessage] = useState("");
  const [messages,setMessages] = useState([]);

  async function send(){

    if(!message.trim()) return;

    const userMessage = message;

    setMessages(prev=>[
      ...prev,
      {
        role:"user",
        content:userMessage
      }
    ]);

    setMessage("");

    try{

      const response =
        await AfriAIRuntime.ask(userMessage);

      setMessages(prev=>[
        ...prev,
        {
          role:"ai",
          content:
            response.reply ||
            JSON.stringify(response)
        }
      ]);

    }catch(error){

      setMessages(prev=>[
        ...prev,
        {
          role:"ai",
          content:"AfriAI connection error"
        }
      ]);

    }

  }


  return (

    <div className="afriai-chat-panel">

      <div className="afriai-messages">

        {messages.map((item,index)=>(

          <div key={index}>
            <strong>{item.role}:</strong> {item.content}
          </div>

        ))}

      </div>


      <div className="afriai-input">

        <input
          value={message}
          onChange={e=>setMessage(e.target.value)}
          placeholder="Ask AfriAI..."
        />

        <button onClick={send}>
          Send
        </button>

      </div>

    </div>

  );

}
