/**
 * Visual Studio Workspace V2
 *
 * Uses the shared StudioLayout and StudioHeader.
 * Composition only.
 */

import StudioLayout from "../../../layout/workspace/StudioLayout";
import StudioHeader from "../../../layout/header/StudioHeader";

import VisualStudioSidebar from "../partials/VisualStudioSidebar";
import VisualStudioCanvas from "../partials/VisualStudioCanvas";
import VisualStudioInspector from "../partials/VisualStudioInspector";
import VisualStudioDashboard from "../partials/VisualStudioDashboard";

export default function VisualStudioWorkspace(){

  return(

    <StudioLayout

      Header={<StudioHeader />}

      Sidebar={<VisualStudioSidebar />}

      Canvas={<VisualStudioCanvas />}

      Inspector={<VisualStudioInspector />}

      Dashboard={<VisualStudioDashboard />}

    />

  );

}
