/**
 * AfriDesign Universal Toolbar
 *
 * Purpose:
 * Horizontal creation tools.
 *
 * Rule:
 * Composition only.
 */

import ToolbarResolver
from "../controller/ToolbarResolver";


import ToolbarButton
from "./ToolbarButton";


export default function UniversalToolbar({

 workspace="website"

}){


 const tools =
   ToolbarResolver.resolve(
     workspace
   );


 return (

  <nav className="afri-universal-toolbar">


   {
    tools.map(tool => (

      <ToolbarButton

        key={tool.id}

        tool={tool}

      />

    ))
   }


   <button>

     ＋ More

   </button>


  </nav>

 );


}
