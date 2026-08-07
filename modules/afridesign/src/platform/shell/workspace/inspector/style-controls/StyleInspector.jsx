/**
 * AfriDesign Style Inspector
 *
 * Purpose:
 * Composes design control sections.
 *
 * Rule:
 * Composition only.
 */

import LayoutControls from "./LayoutControls";
import BackgroundControls from "./BackgroundControls";
import EffectsControls from "./EffectsControls";
import ResponsiveControls from "./ResponsiveControls";

export default function StyleInspector() {
  return (
    <div className="style-inspector">

      <LayoutControls />

      <BackgroundControls />

      <EffectsControls />

      <ResponsiveControls />

    </div>
  );
}
