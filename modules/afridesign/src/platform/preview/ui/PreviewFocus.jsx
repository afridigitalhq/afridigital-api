/**
 * AfriDesign Preview Focus
 *
 * Purpose:
 * Full device preview.
 *
 * Rule:
 * UI composition only.
 */

import PreviewFocusController
from "../PreviewFocusController";


export default function PreviewFocus(){

 const state =
   PreviewFocusController.current();


 return (

  <section className="preview-focus">


    <button

      onClick={() =>
        PreviewFocusController.back()
      }

    >

      ← Back To Devices

    </button>


    <header>

      <h2>

        {state.device?.name}

      </h2>


    </header>


    <main className="preview-device-frame">


       👁 Application Preview


    </main>


  </section>

 );

}
