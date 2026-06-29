
const { getInbox } = require("./core/whatsapp-ci/inbox");

app.get("/api/whatsapp/inbox", (req, res) => {
  const role = req.query.role || "VIEWER";
  res.json(getInbox(role));
});

const { reviewPR, executeApprovedPR } = require("./core/whatsapp-ci/pr.engine");

app.post("/api/whatsapp/pr/action", express.json(), (req, res) => {
  try {
    const { prId, reviewerId, action } = req.body;

    const pr = reviewPR({
      prId,
      reviewerId,
      action
    });

    let result = null;

    if (action === "APPROVE") {
      result = executeApprovedPR(pr);
    }

    res.json({
      status: pr.status,
      pr,
      result
    });

  } catch (e) {
    res.status(500).json({ error: "PR_ACTION_FAILED" });
  }
});
