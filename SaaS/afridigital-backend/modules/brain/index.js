const memory=require('../memory');function buildPrompt({channel,userId,message}){const ctx=memory.getContext(channel,userId);const profile=memory.getProfile(userId);return {system:`You are AfriDigital AI.
You maintain continuity across WhatsApp, Web, and Telegram.
You remember user behavior and adapt personality over time.

USER PROFILE:
${JSON.stringify(profile,null,2)}

RECENT CONTEXT:
${ctx.summary}
`,user:message,meta:{channel,userId,sessionId:ctx.sessionId}};}module.exports={buildPrompt};
