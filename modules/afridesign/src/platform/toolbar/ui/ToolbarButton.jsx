/**
 * AfriDesign Toolbar Button
 *
 * Purpose:
 * Displays single tool.
 *
 * Rule:
 * UI composition only.
 */

export default function ToolbarButton({

 tool,

 onClick

}){

 return (

  <button

   className="afri-toolbar-button"

   onClick={() =>
     onClick &&
     onClick(tool.id)
   }

  >

    <span>

      {tool.icon}

    </span>


    <label>

      {tool.name}

    </label>


  </button>

 );

}
