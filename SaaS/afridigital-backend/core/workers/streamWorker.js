const { onJob } = require('../queue/jobQueue');
const { push } = require("../stream/pollStreamStore");
const llm = require('../llm/provider');

onJob('api.ai', async (payload) => {
  const { user, text, streamId } = payload;

  const prompt = `${user}: ${text}`;

  for await (const token of llm.generate(prompt)) {
    require("../stream/pollStreamStore").pushEvent(streamId, { type: "token", value: token });
  }

  require("../stream/pollStreamStore").pushEvent(streamId, { type: "done" });
});
