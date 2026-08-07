/**
 * AfriDesign Preview Workspace Shell
 *
 * Purpose:
 * Controls preview experience.
 *
 * Flow:
 * Canvas
 *   ↓
 * Preview Gallery
 *   ↓
 * Device Focus
 *   ↓
 * Back Gallery
 *   ↓
 * Exit Canvas
 *
 * Rule:
 * Composition only.
 */

import PreviewStateManager
from "../PreviewStateManager";

import PreviewGallery
from "../ui/PreviewGallery";

import PreviewFocus
from "../ui/PreviewFocus";


import PreviewGalleryController
from "../PreviewGalleryController";


export default function PreviewWorkspaceShell({

 project,

 onExit

}) {


 const state =
   PreviewStateManager.current();



 if(state.mode === "focus"){

   return (

    <PreviewFocus />

   );

 }



 if(state.mode === "gallery"){

   return (

    <PreviewGallery

      project={project}

    />

   );

 }



 return (

  <section className="preview-launch">


    <button

      onClick={() =>
        PreviewGalleryController.open(
          project
        )
      }

    >

      👁 Open Responsive Preview

    </button>


    <button

      onClick={() =>
        onExit &&
        onExit()
      }

    >

      ✕ Exit

    </button>


  </section>

 );


}
