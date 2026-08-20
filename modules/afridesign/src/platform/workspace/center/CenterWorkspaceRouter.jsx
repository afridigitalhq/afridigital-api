/**
 * AfriDesign Center Workspace Router
 *
 * Purpose:
 * Composes active workspace view.
 *
 * Rule:
 * Composition only.
 */

import CenterWorkspaceResolver
from "./CenterWorkspaceResolver";


import DesignWorkspace
from "../views/DesignWorkspace";


import CodeWorkspace
from "../views/CodeWorkspace";
import PreviewWorkspace
from "./views/PreviewWorkspace";




const views = {

 design: DesignWorkspace,

 code: CodeWorkspace,

 preview: PreviewWorkspace

};


export default function CenterWorkspaceRouter({

 mode="design"

}){


 const workspace =
   CenterWorkspaceResolver.resolve(
     mode
   );


 if(!workspace){

   return null;

 }


 const View =
   views[workspace.id];


 if(!View){

   return null;

 }


 return (

   <main className="center-workspace">

     <View />

   </main>

 );


}
