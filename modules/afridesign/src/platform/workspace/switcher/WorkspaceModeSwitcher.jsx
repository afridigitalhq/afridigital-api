/**
 * AfriDesign Workspace Mode Switcher
 *
 * Purpose:
 * Changes center workspace.
 *
 * Rule:
 * UI composition only.
 */

import WorkspaceModeRegistry
from "../modes/WorkspaceModeRegistry";


import WorkspaceModeController
from "./WorkspaceModeController";


export default function WorkspaceModeSwitcher(){

 return (

  <nav className="workspace-mode-switcher">


   {
    WorkspaceModeRegistry.map(mode => (

     <button

      key={mode.id}

      onClick={() =>
        WorkspaceModeController.switch(
          mode.id
        )
      }

     >

       {mode.icon}

       {" "}

       {mode.name}

     </button>

    ))
   }


  </nav>

 );

}
