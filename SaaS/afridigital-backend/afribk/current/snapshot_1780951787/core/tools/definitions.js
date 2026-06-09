module.exports = [
  {
    name: "pricingTool",
    description: "Get product pricing information",
    args: {
      type: "object",
      properties: {}
    }
  },
  {
    name: "supportTool",
    description: "Create support ticket",
    args: {
      type: "object",
      properties: {}
    }
  },
  {
    name: "echoTool",
    description: "Echo generic messages",
    args: {
      type: "object",
      properties: {
        message: {
          type: "string"
        }
      }
    }
  }
];
