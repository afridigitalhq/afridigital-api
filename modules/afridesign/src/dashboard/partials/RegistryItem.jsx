/**
 * AfriDesign Registry Item
 *
 * Purpose:
 * Displays a draggable registry component.
 *
 * Rule:
 * UI composition only.
 */

import RegistryCompositionBridge from "./RegistryCompositionBridge";

export default function RegistryItem({
  name,
  category,
  onPreview
}) {

  function handleAdd() {

    RegistryCompositionBridge.addToCanvas({
      id: name.toLowerCase().replace(/\s+/g, "-"),
      name,
      category
    });

    if (onPreview) {
      onPreview();
    }

  }

  return (
    <div
      className="registry-item"
      onClick={handleAdd}
    >
      <strong>{name}</strong>

      <span>{category}</span>
    </div>
  );
}
