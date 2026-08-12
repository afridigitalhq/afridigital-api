
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
