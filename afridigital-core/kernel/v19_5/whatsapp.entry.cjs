const { process } = require("./afriwork/pipeline.cjs");

function handleMessage(msg) {
  if (msg.text.includes("post job")) {
    return process({
      title: msg.text,
      owner: msg.user,
      type: "gig"
    });
  }

  if (msg.text.includes("find jobs")) {
    return { action: "SEARCH_JOBS" };
  }
}

module.exports = { handleMessage };
