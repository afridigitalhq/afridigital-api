const axios = require("axios");

// ==============================
// AFRI AI RESPONSE ENGINE V1
// ==============================

exports.handleWebhook = async (req, res) => {
    try {
        const body = req.body;

        console.log("📩 Incoming WhatsApp payload:", JSON.stringify(body, null, 2));

        const message = body?.entry?.[0]?.changes?.[0]?.value?.messages?.[0];

        if (!message) return res.sendStatus(200);

        const from = message.from;
        const text = message.text?.body || "";

        console.log("👤 User:", from);
        console.log("💬 Message:", text);

        // ------------------------------
        // SIMPLE AI LOGIC (V1 ENGINE)
        // ------------------------------
        let reply = "🤖 I didn't understand that yet.";

        const lower = text.toLowerCase();

        if (lower.includes("hi") || lower.includes("hello")) {
            reply = "👋 Hello! I'm AfriAI. How can I help you today?";
        } 
        else if (lower.includes("price")) {
            reply = "💰 You can view pricing on AfriDigital Hub.";
        }
        else if (lower.includes("help")) {
            reply = "🧠 I can help with info, support, and automation.";
        }
        else {
            reply = "🤖 I'm still learning. Try: hi, price, or help.";
        }

        // ------------------------------
        // SEND RESPONSE BACK TO WHATSAPP
        // ------------------------------
        await axios.post(
            `https://graph.facebook.com/v25.0/${process.env.PHONE_NUMBER_ID}/messages`,
            {
                messaging_product: "whatsapp",
                to: from,
                text: { body: reply }
            },
            {
                headers: {
                    Authorization: `Bearer ${process.env.WHATSAPP_TOKEN}`,
                    "Content-Type": "application/json"
                }
            }
        );

        return res.sendStatus(200);

    } catch (err) {
        console.error("❌ AfriAI Error:", err.message);
        return res.sendStatus(500);
    }
};
