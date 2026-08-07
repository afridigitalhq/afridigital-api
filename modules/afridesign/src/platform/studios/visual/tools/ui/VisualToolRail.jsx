import VisualToolRegistry from "../registry/VisualToolRegistry";

export default function VisualToolRail(){

return(

<nav className="visual-tool-rail">

{VisualToolRegistry.map(group=>(

<section key={group.group} className="tool-group">

{group.tools.map(tool=>(

<button key={tool.id} title={tool.label} className="tool-button">

<span>{tool.icon}</span>

</button>

))}

</section>

))}

</nav>

);

}
