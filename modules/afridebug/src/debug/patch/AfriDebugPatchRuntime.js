const patches = [];

const AfriDebugPatchRuntime = {

  propose(input = {}) {
    const patch = {
      id:`PATCH-${Date.now()}`,
      issue: input.issue || null,
      files: input.files || [],
      action: input.action || "analyze",
      status:"PROPOSED",
      createdAt:Date.now()
    };

    patches.push(patch);

    return patch;
  },

  approve(id) {
    const patch = patches.find(p => p.id === id);

    if (!patch) {
      return {
        success:false,
        reason:"PATCH_NOT_FOUND"
      };
    }

    patch.status="APPROVED";

    return {
      success:true,
      patch
    };
  },

  list() {
    return patches;
  },

  stats() {
    return {
      patches: patches.length
    };
  }

};

export default AfriDebugPatchRuntime;
