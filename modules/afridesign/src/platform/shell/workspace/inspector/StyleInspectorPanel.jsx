/**
 * AfriDesign Style Inspector Panel
 *
 * Purpose:
 * Hosts the modular style inspector.
 *
 * Rule:
 * Composition only.
 */

import StyleInspector from "./style/StyleInspector";

export default function StyleInspectorPanel() {
  return (
    <aside className="style-inspector-panel">

      <h2>
        Style Inspector
      </h2>

      <StyleInspector />

    </aside>
  );
}
