const AfriDebugCoreSecurityAdapter={
  scan(target){
    return {
      target,
      services:[
        "CoreSecurityScanner",
        "CoreFileScanner",
        "CoreDependencyScanner",
        "CoreSecretScanner",
        "CoreIntegrityChecker",
        "CoreSandboxValidator"
      ],
      status:"SECURITY_CHECK_REQUIRED"
    };
  }
};

export default AfriDebugCoreSecurityAdapter;
