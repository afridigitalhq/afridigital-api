const releases=[];

const AfriDebugReleaseManager={

  create(input={}){

    const release={

      version:input.version||"1.0.0",

      notes:input.notes||"",

      createdAt:Date.now()

    };

    releases.push(release);

    return release;

  },

  stats(){

    return{

      releases:releases.length

    };

  }

};

export default AfriDebugReleaseManager;
