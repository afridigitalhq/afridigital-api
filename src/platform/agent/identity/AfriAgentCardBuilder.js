import { initializeAfriCrypto } from "../../../africrypto/AfriCryptoRuntime.js";
import { getPublicWalletsForOwner } from "../../../africrypto/wallets/AfriCryptoPublicWalletProjection.js";

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

function getWalletPayments(ownerId) {
  initializeAfriCrypto();

  return {
    production: getPublicWalletsForOwner(ownerId).map(wallet => ({
      environment: wallet.environment,
      network: wallet.network,
      networkFamily: wallet.networkFamily,
      assetType: "NATIVE",
      asset: wallet.networkFamily === "EVM" ? "ETH" : null,
      address: wallet.address,
      receivingEnabled: wallet.receivingEnabled
    }))
  };
}

function baseCard(agent) {
  return {
    name: agent.name,
    ...(agent.iconUrl ? { iconUrl: agent.iconUrl } : {}),
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
    skills: agent.skills,
    payments: getWalletPayments(agent.ownerId)
  };
}

const AfriAgentCardBuilder = {
  build(agentKey) {
    const cards = {
      afriai: {
        ownerId: "afriai",
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
        ownerId: "afridigital",
        name: process.env.A2A_DEBUG_AGENT_NAME || "AfriDebug Agent",
        iconUrl: process.env.A2A_DEBUG_AGENT_ICON_URL || null,
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

      afrirea: {
        ownerId: "afridigital",
        name: process.env.A2A_REA_AGENT_NAME || "AfriREA Agent",
        description: "AfriDigital evidence-based research engine for public web sources and structured multi-source research through registered source adapters.",
        skills: [
          {
            id: "research.analyze",
            name: "AfriREA Website Research",
            description: "Fetch a public HTTPS website subject to robots policy and analyze its static HTML, metadata, headings, links and forms.",
            tags: ["website-research", "website-audit", "html-analysis", "metadata", "links", "forms", "evidence"],
            examples: ["Analyze the public website at https://example.com", "Inspect a public website metadata, headings and links"],
            inputSchema: {
              type: "object",
              required: ["url"],
              properties: { url: { type: "string", description: "A public HTTPS website URL to research." } },
              additionalProperties: false
            }
          },
          {
            id: "research.run",
            name: "AfriREA Structured Research",
            description: "Submit an objective, domain and bounded source list for evidence-backed structured research. HTTPS URL processing is currently implemented; other source types remain unsupported until their adapters are implemented.",
            tags: ["multi-source-research", "structured-research", "evidence", "provenance", "source-analysis"],
            examples: ["Research a technical topic using multiple public HTTPS URLs", "Compare findings from several public website sources"],
            inputSchema: {
              type: "object",
              required: ["objective", "domain", "sources"],
              properties: {
                objective: { type: "string", maxLength: 2000 },
                domain: { type: "string", pattern: "^[a-z0-9][a-z0-9._-]{0,63}$" },
                sources: {
                  type: "array",
                  minItems: 1,
                  maxItems: 30,
                  items: {
                    type: "object",
                    required: ["sourceId", "type", "origin"],
                    properties: {
                      sourceId: { type: "string" },
                      type: { type: "string", enum: ["URL", "SCREENSHOT", "DOCUMENT", "REPOSITORY", "API_SPEC", "WEB_APP", "ANDROID_APP", "AUDIO", "VIDEO", "DATASET"] },
                      origin: { type: "string", enum: ["PUBLIC_URL", "USER_UPLOAD", "CONNECTED_SOURCE", "INTERNAL_REFERENCE"] },
                      url: { type: "string" },
                      fileId: { type: "string" },
                      revision: { type: "string" },
                      metadata: { type: "object" }
                    },
                    additionalProperties: false
                  }
                },
                requirements: { type: "array", maxItems: 30, items: { type: "string", maxLength: 200 } },
                outputFormat: { type: "string", enum: ["structured_research"] },
                metadata: { type: "object" }
              },
              additionalProperties: false
            },
            outputSchema: {
              type: "object",
              properties: {
                service: { type: "string" },
                researchId: { type: "string" },
                objective: { type: "string" },
                domain: { type: "string" },
                status: { type: "string", enum: ["COMPLETED", "PARTIAL", "FAILED"] },
                sources: { type: "array" },
                findings: { type: "array" },
                evidence: { type: "array" },
                limitations: { type: "array" }
              }
            }
          }
        ]
      },
      afriforex: {
        ownerId: "afriforex",
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
