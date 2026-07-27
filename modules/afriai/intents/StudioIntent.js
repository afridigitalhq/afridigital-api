import StudioKnowledge from "../knowledge/StudioKnowledge.js";

export function StudioIntent(message = "") {
  const text = message.toLowerCase();

  if (
    text.includes("studio") ||
    text.includes("design") ||
    text.includes("afriui") ||
    text.includes("africode") ||
    text.includes("afriapp") ||
    text.includes("afrigraphics") ||
    text.includes("afrivideo") ||
    text.includes("afritemplate")
  ) {

    const studios = Object.entries(StudioKnowledge.studios)
      .map(
        ([name, info]) =>
          `${name.replace("Studio"," Studio")} → ${info.ai}: ${info.purpose}`
      )
      .join("\n");

    return {
      handled: true,
      reply:
`${StudioKnowledge.name}

${StudioKnowledge.description}

Status: ${StudioKnowledge.status}

AI Studios:
${studios}

Planned capabilities:
${StudioKnowledge.plannedFeatures.join(", ")}`
    };
  }

  return { handled:false };
}

export default StudioIntent;
