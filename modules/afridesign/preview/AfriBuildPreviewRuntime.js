const AfriBuildPreviewRuntime={

 create(workspace={}){

  return {
   previewId:"preview_"+Date.now(),
   workspace:workspace.workspace,
   files:workspace.files || [],
   mode:"WEB_PREVIEW",
   status:"PREVIEW_READY",
   createdAt:new Date().toISOString()
  };

 }

};

export default AfriBuildPreviewRuntime;
