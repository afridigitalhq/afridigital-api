const inspections=[];

const AfriDebugSafeArchiveRuntime={

  inspect(input={}){

    const files=input.files||[];

    const blocked=[];

    const allowed=[];

    for(const file of files){

      if(file.includes("../") || file.startsWith("/")){

        blocked.push({
          file,
          reason:"path_traversal"
        });

        continue;
      }

      if(/\.(exe|dll|bat|cmd|sh|apk)$/i.test(file)){

        blocked.push({
          file,
          reason:"executable_detected"
        });

        continue;
      }

      allowed.push(file);

    }

    const report={

      archiveId:`ARCHIVE-${Date.now()}`,

      archiveName:input.archiveName||"unknown",

      totalFiles:files.length,

      allowedFiles:allowed.length,

      blockedFiles:blocked.length,

      allowed,

      blocked,

      status:blocked.length
        ? "quarantine"
        : "approved",

      inspectedAt:Date.now()

    };

    inspections.push(report);

    return report;

  },

  list(){

    return inspections;

  },

  stats(){

    return{

      inspections:inspections.length

    };

  },

  health(){

    return{

      service:"AfriDebugSafeArchiveRuntime",

      status:"healthy"

    };

  }

};

export default AfriDebugSafeArchiveRuntime;
