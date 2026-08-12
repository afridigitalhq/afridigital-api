const MockBuilderAdapter={
 name:"mock-builder",

 async generate(request={}){

  return {
   provider:this.name,
   project:{
    name:"generated-demo-app",
    type:"web-app",
    files:[
      "src/App.jsx",
      "src/main.jsx",
      "package.json"
    ]
   },
   prompt:request.prompt,
   status:"GENERATED"
  };

 }

};

export default MockBuilderAdapter;
