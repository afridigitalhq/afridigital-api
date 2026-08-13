/**
 * AfriDesign Workspace Router
 * Rendering layer only.
 */

import DesignWorkspace from "../workspace/views/DesignWorkspace";
import CodeWorkspace from "../workspace/views/CodeWorkspace";
import FullPreviewWorkspace from "../workspace/views/FullPreviewWorkspace";
import AfriAIWorkspace from "../workspace/views/AfriAIWorkspace";
import MobileWorkspace from "../workspace/views/MobileWorkspace";
import AfriStudioRegistry from "../studios/AfriStudioRegistry";

export default function PlatformWorkspaceRouter({workspace}){

  const active = workspace?.id || "design";

  const studio =
    AfriStudioRegistry.find(
      item => item.workspace === active
    );

  if(active === "code"){
    return <CodeWorkspace />;
  }

  if(active === "preview"){
    return <FullPreviewWorkspace />;
  }

  if(active === "ai"){
    return <AfriAIWorkspace />;
  }

  if(studio?.workspace === "mobile"){
    return <MobileWorkspace />;
  }

  if(active === "debug" || active === "fix"){
    return (
      <div style={{
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "40px",
        textAlign: "center"
      }}>
        <div>
          <h2>{studio?.name || "Workspace"} is registered</h2>
          <p>Workspace surface is pending implementation.</p>
        </div>
      </div>
    );
  }

  return <DesignWorkspace />;

}
