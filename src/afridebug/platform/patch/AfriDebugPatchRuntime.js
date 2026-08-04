import ArtifactStorage from "../storage/AfriDebugArtifactStorage.js";

const patches=[];

const AfriDebugPatchRuntime={

  propose(input={}){

    const patch={
      id:`PATCH-${Date.now()}`,
      issue:input.issue || null,
      files:input.files || [],
      action:input.action || "repair",
      status:"PROPOSED",
      createdAt:Date.now()
    };


    patches.push(patch);


    ArtifactStorage.save(
      "patches",
      patch.id,
      patch
    );


    return patch;

  },


  approve(id){

    const patch=patches.find(
      x=>x.id===id
    );


    if(!patch){

      return {
        success:false,
        reason:"PATCH_NOT_FOUND"
      };

    }


    patch.status="APPROVED";


    ArtifactStorage.save(
      "patches",
      patch.id,
      patch
    );


    return {
      success:true,
      patch
    };

  },


  list(){

    return patches;

  }

};


export default AfriDebugPatchRuntime;
