const { inspectSystem } = require("../services/systemInspector");
const { previewCommand } = require("../services/commandPreview");

function status(req,res){
  res.json(inspectSystem());
}

function preview(req,res){
  const cmd = req.body?.command || "";
  res.json(previewCommand(cmd));
}

module.exports = {
  status,
  preview
};
