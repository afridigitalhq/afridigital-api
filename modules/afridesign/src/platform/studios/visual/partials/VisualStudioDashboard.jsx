/**
 * Visual Studio Dashboard
 *
 * Composition only.
 * Combines dashboard and dock.
 */

import StudioDashboard from "../../../dashboard/StudioDashboard";
import PlatformDock from "../../../dock/PlatformDock";

export default function VisualStudioDashboard(){

  return(

    <>
      <StudioDashboard />

      <PlatformDock />

    </>

  );

}
