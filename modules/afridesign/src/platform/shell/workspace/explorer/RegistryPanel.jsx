/**
 * AfriDesign Registry Panel
 *
 * Purpose:
 * Composes AfriDigital landing components.
 *
 * Rule:
 * UI composition only.
 */

import RegistryItem from "./RegistryItem";
import PreviewConnector from "../../preview/PreviewConnector";

const components = [
  {
    id: "landing-navigation",
    name: "Landing Navigation",
    category: "landing"
  },

  {
    id: "landing-hero",
    name: "Landing Hero",
    category: "landing"
  },

  {
    id: "ecosystem-marquee",
    name: "Ecosystem Marquee",
    category: "landing"
  },

  {
    id: "tier-one-products",
    name: "Tier One Products",
    category: "landing"
  },

  {
    id: "tier-two-products",
    name: "Tier Two Products",
    category: "landing"
  },

  {
    id: "afri-ai-dock",
    name: "AfriAI Dock",
    category: "landing"
  },

  {
    id: "landing-footer",
    name: "Landing Footer",
    category: "landing"
  }
];

export default function RegistryPanel() {

  function handlePreview(component) {

    const previewRequest =
      PreviewConnector.selectComponent(component);

    console.log(
      "Preview Request:",
      previewRequest
    );
  }

  return (
    <div className="registry-panel">

      <h3>
        AfriDigital Landing Components
      </h3>

      <div className="registry-list">

        {components.map((component) => (
          <RegistryItem
            key={component.id}
            name={component.name}
            category={component.category}
            onPreview={() => handlePreview(component)}
          />
        ))}

      </div>

    </div>
  );
}
