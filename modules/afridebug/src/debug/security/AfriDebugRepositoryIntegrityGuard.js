const scans=[];

const PROTECTED_PATHS=[
  "src/core/afriai",
  "src/core/security",
  ".github/workflows"
];

const AfriDebugRepositoryIntegrityGuard={

  scan(input={}){

    const files=input.files||[];

    const protectedChanges=files.filter(file=>
      PROTECTED_PATHS.some(path=>file.startsWith(path))
    );

    const secrets=(input.secrets||[]);

    const dependencies=input.dependenciesChanged||false;

    const result={
      scanId:`SCAN-${Date.now()}`,
      protectedChanges,
      dependencyChanges:dependencies,
      secretsDetected:secrets,
      passed:
        protectedChanges.length===0 &&
        secrets.length===0,
      status:
        (protectedChanges.length===0 && secrets.length===0)
          ? "approved"
          : "review_required",
      scannedAt:Date.now()
    };

    scans.push(result);

    return result;

  },

  stats(){

    return{
      scans:scans.length
    };

  },

  health(){

    return{
      service:"AfriDebugRepositoryIntegrityGuard",
      status:"healthy"
    };

  }

};

export default AfriDebugRepositoryIntegrityGuard;
