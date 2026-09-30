const BASE_URL =
  process.env.A2A_PUBLIC_BASE_URL ||
  "https://afridigital-api.onrender.com";

const SECURITY_SCHEMES = {
  afriHmac: {
    apiKeySecurityScheme: {
      description:
        "AfriDigital HMAC authentication using x-afri-agent-id, x-afri-timestamp, x-afri-nonce and x-afri-signature headers.",
      location: "header",
      name: "x-afri-signature"
    }
  }
};

function baseCard(agent) {
  return {
    name: agent.name,
    description: agent.description,
    version: "1.0.0",
    provider: {
      organization: "AfriDigital"
    },
    supportedInterfaces: [
      {
        url: BASE_URL,
        protocolBinding: "HTTP+JSON",
        protocolVersion: "1.0"
      }
    ],
    capabilities: {
      streaming: false,
      pushNotifications: false
    },
    securitySchemes: SECURITY_SCHEMES,
    securityRequirements: [
      {
        afriHmac: []
      }
    ],
    defaultInputModes: ["application/json"],
    defaultOutputModes: ["application/json"],
    skills: agent.skills
  };
}

const AfriAgentCardBuilder = {
  build(agentKey) {
    const cards = {
      afriai: {
        name: "AfriAI",
        description:
          "AfriDigital AI agent providing authenticated AI-agent assistance.",
        skills: [
          {
            id: "afriai.ask",
            name: "AfriAI Ask",
            description:
              "Submit an authenticated task to AfriAI for AI-agent assistance.",
            tags: ["ai", "afriai", "agent", "reasoning"],
            examples: ["What is AfriDigital?"]
          }
        ]
      },

      afridebug: {
        name: "AfriDebug",
        description:
          "AfriDigital software investigation agent for structured repository and runtime root-cause analysis.",
        skills: [
          {
            id: "debug.analyze",
            name: "AfriDebug Investigation & Root-Cause Analysis",
            description:
              "Submit a software or runtime problem to AfriDebug for structured investigation and root-cause analysis. Supports remote repository context, investigation objectives, categories, constraints and agent-to-agent handoff context.",
            tags: [
              "debugging",
              "root-cause-analysis",
              "software-engineering",
              "repository-analysis",
              "runtime-analysis",
              "incident-investigation",
              "evidence",
              "diagnostics",
              "ai-assisted-debugging",
              "agent-handoff"
            ],
            examples: [
              "Investigate why my API endpoint is returning HTTP 500.",
              "Find the likely root cause of this runtime failure in my repository.",
              "Analyze this software incident and produce structured investigation findings."
            ],
            inputSchema: {
              type: "object",
              properties: {
                objective: {
                  type: "string",
                  description: "The software or runtime problem to investigate."
                },
                category: {
                  type: "string",
                  description: "Investigation category supplied by the requesting agent."
                },
                constraints: {
                  type: "array",
                  items: {
                    type: "string"
                  },
                  description: "Constraints that should guide the investigation."
                },
                repository: {
                  type: "object",
                  properties: {
                    name: {
                      type: "string"
                    },
                    branch: {
                      type: "string"
                    },
                    type: {
                      type: "string",
                      description: "Repository source type, normally remote for A2A requests."
                    },
                    url: {
                      type: "string",
                      description: "Remote repository URL."
                    }
                  }
                },
                handoffId: {
                  type: "string",
                  description: "Optional identifier linking the investigation to an upstream agent workflow."
                }
              },
              required: ["objective"]
            },
            outputSchema: {
              type: "object",
              properties: {
                service: {
                  type: "string"
                },
                capability: {
                  type: "string"
                },
                investigation: {
                  type: "object",
                  description: "Structured investigation result containing investigation state, events and diagnostic artifacts."
                }
              }
            }
          }
        ]
      },

      afriforex: {
        name: "AfriForex",
        description:
          "AfriDigital multi-asset market intelligence agent providing structured multi-timeframe analysis across forex, crypto, commodities and stocks.",
        skills: [
          {
            id: "market.analyze",
            name: "AfriForex Multi-Asset Market Analysis",
            description:
              "Analyze forex, crypto, commodity and stock markets using multi-timeframe intelligence, momentum, market structure, economic-calendar context and optional cross-asset context.",
            tags: [
              "forex",
              "crypto",
              "commodities",
              "stocks",
              "multi-asset",
              "market-analysis",
              "multi-timeframe",
              "momentum",
              "market-structure",
              "economic-calendar",
              "cross-asset",
              "scalp",
              "intraday",
              "swing",
              "position"
            ],
            examples: [
              "Analyze EUR/USD across all available horizons.",
              "Analyze BTC/USDT across all available horizons.",
              "Analyze XAU/USD with cross-asset context enabled.",
              "Analyze AAPL across available market horizons."
            ]
          }
        ]
      }
    };

    const card = cards[agentKey];

    if (!card) return null;

    return baseCard(card);
  }
};

export default AfriAgentCardBuilder;
