const MockBuilderAdapter={
 name:"mock-builder",

 async generate(request={}){

  return {
   provider:this.name,

   project:{
    name:"afritodo",
    type:"web-app",

    files:{
      "src/App.jsx":`
import "./App.css";

export default function App(){

 const tasks=[
  {title:"Build AfriTodo",done:true},
  {title:"Connect AfriBuild",done:false},
  {title:"Deploy App",done:false}
 ];

 return (
  <div className="app">
   <div className="card">
    <h1>🚀 AfriTodo</h1>
    <p>Built with AfriBuild</p>

    {tasks.map((task,index)=>(
      <div className={task.done ? "task done":"task"} key={index}>
       <span>{task.done ? "✓":"○"}</span>
       {task.title}
      </div>
    ))}

   </div>
  </div>
 );
}
`,

      "src/App.css":`
:root{
 --primary:#2563eb;
 --background:#eef2ff;
 --card:#ffffff;
}

body{
 margin:0;
 font-family:Arial, sans-serif;
 background:var(--background);
}

.app{
 min-height:100vh;
 display:flex;
 justify-content:center;
 align-items:center;
}

.card{
 background:var(--card);
 padding:30px;
 border-radius:20px;
 box-shadow:0 10px 30px rgba(0,0,0,.12);
 width:320px;
}

h1{
 color:var(--primary);
}

.task{
 margin-top:15px;
 padding:12px;
 border-radius:12px;
 background:#f8fafc;
}

.done{
 text-decoration:line-through;
 opacity:.6;
}
`,

      "src/main.jsx":`
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";

ReactDOM.createRoot(
 document.getElementById("root")
).render(
 <App />
);
`,

      "package.json":`
{
 "name":"afritodo",
 "version":"1.0.0",
 "scripts":{
  "dev":"vite"
 },
 "dependencies":{
  "react":"latest",
  "react-dom":"latest",
  "vite":"latest"
 }
}
`
    }
   },

   buildIntelligence:{
    memoryUsed:(request.previousBuilds || []).length > 0,
    previousBuilds:(request.previousBuilds || []).map(
     build=>build.id
    ),
    learnedFrom:(request.previousBuilds || []).map(
     build=>build.type
    )
   },

   prompt:request.prompt,
   status:"GENERATED"
  };

 }

};

export default MockBuilderAdapter;
