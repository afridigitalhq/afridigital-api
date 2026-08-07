/**
 * Visual Studio Inspector
 *
 * Composition only.
 * Combines visual inspector and properties.
 */

import VisualInspector from "../panels/VisualInspector";
import PlatformPropertiesPanel from "../../../properties/PlatformPropertiesPanel";

export default function VisualStudioInspector(){

  return(

    <aside className="visual-studio-inspector">

      <VisualInspector />

      <PlatformPropertiesPanel />

    </aside>

  );

}
