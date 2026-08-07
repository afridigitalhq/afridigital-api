/**
 * Visual Studio Sidebar
 *
 * Composition only.
 * Combines visual tools and project explorer.
 */

import VisualToolRail from "../tools/ui/VisualToolRail";
import PlatformExplorer from "../../../explorer/PlatformExplorer";

export default function VisualStudioSidebar(){

  return(

    <aside className="visual-studio-sidebar">

      <VisualToolRail />

      <PlatformExplorer />

    </aside>

  );

}
